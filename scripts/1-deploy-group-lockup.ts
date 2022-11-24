 
 
import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('GroupLockup')
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


// Npx hardhat run dist/scripts/1-deploy-group-lockup.js --network goerli
// contract address: 0xF688573D7B154DEc538234CBd2D8e3f0fdadeAd6
// npx hardhat verify --contract contracts/GroupLockup.sol:GroupLockup --network goerli 0xF688573D7B154DEc538234CBd2D8e3f0fdadeAd6
