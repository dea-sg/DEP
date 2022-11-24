 
 
import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('DEAPCoinCrowdsale')
	// Const estimatedGas = await ethers.provider.estimateGas(await tokenFactory.getDeployTransaction(...).data)
	// const tmp = await tokenFactory.getDeployTransaction(
	// 	1566896400, 
	// 	1661612399, 
	// 	20000, 
	// 	0, 
	// 	'0x92655EF8d14A8839A975DB02CF2e08160dE4c0e8', 
	// 	'0xE9708d5388a167e00401BD9c6C1E611077E654cb', 
	// 	'0xE874fb44910a41E84aB6A53bd52317f11393375d', 
	// 	'0xB536bBa91F22B32AFfCEb9fa488CC1b0ee74cd77',
	// 	'0x1f40cC97b4d5163Eef61466859ce531C609Cc492',
	// 	'0x673f96F43c0555E21bD3Ac28566298F66264210a',
	// 	'0xcCb3F56AA3e998ee6A662EA822DCd3238C002933',
	// 	'0xF688573D7B154DEc538234CBd2D8e3f0fdadeAd6'
	// 	)
	// console.log(tmp.gasLimit?.toString())
	// console.log(tmp.gasPrice?.toString())
	// console.log(tmp.maxFeePerGas?.toString())
	// console.log(tmp.maxPriorityFeePerGas?.toString())
	
	const contract = await tokenFactory.deploy(
		1566896400, 
		1661612399, 
		20000, 
		0, 
		'0x92655EF8d14A8839A975DB02CF2e08160dE4c0e8', 
		'0xE9708d5388a167e00401BD9c6C1E611077E654cb', 
		'0xE874fb44910a41E84aB6A53bd52317f11393375d', 
		'0xB536bBa91F22B32AFfCEb9fa488CC1b0ee74cd77',
		'0x1f40cC97b4d5163Eef61466859ce531C609Cc492',
		'0x673f96F43c0555E21bD3Ac28566298F66264210a',
		'0xcCb3F56AA3e998ee6A662EA822DCd3238C002933',
		'0xF688573D7B154DEc538234CBd2D8e3f0fdadeAd6'
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
// contract address: 0x673f96F43c0555E21bD3Ac28566298F66264210a
// npx hardhat verify --contract contracts/SaleInfo.sol:SaleInfo --network goerli 0x673f96F43c0555E21bD3Ac28566298F66264210a --constructor-args scripts/4-deploy-sale-info-argument.js
// gas: 5100000,
// gasPrice: 500000000000
// reason: 'execution reverted',
// code: 'UNPREDICTABLE_GAS_LIMIT',
// method: 'estimateGas',
