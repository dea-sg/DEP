/* eslint-disable @typescript-eslint/no-non-null-assertion */

import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import '@nomicfoundation/hardhat-chai-matchers'
import * as dotenv from 'dotenv'

dotenv.config()

const privateKey =
	typeof process.env.PRIVATE_KEY === 'undefined'
		? '0000000000000000000000000000000000000000000000000000000000000000'
		: process.env.PRIVATE_KEY

// const mnemonic =
// 		typeof process.env.MNEMONIC === 'undefined'
// 			? 'test test test test test test test test test test test junk'
// 			: process.env.MNEMONIC
const config = {
	solidity: {
		version: '0.4.25',
		settings: {
			optimizer: {
				enabled: false,
				runs: 200,
			},
		},
	},
	networks: {
		sepolia: {
			url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ARCHEMY_KEY!}`,
			accounts: [privateKey],
		},
		mainnet: {
			url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ARCHEMY_KEY!}`,
			accounts: [privateKey],
		},
	},
	etherscan: {
		apiKey: {
			goerli: process.env.ETHERSCAN_API_KEY!,
			sepolia: process.env.ETHERSCAN_API_KEY!,
		},
	},
}

export default config
