import { ethers } from "hardhat";

async function main() {
  const MiranCore = await ethers.getContractFactory("MiranCore");
  const miranCore = await MiranCore.deploy();
  await miranCore.deployed();

  console.log("MiranCore deployed to:", miranCore.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
