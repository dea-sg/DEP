 
 
import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('Test')
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


// Npx hardhat run dist/scripts/0-deploy-test.js --network goerli
// contract address: 0xAb3E5dECb1B696CFd56f661478DC032b9D232c6E
// npx hardhat verify --contract contracts/test/Test.sol:Test --network goerli 0xAb3E5dECb1B696CFd56f661478DC032b9D232c6E
