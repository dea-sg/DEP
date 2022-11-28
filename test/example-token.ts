import { expect } from 'chai'
import { Wallet } from 'ethers'
import { ethers } from 'hardhat'
import type { SnapshotRestorer } from '@nomicfoundation/hardhat-network-helpers'
import { takeSnapshot } from '@nomicfoundation/hardhat-network-helpers'
import type { GroupLockup, WhiteList, DEAPCoin, SaleInfo, DEAPCoinCrowdsale } from '../typechain-types'

describe('DEP', () => {
	let groupLockup: GroupLockup
	let whiteList: WhiteList
	let deapCoin: DEAPCoin
	let saleInfo: SaleInfo
	let deapCoinCrowdsale: DEAPCoinCrowdsale
	let snapshot: SnapshotRestorer
	let saleOwnerWallet: Wallet
	let unsaleOwnerWallet: Wallet
	let adminWallet: Wallet
	let managementWallet: Wallet
	before(async () => {
		saleOwnerWallet = Wallet.createRandom()
		unsaleOwnerWallet = Wallet.createRandom()
		adminWallet = Wallet.createRandom()
		managementWallet = Wallet.createRandom()
		
		const blockNumber = await ethers.provider.getBlockNumber()
		const blockBefore = await ethers.provider.getBlock(blockNumber);
		const preSaleStartTime = blockBefore.timestamp + 100
		const preSaleEndTime = preSaleStartTime + 100
		const publicSaleStartTime = preSaleEndTime + 100
		const publicSaleEndTime = publicSaleStartTime + 100
		const rate = 20000
		const minimumWeiAmount = 0
		
		const groupLockupfactory = await ethers.getContractFactory('GroupLockup')
		groupLockup = (await groupLockupfactory.deploy()) as GroupLockup
		await groupLockup.deployed()
		
		const whiteListfactory = await ethers.getContractFactory('WhiteList')
		whiteList = (await whiteListfactory.deploy()) as WhiteList
		await whiteList.deployed()

		const DEAPCoinfactory = await ethers.getContractFactory('DEAPCoin')
		deapCoin = (await DEAPCoinfactory.deploy(
			saleOwnerWallet.address,
			unsaleOwnerWallet.address,
			groupLockup.address
		)) as DEAPCoin
		await deapCoin.deployed()

		const saleInfofactory = await ethers.getContractFactory('SaleInfo')
		saleInfo = (await saleInfofactory.deploy(
			preSaleStartTime,
			preSaleEndTime,
			publicSaleStartTime,
			publicSaleEndTime,
			adminWallet.address,
			saleOwnerWallet.address,
			unsaleOwnerWallet.address,
			managementWallet.address,
		)) as SaleInfo
		await saleInfo.deployed()
		const DEAPCoinCrowdsalefactory = await ethers.getContractFactory('DEAPCoinCrowdsale')
		deapCoinCrowdsale = (await DEAPCoinCrowdsalefactory.deploy(
			preSaleStartTime,
			publicSaleEndTime,
			rate,
			minimumWeiAmount,
			adminWallet.address,
			saleOwnerWallet.address,
			unsaleOwnerWallet.address,
			managementWallet.address,
			deapCoin.address,
			saleInfo.address,
			whiteList.address,
			groupLockup.address,
			{
				gasPrice: 50000000000,
				gasLimit: 8000000,
			}
		)) as DEAPCoinCrowdsale
		await deapCoinCrowdsale.deployed()

		await deapCoin.transferOwnership(deapCoinCrowdsale.address)
		await groupLockup.transferOwnership(deapCoinCrowdsale.address)
	})
	beforeEach(async () => {
		snapshot = await takeSnapshot()
	})
	afterEach(async () => {
		await snapshot.restore()
	})
	describe('ownerがDEAPCoinのowner権限が必要な関数を実行できるのか', () => {
		it('sendTokens', async () => {
			const user = Wallet.createRandom()
			const ownerBalance = await deapCoin.balanceOf(saleOwnerWallet.address)
			const userBalance = await deapCoin.balanceOf(user.address)
			expect(ownerBalance.toString()).to.equal('12000000000' + '000000000000000000')
			expect(userBalance.toString()).to.equal('0')
			await deapCoinCrowdsale.giveToken(user.address, '100' + '000000000000000000', 0)
			const afterOwnerBalance = await deapCoin.balanceOf(saleOwnerWallet.address)
			const afterUserBalance = await deapCoin.balanceOf(user.address)
			expect(afterOwnerBalance.toString()).to.equal('11999999900' + '000000000000000000')
			expect(afterUserBalance.toString()).to.equal('100' + '000000000000000000')
		})
	})
})
