import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { IPFS_PREFIX, EXAMPLE_NFT_METADATA } from "./ipfs";

async function main() {
  const MiranCore = await ethers.getContractFactory("MiranCore");
  const miranCore = await MiranCore.deploy();
  await miranCore.deployed();
  console.log("MiranCore -> " + miranCore.address);

  const MiranCollection = await ethers.getContractFactory("MiranCollection");
  const miranCollection = await MiranCollection.deploy();
  await miranCollection.deployed();
  console.log("MiranCollection -> " + miranCollection.address);

  const signers = await ethers.getSigners();
  const deployer = signers[0];
  await miranCollection.mintNFT(
    await deployer.getAddress(),
    IPFS_PREFIX + EXAMPLE_NFT_METADATA
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// https://arweave.net/iEcfB6UWXk_gvvCgCgu9SMMOYliT3V2FN-LNNLHzCRM/5
