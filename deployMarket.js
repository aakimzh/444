const { ethers } = require("hardhat");

async function main() {

  const tokenAddress = process.env.TOKEN_ADDRESS || "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  const Marketplace = await ethers.getContractFactory("AIModelMarketplace");

  const marketplace = await Marketplace.deploy(tokenAddress);
  await marketplace.waitForDeployment();

  console.log("Marketplace deployed to:", await marketplace.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
