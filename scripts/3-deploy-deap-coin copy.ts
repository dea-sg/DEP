 
 
import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('DEAPCoin')
	const contract = await tokenFactory.deploy('0xE9708d5388a167e00401BD9c6C1E611077E654cb', '0xE874fb44910a41E84aB6A53bd52317f11393375d', '0xF688573D7B154DEc538234CBd2D8e3f0fdadeAd6')
	console.log('contract address:', contract.address)
	await contract.deployed()
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})


// Npx hardhat run dist/scripts/3-deploy-deap-coin.js --network goerli
// contract address: 0x1f40cC97b4d5163Eef61466859ce531C609Cc492
// npx hardhat verify --contract contracts/DEAPCoin.sol:DEAPCoin --network goerli 0x1f40cC97b4d5163Eef61466859ce531C609Cc492 --constructor-args scripts/3-deploy-deap-coin-argument.js
