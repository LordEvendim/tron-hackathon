// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract MiranCore is IERC721Receiver {
    struct Auction {
        address creator;
        address collectionAddress;
        uint256 tokenId;
        uint256 endingTime;
        uint256 price;
        address bidder;
    }

    struct TokenDetails {
        address collectionAddress;
        uint256 tokenId;
    }

    mapping(address => bytes32) public userAuctions;
    mapping(address => TokenDetails[]) public userTokens;
    mapping(bytes32 => Auction) public auctionById;

    mapping(address => uint256) public deposits;
    mapping(address => uint256) public lockedDeposits;

    mapping(address => mapping(address => mapping(uint256 => bool)))
        public isDepositedByUser;
    mapping(address => mapping(uint256 => bool)) public isTokenLocked;

    uint256 public BASE_AUCTION_DURATION = 60 * 60 * 24 * 7; // 7 days
    uint256 public BID_AUCTION_DURATION = 60 * 60 * 5; // 5 hours
    uint256 public MIN_REQUIRED_PRICE = 10000; // not relevant

    Auction[] public auctions;

    event Bid(
        address collectionAddress,
        uint256 tokenId,
        address bidder,
        uint256 price,
        uint256 endingTime
    );
    event Claimed(
        address collectionAddress,
        uint256 tokenId,
        address bidder,
        uint256 price
    );

    constructor() {}

    function deposit() external payable {
        require(msg.value > 0, "no deposit");

        deposits[msg.sender] += msg.value;
    }

    function withdraw() external {
        require(
            deposits[msg.sender] - lockedDeposits[msg.sender] > 0,
            "no available balance"
        );

        uint256 withdrawAmount = deposits[msg.sender] -
            lockedDeposits[msg.sender];

        deposits[msg.sender] -= withdrawAmount;

        payable(msg.sender).transfer(withdrawAmount);
    }

    function withdrawToken(address collectionAddress, uint256 tokenId)
        external
    {
        require(
            IERC721(collectionAddress).ownerOf(tokenId) == address(this),
            "contract not owner"
        );
        require(
            isDepositedByUser[msg.sender][collectionAddress][tokenId] == true,
            "user not deposited this token"
        );
        require(
            isTokenLocked[collectionAddress][tokenId] == false,
            "token locked"
        );

        isDepositedByUser[msg.sender][collectionAddress][tokenId] = false;
        IERC721(collectionAddress).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );
    }

    function bid(address collectionAddress, uint256 tokenId) external payable {
        bytes32 auctionId = getAuctionId(collectionAddress, tokenId);
        require(
            auctionById[auctionId].creator != msg.sender,
            "cannot bid your auctions"
        );
        require(msg.value > auctionById[auctionId].price, "bid too low");
        require(
            auctionById[auctionId].bidder != msg.sender,
            "cannot out bid yourself"
        );

        // lock deposit of the new bidder
        // unlock deposit of the previous bidder
        isTokenLocked[collectionAddress][tokenId] = true;
        lockedDeposits[msg.sender] += msg.value;
        lockedDeposits[auctionById[auctionId].bidder] -= auctionById[auctionId]
            .price;

        // set the new bidder and the new price
        auctionById[auctionId].bidder = msg.sender;
        auctionById[auctionId].price = msg.value;

        // if auction is about to finish increase the ending date
        if (
            block.timestamp + BID_AUCTION_DURATION >
            auctionById[auctionId].endingTime
        ) {
            auctionById[auctionId].endingTime =
                block.timestamp +
                BID_AUCTION_DURATION;
        }
    }

    function getAuctionId(address collectionAddress, uint256 tokenId)
        public
        pure
        returns (bytes32)
    {
        return sha256(abi.encode(collectionAddress, tokenId));
    }

    function createNewAuction(
        address collectionAddress,
        uint256 tokenId,
        uint256 startingPrice
    ) external payable returns (bytes32) {
        require(startingPrice > MIN_REQUIRED_PRICE, "too low price");

        bytes32 auctionId = getAuctionId(collectionAddress, tokenId);

        require(
            isTokenLocked[collectionAddress][tokenId] == false,
            "already auctioned"
        );

        Auction memory newAuction = Auction(
            msg.sender,
            collectionAddress,
            tokenId,
            block.timestamp + BASE_AUCTION_DURATION,
            startingPrice,
            address(0)
        );

        isTokenLocked[collectionAddress][tokenId] = true;
        userAuctions[msg.sender] = getAuctionId(collectionAddress, tokenId);
        auctions.push(newAuction);

        return auctionId;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        isDepositedByUser[operator][from][tokenId] = true;

        return IERC721Receiver.onERC721Received.selector;
    }

    function claimAuction(address collectionAddress, uint256 tokenId) external {
        bytes32 auctionId = getAuctionId(collectionAddress, tokenId);

        require(
            auctionById[auctionId].endingTime < block.timestamp,
            "not ended"
        );
        require(auctionById[auctionId].bidder == msg.sender, "only winner");

        address creator = auctionById[auctionId].creator;

        isDepositedByUser[creator][collectionAddress][tokenId] = false;
        isTokenLocked[collectionAddress][tokenId] = false;

        IERC721(collectionAddress).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        deposits[auctionById[auctionId].creator] += auctionById[auctionId]
            .price;
    }

    function getUserTokens() external view returns (TokenDetails[] memory) {
        return userTokens[msg.sender];
    }

    function getUserTokenLength() external view returns (uint256) {
        return userTokens[msg.sender].length;
    }

    function getAuctionsLength() external view returns (uint256) {
        return auctions.length;
    }

    function getAllAuctions() external view returns (Auction[] memory) {
        return auctions;
    }
}
