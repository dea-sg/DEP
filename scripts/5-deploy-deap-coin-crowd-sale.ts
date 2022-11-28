 
 
import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('DEAPCoinCrowdsale')
	const contract = await tokenFactory.deploy(
		1670347600, 
		1761612399, 
		20000, 
		0, 
		'0x92655EF8d14A8839A975DB02CF2e08160dE4c0e8', 
		'0xE9708d5388a167e00401BD9c6C1E611077E654cb', 
		'0xE874fb44910a41E84aB6A53bd52317f11393375d', 
		'0xB536bBa91F22B32AFfCEb9fa488CC1b0ee74cd77',
		'0x1f40cC97b4d5163Eef61466859ce531C609Cc492',
		'0x673f96F43c0555E21bD3Ac28566298F66264210a',
		'0xcCb3F56AA3e998ee6A662EA822DCd3238C002933',
		'0xF688573D7B154DEc538234CBd2D8e3f0fdadeAd6',
		{
			gasPrice: 50000000000,
			gasLimit: 8000000,
		}
		)
	console.log('contract address:', contract.address)
	await contract.deployed()
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})


// Npx hardhat run dist/scripts/5-deploy-deap-coin-crowd-sale.js --network goerli
// contract address: 0xDf522Cb2aEdb6058E46F84B9Ab8067c90E7E60f7
// npx hardhat verify --contract contracts/DEAPCoinCrowdsale.sol:DEAPCoinCrowdsale --network goerli 0xDf522Cb2aEdb6058E46F84B9Ab8067c90E7E60f7 --constructor-args scripts/5-deploy-coin-crowd-sale-argument.js
