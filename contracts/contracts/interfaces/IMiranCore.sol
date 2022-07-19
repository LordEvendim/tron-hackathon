// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMiranCore {
    function withdrawToken(address collectionAddress, uint256 tokenId) external;
}
