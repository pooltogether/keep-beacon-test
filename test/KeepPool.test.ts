import { deployContract } from 'ethereum-waffle'
import { waffle } from '@nomiclabs/buidler'
import { expect } from 'chai'
import { ethers, Contract } from 'ethers'
ethers.errors.setLogLevel("error");

import RandomBeaconStub from '../build/RandomBeaconStub.json'
import KeepPool from '../build/KeepPool.json'

const provider = waffle.provider;
const [wallet, wallet2] = provider.getWallets();

// Vanilla Mocha test. Increased compatibility with tools that integrate Mocha.
describe('KeepPool contract', () => {
  
  let beacon: Contract
  let pool: Contract

  beforeEach(async () => {
    beacon = await deployContract(wallet, RandomBeaconStub);
    await beacon.setEntry(42)
    pool = await deployContract(wallet, KeepPool);
    await pool.initialize(wallet.address, beacon.address)
    await wallet.sendTransaction({ to: pool.address, value: ethers.utils.parseEther('1') })
  })

  describe('deployment', () => {
    it('Should deploy and set the values', async function() {
      expect(await pool.owner()).to.equal(wallet.address)
      expect(await pool.keepRandomBeacon()).to.equal(beacon.address)
    });
  });

  describe('withdraw()', () => {
    it('should not allow anyone but the owner to withdraw', async () => {
      const pool2 = pool.connect(wallet2)
      await expect(pool2.withdraw()).to.be.revertedWith('KeepPool/not-owner')
    })

    it('should allow the owner to withdraw funds', async () => {
      const value = ethers.utils.parseEther('1')
      expect(await provider.getBalance(pool.address), value.toString())
      await pool.withdraw()
      expect(await provider.getBalance(pool.address), '0')
    })
  })

  describe('startReward()', () => {
    it('should request a new number', async () => {
      await pool.startReward()
      const values = await pool.lastRewardRandomNumber()
      expect(values[1]).to.equal(42)
    })
  })
});
