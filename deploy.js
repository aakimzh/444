const { ethers } = require("hardhat");

async function main() {
  const initialSupply = ethers.parseUnits("1000000", 18);
  const MTK = await ethers.getContractFactory("MTKToken");
  const token = await MTK.deploy(initialSupply);
  await token.waitForDeployment();
  console.log("Token deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
