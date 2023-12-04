 
 
import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('DEAPCoin')
	const contract = await tokenFactory.deploy('0xE9708d5388a167e00401BD9c6C1E611077E654cb', '0xE874fb44910a41E84aB6A53bd52317f11393375d', '0xcCb3F56AA3e998ee6A662EA822DCd3238C002933')
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

// npx hardhat run dist/scripts/3-deploy-deap-coin.js --network sepolia
// contract address: 0x08A92A99D993F06161B24C2C192E540DC545464b
// npx hardhat verify --contract contracts/DEAPCoin.sol:DEAPCoin --network sepolia 0x08A92A99D993F06161B24C2C192E540DC545464b --constructor-args scripts/3-deploy-deap-coin-argument.js

