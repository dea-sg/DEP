 
 
import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('WhiteList')
	const contract = await tokenFactory.deploy()
	console.log('contract address:', contract.address)
	await contract.deployed()
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})


// Npx hardhat run dist/scripts/2-deploy-white-list.js --network goerli
// contract address: 0xcCb3F56AA3e998ee6A662EA822DCd3238C002933
// npx hardhat verify --contract contracts/WhiteList.sol:WhiteList --network goerli 0xcCb3F56AA3e998ee6A662EA822DCd3238C002933

// npx hardhat run dist/scripts/2-deploy-white-list.js --network sepolia
// contract address: 0x630E203C603374675314CcFAF1931Cb507A31F20
// npx hardhat verify --contract contracts/WhiteList.sol:WhiteList --network sepolia 0x630E203C603374675314CcFAF1931Cb507A31F20