import { expect } from 'chai'
import { Wallet, BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { SnapshotRestorer } from '@nomicfoundation/hardhat-network-helpers'
import { takeSnapshot } from '@nomicfoundation/hardhat-network-helpers'
import { type GroupLockup, type WhiteList, type DEAPCoin, type SaleInfo, type DEAPCoinCrowdsale, GroupLockup__factory } from '../typechain-types'

describe('DEP', () => {
	let groupLockup: GroupLockup
	let whiteList: WhiteList
	let deapCoin: DEAPCoin
	let saleInfo: SaleInfo
	let deapCoinCrowdsale: DEAPCoinCrowdsale
	let snapshot: SnapshotRestorer
	const getNativeValue = async (_value: string | number): Promise<BigNumber> => {
		const decimals = await deapCoin.decimals()
		const nativeValue = BigNumber.from(_value).mul(BigNumber.from(10).pow(decimals));
		return nativeValue
	};

	const getSigners = async (): Promise<[
		SignerWithAddress, 
		SignerWithAddress, 
		SignerWithAddress, 
		SignerWithAddress, 
		SignerWithAddress
	]> => {
		const signers = await ethers.getSigners()
		const saleOwnerWallet = signers[1]
		const unsaleOwnerWallet = signers[2]
		const adminWallet = signers[3]
		const managementWallet = signers[4]
		const user = signers[5]
		return [saleOwnerWallet, unsaleOwnerWallet, adminWallet, managementWallet, user]
	};

	before(async () => {
		const [saleOwnerWallet, unsaleOwnerWallet, adminWallet, managementWallet] = await getSigners()
		
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
			const [saleOwnerWallet] = await getSigners()
			const ownerBalance = await deapCoin.balanceOf(saleOwnerWallet.address)
			const userBalance = await deapCoin.balanceOf(user.address)
			expect(ownerBalance).to.equal(await getNativeValue(12000000000))
			expect(userBalance).to.equal(0)
			await deapCoinCrowdsale.giveToken(user.address, await getNativeValue(100), 0)
			const afterOwnerBalance = await deapCoin.balanceOf(saleOwnerWallet.address)
			const afterUserBalance = await deapCoin.balanceOf(user.address)
			expect(afterOwnerBalance).to.equal(await getNativeValue(11999999900))
			expect(afterUserBalance).to.equal(await getNativeValue(100))
		})
		it('batchTransfer', async () => {
			const user1 = Wallet.createRandom()
			const user2 = Wallet.createRandom()
			const [saleOwnerWallet] = await getSigners()
			const ownerBalance = await deapCoin.balanceOf(saleOwnerWallet.address)
			const user1Balance = await deapCoin.balanceOf(user1.address)
			const user2Balance = await deapCoin.balanceOf(user2.address)
			expect(ownerBalance).to.equal(await getNativeValue(12000000000))
			expect(user1Balance).to.equal(0)
			expect(user2Balance).to.equal(0)
			await deapCoinCrowdsale.batchTransfer(
				saleOwnerWallet.address, 
				[user1.address, user2.address], 
				[await getNativeValue(100), await getNativeValue(200)]
			)
			const afterOwnerBalance = await deapCoin.balanceOf(saleOwnerWallet.address)
			const afterUser1Balance = await deapCoin.balanceOf(user1.address)
			const afterUser2Balance = await deapCoin.balanceOf(user2.address)
			expect(afterOwnerBalance).to.equal(await getNativeValue(11999999700))
			expect(afterUser1Balance).to.equal(await getNativeValue(100))
			expect(afterUser2Balance).to.equal(await getNativeValue(200))
		})
	})
	describe('DEAPCoinCrowdsaleのownerが0アドレス(0アドレスじゃないけど。。。)になった場合、DEAPCoinのowner権限が必要な関数を実行できないのか', () => {
		beforeEach(async () => {
			await deapCoinCrowdsale.transferOwnership('0x0000000000000000000000000000000000000001')
		})
		it('sendTokens', async () => {
			const user = Wallet.createRandom()
			const sendValue = await getNativeValue(100)
			const func = deapCoinCrowdsale.giveToken(user.address, sendValue, 0)
			await expect(func).to.be.rejectedWith('Transaction reverted without a reason string')
		})
		it('batchTransfer', async () => {
			const user1 = Wallet.createRandom()
			const user2 = Wallet.createRandom()
			const [saleOwnerWallet] = await getSigners()
			const func = deapCoinCrowdsale.batchTransfer(
				saleOwnerWallet.address, 
				[user1.address, user2.address], 
				[await getNativeValue(100), await getNativeValue(200)]
			)
			await expect(func).to.be.rejectedWith('Transaction reverted without a reason string')
		})
	})
	describe('全コントラクトのownerが0アドレス(0アドレスじゃないけど。。。)になった場合、DEAPCoinのERC20としての機能は担保されているか', () => {
		beforeEach(async () => {
			await deapCoinCrowdsale.transferOwnership('0x0000000000000000000000000000000000000001')
			await whiteList.transferOwnership('0x0000000000000000000000000000000000000001')
		})
		describe('metadata', () => {
			it('name', async () => {
				const name = await deapCoin.name()
				expect(name).to.equal('DEAPCOIN')
			})
			it('symbol', async () => {
				const symbol = await deapCoin.symbol()
				expect(symbol).to.equal('DEP')
			})
			it('decimals', async () => {
				const decimals = await deapCoin.decimals()
				expect(decimals).to.equal(18)
			})
		})
		describe('basic', () => {
			it('transfer', async () => {
				const [saleOwnerWallet] = await getSigners()
				const deap = deapCoin.connect(saleOwnerWallet)
				const toUser = Wallet.createRandom()

				const ownerBalance = await deapCoin.balanceOf(saleOwnerWallet.address)
				const userBalance = await deapCoin.balanceOf(toUser.address)
				expect(ownerBalance).to.equal(await getNativeValue(12000000000))
				expect(userBalance).to.equal(0)

				await deap['transfer(address,uint256)'](toUser.address, await getNativeValue(100))

				const filter = deap.filters.Transfer()
				const events = await deap.queryFilter(filter)
				const {args} = events[events.length - 1]
				expect(args.from).to.equal(saleOwnerWallet.address)
				expect(args.to).to.equal(toUser.address)
				expect(args.value).to.equal(await getNativeValue(100))
				const afterOwnerBalance = await deapCoin.balanceOf(saleOwnerWallet.address)
				const afterUserBalance = await deapCoin.balanceOf(toUser.address)
				expect(afterOwnerBalance).to.equal(await getNativeValue(11999999900))
				expect(afterUserBalance).to.equal(await getNativeValue(100))
			})
			it('transferFrom', async () => {
				const [saleOwnerWallet, , , , user] = await getSigners()
				const deap = deapCoin.connect(saleOwnerWallet)
				const toUser = Wallet.createRandom()

				const ownerBalance = await deapCoin.balanceOf(saleOwnerWallet.address)
				const userBalance = await deapCoin.balanceOf(toUser.address)
				expect(ownerBalance).to.equal(await getNativeValue(12000000000))
				expect(userBalance).to.equal(0)


				await deap.approve(user.address, await getNativeValue(100))
				const deapUser = deapCoin.connect(user)
				await deapUser.transferFrom(saleOwnerWallet.address, toUser.address, await getNativeValue(100))

				const filter = deap.filters.Transfer()
				const events = await deap.queryFilter(filter)
				const {args} = events[events.length - 1]
				expect(args.from).to.equal(saleOwnerWallet.address)
				expect(args.to).to.equal(toUser.address)
				expect(args.value).to.equal(await getNativeValue(100))
				const afterOwnerBalance = await deapCoin.balanceOf(saleOwnerWallet.address)
				const afterUserBalance = await deapCoin.balanceOf(toUser.address)
				expect(afterOwnerBalance).to.equal(await getNativeValue(11999999900))
				expect(afterUserBalance).to.equal(await getNativeValue(100))
			})
			it('approve', async () => {
				const [saleOwnerWallet] = await getSigners()
				const deap = deapCoin.connect(saleOwnerWallet)
				const toUser = Wallet.createRandom()
				await deap.approve(toUser.address, await getNativeValue(100))
				const filter = deap.filters.Approval()
				const events = await deap.queryFilter(filter)
				const {args} = events[events.length - 1]
				expect(args.owner).to.equal(saleOwnerWallet.address)
				expect(args.spender).to.equal(toUser.address)
				expect(args.value).to.equal(await getNativeValue(100))
			})
			it('allowance', async () => {
				const [saleOwnerWallet] = await getSigners()
				const deap = deapCoin.connect(saleOwnerWallet)
				const toUser = Wallet.createRandom()
				await deap.approve(toUser.address, await getNativeValue(100))
				const result = await deapCoin.allowance(saleOwnerWallet.address, toUser.address)
				expect(result).to.equal(await getNativeValue(100))
			})
			it('totalSupply', async () => {
				const total = await deapCoin.totalSupply()
				expect(total).to.equal(await getNativeValue(30000000000))
			})
			it('balanceOf', async () => {
				const [saleOwnerWallet] = await getSigners()
				const balance = await deapCoin.balanceOf(saleOwnerWallet.address)
				expect(balance).to.equal(await getNativeValue(12000000000))
			})
		})
	})
})
