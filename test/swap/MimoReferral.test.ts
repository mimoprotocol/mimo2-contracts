import { ethers, waffle } from "hardhat"
import { expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
const { deployContract } = waffle

import MimoReferralArtifact from "../../artifacts/contracts/swap/MimoReferral.sol/MimoReferral.json"
import { MimoReferral } from "../../types/MimoReferral"

describe("MimoReferral", function () {
  let referal: MimoReferral
  let owner: SignerWithAddress
  let setter: SignerWithAddress
  let user: SignerWithAddress
  let referrer: SignerWithAddress

  before(async function () {
    ;[owner, setter, user, referrer] = await ethers.getSigners()
    referal = (await deployContract(owner, MimoReferralArtifact)) as MimoReferral
  })

  it("check basic info", async function () {
    expect(owner.address).to.equal(await referal.owner())
    expect(true).to.equal(await referal.checkSetter(owner.address))
  })

  it("register", async function () {
    await expect(referal.connect(setter).register(user.address, referrer.address)).to.be.revertedWith("MimoReferral: caller is not the setter")

    await referal.connect(owner).addSetter(setter.address)
    await referal.connect(setter).register(user.address, referrer.address)
    expect(referrer.address).to.equal(await referal.getReferrer(user.address))
  })
})
