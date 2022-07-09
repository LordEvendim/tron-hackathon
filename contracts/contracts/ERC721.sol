// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MiranCollection is IERC721Metadata {
    constructor(address tokenOwner) ERC721("Miran Collection", "MRN") {}

    function name() external view returns (string memory) {
        return "Miran Collection";
    }

    function symbol() external view returns (string memory) {
        return "";
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        return "";
    }
}
