import { ethers, waffle } from "hardhat"
import { expect } from "chai"
import { Wallet } from "ethers"
const { deployContract } = waffle

import MimoFactoryArtifact from "../../artifacts/contracts/swap/MimoFactory.sol/MimoFactory.json"
import { MimoFactory } from "../../types/MimoFactory"

describe("MimoFactory", function () {
  let factory: MimoFactory

  before(async function () {
    this.signers = await ethers.getSigners()
  })

  it("create factory and get codehash", async function () {
    factory = (await deployContract(<Wallet>this.signers[0], MimoFactoryArtifact, [this.signers[0].address])) as MimoFactory

    expect("0x00d8258f07455ccf2a627e421c1b67a5235293aa73a2d17be60109e9200cb37f").to.equal(await factory.INIT_CODE_PAIR_HASH())
  })
})
