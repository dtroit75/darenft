// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RaffleNFT.sol";

/**
 * @title RaffleManager
 * @dev Manages raffle rounds and uses Chainlink VRF for verifiable random winner selection
 */
contract RaffleManager is VRFConsumerBaseV2, Ownable {
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    RaffleNFT public immutable raffleNFT;
    
    // Chainlink VRF configuration
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_keyHash;
    uint32 private constant CALLBACK_GAS_LIMIT = 100000;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    
    // Raffle state
    enum RaffleStatus { Active, Drawing, Completed }
    
    struct Raffle {
        uint256 id;
        uint256 startTime;
        uint256 endTime;
        uint256 totalEntries;
        address winner;
        uint256 winningTokenId;
        RaffleStatus status;
        uint256 vrfRequestId;
    }
    
    uint256 public currentRaffleId;
    mapping(uint256 => Raffle) public raffles;
    mapping(uint256 => uint256) public vrfRequestToRaffleId;
    
    // Prize pool
    uint256 public prizePool;
    
    // Events
    event RaffleCreated(uint256 indexed raffleId, uint256 endTime);
    event WinnerSelected(
        uint256 indexed raffleId,
        address indexed winner,
        uint256 tokenId,
        uint256 randomness
    );
    event PrizePoolUpdated(uint256 newAmount);
    event PrizeClaimed(uint256 indexed raffleId, address indexed winner, uint256 amount);
    
    constructor(
        address vrfCoordinator,
        uint64 subscriptionId,
        bytes32 keyHash,
        address raffleNFTAddress
    ) 
        VRFConsumerBaseV2(vrfCoordinator) 
        Ownable(msg.sender)
    {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_subscriptionId = subscriptionId;
        i_keyHash = keyHash;
        raffleNFT = RaffleNFT(raffleNFTAddress);
    }
    
    /**
     * @dev Create a new raffle round
     * @param duration Duration of the raffle in seconds
     * @return raffleId The ID of the newly created raffle
     */
    function createRaffle(uint256 duration) public onlyOwner returns (uint256) {
        require(
            currentRaffleId == 0 || 
            raffles[currentRaffleId].status == RaffleStatus.Completed,
            "Previous raffle not completed"
        );
        
        currentRaffleId++;
        uint256 endTime = block.timestamp + duration;
        
        raffles[currentRaffleId] = Raffle({
            id: currentRaffleId,
            startTime: block.timestamp,
            endTime: endTime,
            totalEntries: raffleNFT.totalSupply(),
            winner: address(0),
            winningTokenId: 0,
            status: RaffleStatus.Active,
            vrfRequestId: 0
        });
        
        emit RaffleCreated(currentRaffleId, endTime);
        
        return currentRaffleId;
    }
    
    /**
     * @dev Draw a winner using Chainlink VRF
     * @param raffleId The ID of the raffle to draw
     */
    function drawWinner(uint256 raffleId) public onlyOwner {
        Raffle storage raffle = raffles[raffleId];
        
        require(raffle.status == RaffleStatus.Active, "Raffle not active");
        require(block.timestamp >= raffle.endTime, "Raffle not ended");
        require(raffle.totalEntries > 0, "No entries in raffle");
        
        raffle.status = RaffleStatus.Drawing;
        
        // Request randomness from Chainlink VRF
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS
        );
        
        raffle.vrfRequestId = requestId;
        vrfRequestToRaffleId[requestId] = raffleId;
    }
    
    /**
     * @dev Callback function called by Chainlink VRF with random number
     * @param requestId The VRF request ID
     * @param randomWords Array of random numbers
     */
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 raffleId = vrfRequestToRaffleId[requestId];
        Raffle storage raffle = raffles[raffleId];
        
        require(raffle.status == RaffleStatus.Drawing, "Invalid raffle status");
        
        // Calculate total weight (sum of all upvotes + base weight)
        uint256 totalWeight = 0;
        uint256 totalSupply = raffle.totalEntries;
        
        for (uint256 i = 0; i < totalSupply; i++) {
            // Each NFT has base weight of 1 + its upvotes
            totalWeight += 1 + raffleNFT.getUpvotes(i);
        }
        
        // Select winner based on weighted probability
        uint256 randomNumber = randomWords[0] % totalWeight;
        uint256 cumulativeWeight = 0;
        uint256 winningTokenId = 0;
        
        for (uint256 i = 0; i < totalSupply; i++) {
            cumulativeWeight += 1 + raffleNFT.getUpvotes(i);
            if (randomNumber < cumulativeWeight) {
                winningTokenId = i;
                break;
            }
        }
        
        address winner = raffleNFT.ownerOf(winningTokenId);
        
        raffle.winner = winner;
        raffle.winningTokenId = winningTokenId;
        raffle.status = RaffleStatus.Completed;
        
        emit WinnerSelected(raffleId, winner, winningTokenId, randomWords[0]);
    }
    
    /**
     * @dev Get current raffle information
     * @return All raffle details
     */
    function getCurrentRaffle() public view returns (
        uint256 id,
        uint256 startTime,
        uint256 endTime,
        uint256 totalEntries,
        address winner,
        RaffleStatus status
    ) {
        Raffle memory raffle = raffles[currentRaffleId];
        return (
            raffle.id,
            raffle.startTime,
            raffle.endTime,
            raffle.totalEntries,
            raffle.winner,
            raffle.status
        );
    }
    
    /**
     * @dev Claim prize for a completed raffle
     * @param raffleId The ID of the raffle
     */
    function claimPrize(uint256 raffleId) public {
        Raffle memory raffle = raffles[raffleId];
        
        require(raffle.status == RaffleStatus.Completed, "Raffle not completed");
        require(raffle.winner == msg.sender, "Not the winner");
        require(prizePool > 0, "No prize available");
        
        uint256 prize = prizePool;
        prizePool = 0;
        
        (bool success, ) = payable(msg.sender).call{value: prize}("");
        require(success, "Prize transfer failed");
        
        emit PrizeClaimed(raffleId, msg.sender, prize);
    }
    
    /**
     * @dev Add funds to the prize pool
     */
    function fundPrizePool() public payable onlyOwner {
        prizePool += msg.value;
        emit PrizePoolUpdated(prizePool);
    }
    
    /**
     * @dev Withdraw excess funds
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance - prizePool;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    receive() external payable {
        prizePool += msg.value;
        emit PrizePoolUpdated(prizePool);
    }
}
