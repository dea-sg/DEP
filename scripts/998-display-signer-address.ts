import { ethers } from 'hardhat'

async function main() {
    const signers = await ethers.getSigners()
    console.log(signers[0].address)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})