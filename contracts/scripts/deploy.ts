import { ethers } from "hardhat";

async function main() {
  const MiranCore = await ethers.getContractFactory("MiranCore");
  const miranCore = await MiranCore.deploy();
  await miranCore.deployed();
  console.log("MiranCore deployed to:", miranCore.address);

  const SampleNFT = await ethers.getContractFactory("ERC721");
  const sampleNFT = await SampleNFT.deploy("Miran collection", "MRN");
  await sampleNFT.deployed();
  console.log("SampleNFT deployed to:", sampleNFT.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// https://arweave.net/iEcfB6UWXk_gvvCgCgu9SMMOYliT3V2FN-LNNLHzCRM/5
