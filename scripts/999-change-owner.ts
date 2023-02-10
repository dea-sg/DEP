import hre from "hardhat"

async function main() {
	// DEAPCoinCrowdsale
    const contractAddress = "0xB9CDb9d5240e5Cdf2a5d19e3Ac475D16735A89c1";
    const constract = await hre.ethers.getContractAt("DEAPCoinCrowdsale", contractAddress);
	if (constract.address !== contractAddress) {
		throw new Error("illegal address");
	}

	await constract.transferOwnership("0x0000000000000000000000000000000000000001");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})