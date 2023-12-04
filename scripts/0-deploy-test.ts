 
 
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

// npx hardhat run dist/scripts/0-deploy-test.js --network sepolia
// contract address: 0x48723BAe17d355F9ed916ED246c5e51e7205f3AD
// npx hardhat verify --contract contracts/test/Test.sol:Test --network sepolia 0x48723BAe17d355F9ed916ED246c5e51e7205f3AD
