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

    mapping(address => mapping(uint256 => address)) public tokenOwner;
    mapping(address => mapping(uint256 => bool)) public isTokenLocked;

    uint256 public BASE_AUCTION_DURATION = 60 * 60 * 24 * 7; // 7 days
    uint256 public BID_AUCTION_DURATION = 60 * 60 * 5; // 5 hours
    uint256 public MIN_REQUIRED_PRICE = 1000000000; // not relevant

    bytes32[] public auctions;

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

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] > amount, "not enough balance");

        deposits[msg.sender] -= amount;

        payable(msg.sender).transfer(amount);
    }

    // withdraw NFT
    function withdrawToken(address collectionAddress, uint256 tokenId)
        external
    {
        require(
            IERC721(collectionAddress).ownerOf(tokenId) == address(this),
            "contract not owner"
        );
        require(
            tokenOwner[collectionAddress][tokenId] == msg.sender,
            "user not deposited this token"
        );
        require(
            isTokenLocked[collectionAddress][tokenId] == false,
            "token locked"
        );

        delete tokenOwner[collectionAddress][tokenId];

        uint256 userTokensLength = userTokens[msg.sender].length;
        bytes32 auctionId = getAuctionId(collectionAddress, tokenId);

        // Delete token from users tokens
        for (uint256 i = 0; i < userTokensLength; i++) {
            if (compareAuctionWithId(userTokens[msg.sender][i], auctionId)) {
                userTokens[msg.sender][i] = userTokens[msg.sender][
                    userTokensLength - 1
                ];
                userTokens[msg.sender].pop();
            }
        }

        IERC721(collectionAddress).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );
    }

    function compareAuctionWithId(TokenDetails memory auction, bytes32 id)
        public
        pure
        returns (bool)
    {
        return (keccak256(
            abi.encodePacked(auction.collectionAddress, auction.tokenId)
        ) == id);
    }

    function bid(
        address collectionAddress,
        uint256 tokenId,
        uint256 price
    ) external payable {
        bytes32 auctionId = getAuctionId(collectionAddress, tokenId);
        // cannot out bid yourself
        // cannot bid created auctions
        // enough funds to cover price
        // bigger then the last price
        require(
            auctionById[auctionId].creator != msg.sender,
            "cannot bid your auctions"
        );
        require(
            auctionById[auctionId].bidder != msg.sender,
            "cannot out bid yourself"
        );
        require(msg.value + deposits[msg.sender] >= price, "bid too low");
        require(price > auctionById[auctionId].price, "price too low");

        // subtract deposit of the new bidder
        // adjust deposit of the previous bidder
        deposits[auctionById[auctionId].bidder] += auctionById[auctionId].price;

        if (price <= msg.value) {
            deposits[msg.sender] += msg.value - price;
        } else {
            uint256 diff = price - msg.value;
            deposits[msg.sender] -= diff;
        }

        auctionById[auctionId].price = price;

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
        userAuctions[msg.sender] = auctionId;
        auctionById[auctionId] = newAuction;
        auctions.push(auctionId);

        return auctionId;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        // check
        tokenOwner[msg.sender][tokenId] = from;

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

        delete tokenOwner[collectionAddress][tokenId];
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
        Auction[] memory allAuctions = new Auction[](auctions.length);

        for (uint256 i = 0; i < auctions.length; i++) {
            allAuctions[i] = auctionById[auctions[i]];
        }

        return allAuctions;
    }
}
