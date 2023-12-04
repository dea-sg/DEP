 
 
import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('SaleInfo')
	const contract = await tokenFactory.deploy(1566896400, 1566898200, 1566900000, 1661612399, '0x92655EF8d14A8839A975DB02CF2e08160dE4c0e8', '0xE9708d5388a167e00401BD9c6C1E611077E654cb', '0xE874fb44910a41E84aB6A53bd52317f11393375d', '0xB536bBa91F22B32AFfCEb9fa488CC1b0ee74cd77')
	console.log('contract address:', contract.address)
	await contract.deployed()
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})


// Npx hardhat run dist/scripts/4-deploy-sale-info.js --network goerli
// contract address: 0x673f96F43c0555E21bD3Ac28566298F66264210a
// npx hardhat verify --contract contracts/SaleInfo.sol:SaleInfo --network goerli 0x673f96F43c0555E21bD3Ac28566298F66264210a --constructor-args scripts/4-deploy-sale-info-argument.js

// Npx hardhat run dist/scripts/4-deploy-sale-info.js --network sepolia
// contract address: 0x673f96F43c0555E21bD3Ac28566298F66264210a
// npx hardhat verify --contract contracts/SaleInfo.sol:SaleInfo --network sepolia 0x673f96F43c0555E21bD3Ac28566298F66264210a --constructor-args scripts/4-deploy-sale-info-argument.js
