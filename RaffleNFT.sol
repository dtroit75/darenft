// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RaffleNFT
 * @dev ERC-721 NFT contract with minting and upvoting functionality for raffle entries
 */
contract RaffleNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Mapping from tokenId to number of upvotes
    mapping(uint256 => uint256) public upvotes;
    
    // Mapping to track if an address has upvoted a specific token
    mapping(uint256 => mapping(address => bool)) public hasUpvoted;
    
    // Mapping from tokenId to story
    mapping(uint256 => string) public stories;
    
    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed owner, string story);
    event NFTUpvoted(uint256 indexed tokenId, address indexed voter, uint256 totalUpvotes);
    
    constructor() ERC721("Base Raffle NFT", "RAFFLE") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new NFT with metadata
     * @param story The story or description associated with the NFT
     * @param tokenURI The IPFS URI containing NFT metadata
     * @return tokenId The ID of the newly minted token
     */
    function mintNFT(string memory story, string memory tokenURI) 
        public 
        returns (uint256) 
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        stories[tokenId] = story;
        
        emit NFTMinted(tokenId, msg.sender, story);
        
        return tokenId;
    }
    
    /**
     * @dev Upvote an NFT to increase its raffle weight
     * @param tokenId The ID of the token to upvote
     */
    function upvoteNFT(uint256 tokenId) public {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) != msg.sender, "Cannot upvote your own NFT");
        require(!hasUpvoted[tokenId][msg.sender], "Already upvoted this NFT");
        
        upvotes[tokenId]++;
        hasUpvoted[tokenId][msg.sender] = true;
        
        emit NFTUpvoted(tokenId, msg.sender, upvotes[tokenId]);
    }
    
    /**
     * @dev Get the number of upvotes for a token
     * @param tokenId The ID of the token
     * @return The number of upvotes
     */
    function getUpvotes(uint256 tokenId) public view returns (uint256) {
        return upvotes[tokenId];
    }
    
    /**
     * @dev Get the total number of minted tokens
     * @return The total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
