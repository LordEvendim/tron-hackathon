// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./interfaces/IMiranCore.sol";
import "hardhat/console.sol";

contract MiranCore is IERC721Receiver {
    struct Auction {
        uint256 index;
        uint256 creationTime;
        uint256 endingTime;
        address creator;
        address collectionAddress;
        uint256 tokenId;
        uint256 price;
        address bidder;
    }

    struct TokenDetails {
        uint256 index;
        address collectionAddress;
        uint256 tokenId;
    }

    mapping(address => bytes32[]) public userTokens;
    mapping(bytes32 => TokenDetails) tokenDetailsByIds;
    mapping(address => mapping(uint256 => address)) tokenOwner;
    mapping(address => mapping(uint256 => bool)) public isTokenLocked;

    mapping(bytes32 => Auction) public auctionById;

    mapping(address => uint256) public balance;

    uint256 public BASE_AUCTION_DURATION = 3 minutes; // 7 days
    uint256 public BID_AUCTION_DURATION = 1 minutes; // 5 hours
    uint256 public MIN_REQUIRED_PRICE = 1 * 1**12; // not relevant

    bytes32[] public auctionsIds;

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

    // withdraw NFT
    function withdrawToken(address collectionAddress, uint256 tokenId) public {
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

        // Delete user as a token owner
        delete tokenOwner[collectionAddress][tokenId];

        // Delete token from users tokens
        uint256 userTokensLength = userTokens[msg.sender].length;
        bytes32 auctionId = getAuctionId(collectionAddress, tokenId);

        uint256 removeTokenIndex = tokenDetailsByIds[auctionId].index;

        userTokens[msg.sender][removeTokenIndex] = userTokens[msg.sender][
            userTokensLength - 1
        ];
        userTokens[msg.sender].pop();

        IERC721(collectionAddress).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );
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
        require(msg.value + balance[msg.sender] >= price, "bid too low");
        require(price > auctionById[auctionId].price, "price too low");

        // subtract deposit of the new bidder
        // adjust deposit of the previous bidder
        balance[auctionById[auctionId].bidder] += auctionById[auctionId].price;

        if (price <= msg.value) {
            balance[msg.sender] += msg.value - price;
        } else {
            uint256 diff = price - msg.value;
            balance[msg.sender] -= diff;
        }

        auctionById[auctionId].price = price;
        auctionById[auctionId].bidder = msg.sender;

        // if auction is about to finish increase the ending date
        if (auctionById[auctionId].endingTime - block.timestamp < 5 hours) {
            auctionById[auctionId].endingTime = block.timestamp + 1 minutes;
        }

        emit Bid(
            collectionAddress,
            tokenId,
            msg.sender,
            price,
            auctionById[auctionId].endingTime
        );
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

        uint256 auctionsLength = auctionsIds.length;
        Auction memory newAuction = Auction({
            index: auctionsLength,
            creationTime: block.timestamp,
            endingTime: block.timestamp + BASE_AUCTION_DURATION,
            creator: msg.sender,
            collectionAddress: collectionAddress,
            tokenId: tokenId,
            price: startingPrice,
            bidder: address(0)
        });

        auctionsIds.push(auctionId);
        auctionById[auctionId] = newAuction;

        isTokenLocked[collectionAddress][tokenId] = true;

        return auctionId;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        tokenOwner[msg.sender][tokenId] = from;

        // push id to user tokens
        // put TokenDetails in a mapping
        bytes32 id = getAuctionId(msg.sender, tokenId);
        userTokens[from].push(id);

        uint256 length = userTokens[from].length;
        tokenDetailsByIds[id] = TokenDetails({
            index: length - 1,
            collectionAddress: msg.sender,
            tokenId: tokenId
        });

        return IERC721Receiver.onERC721Received.selector;
    }

    function claimAuction(address collectionAddress, uint256 tokenId) external {
        bytes32 auctionId = getAuctionId(collectionAddress, tokenId);

        require(
            auctionById[auctionId].endingTime < block.timestamp,
            "not ended"
        );
        require(auctionById[auctionId].bidder == msg.sender, "only winner");

        // remove token details
        tokenOwner[collectionAddress][tokenId] = auctionById[auctionId].bidder;
        isTokenLocked[collectionAddress][tokenId] = false;

        // remove auction
        uint256 auctionIndex = auctionById[auctionId].index;
        uint256 auctionsLength = auctionsIds.length;

        auctionsIds[auctionIndex] = auctionsIds[auctionsLength - 1];
        auctionsIds.pop();

        auctionById[auctionsIds[auctionsLength - 1]].index = auctionIndex;

        // withdraw auctioned token
        withdrawToken(collectionAddress, tokenId);

        // add balance to auction creator
        balance[auctionById[auctionId].creator] += auctionById[auctionId].price;
    }

    function deposit() external payable {
        require(msg.value > 0, "no deposit");

        balance[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balance[msg.sender] > amount, "not enough balance");

        balance[msg.sender] -= amount;

        payable(msg.sender).transfer(amount);
    }

    function getAuctionId(address collectionAddress, uint256 tokenId)
        public
        pure
        returns (bytes32)
    {
        return sha256(abi.encode(collectionAddress, tokenId));
    }

    function getUserTokens() external view returns (TokenDetails[] memory) {
        uint256 userTokensLength = userTokens[msg.sender].length;
        TokenDetails[] memory allTokens = new TokenDetails[](userTokensLength);

        for (uint256 i = 0; i < userTokensLength; i++) {
            allTokens[i] = tokenDetailsByIds[userTokens[msg.sender][i]];
        }

        return allTokens;
    }

    function getUserTokenLength() external view returns (uint256) {
        return userTokens[msg.sender].length;
    }

    function getAuctionsLength() external view returns (uint256) {
        return auctionsIds.length;
    }

    function getAllAuctions() external view returns (Auction[] memory) {
        Auction[] memory allAuctions = new Auction[](auctionsIds.length);

        for (uint256 i = 0; i < auctionsIds.length; i++) {
            allAuctions[i] = auctionById[auctionsIds[i]];
        }

        return allAuctions;
    }

    function getUserBalance() external view returns (uint256) {
        return balance[msg.sender];
    }
}
