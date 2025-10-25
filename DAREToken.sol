// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DAREToken
 * @dev ERC-20 utility token for the Base Raffle ecosystem
 * Can be used for rewards, governance, or additional features
 */
contract DAREToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    // Reward amounts
    uint256 public mintReward = 10 * 10**18;  // 10 DARE per mint
    uint256 public upvoteReward = 1 * 10**18; // 1 DARE per upvote
    uint256 public winReward = 1000 * 10**18; // 1000 DARE for raffle win
    
    // Authorized contracts
    mapping(address => bool) public authorizedMinters;
    
    event RewardDistributed(address indexed recipient, uint256 amount, string reason);
    event AuthorizedMinterUpdated(address indexed minter, bool authorized);
    
    constructor() ERC20("DARE Token", "DARE") Ownable(msg.sender) {
        // Mint initial supply to owner
        _mint(msg.sender, 100_000_000 * 10**18); // 100M initial supply
    }
    
    /**
     * @dev Set authorized minter contracts
     * @param minter Address of the minter contract
     * @param authorized Whether the address is authorized
     */
    function setAuthorizedMinter(address minter, bool authorized) public onlyOwner {
        authorizedMinters[minter] = authorized;
        emit AuthorizedMinterUpdated(minter, authorized);
    }
    
    /**
     * @dev Distribute reward to user
     * @param recipient Address to receive reward
     * @param amount Amount of tokens to mint
     * @param reason Reason for the reward
     */
    function distributeReward(
        address recipient,
        uint256 amount,
        string memory reason
    ) public {
        require(
            authorizedMinters[msg.sender] || msg.sender == owner(),
            "Not authorized"
        );
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        _mint(recipient, amount);
        emit RewardDistributed(recipient, amount, reason);
    }
    
    /**
     * @dev Update reward amounts
     * @param _mintReward New mint reward amount
     * @param _upvoteReward New upvote reward amount
     * @param _winReward New win reward amount
     */
    function updateRewards(
        uint256 _mintReward,
        uint256 _upvoteReward,
        uint256 _winReward
    ) public onlyOwner {
        mintReward = _mintReward;
        upvoteReward = _upvoteReward;
        winReward = _winReward;
    }
    
    /**
     * @dev Burn tokens
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
