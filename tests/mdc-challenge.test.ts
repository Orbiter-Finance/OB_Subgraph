import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, Address, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { ChallengeInfoUpdated as ChallengeInfoUpdatedEvent } from "../src/types/templates/MDC/MDC"
import { handleChallengeInfoUpdated } from "../src/mappings/mdc"
import { createChallengeInfoUpdatedEvent } from "./mdc-utils"
import { entity } from "../src/mappings/utils"
import { functionCheckChallengeInput, functionrChallengeinput } from "./mock-data"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

export let mockChallengeInput: Bytes
describe("test MDC challenge Liquidation related function", () => {
  const ChallengeId: string = "0x123456"
  const Challenger: string = "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
  const CreateChallengeID: string = "0x778717170816eec659b4cafc039ffd50d70a4a72e9043886d3597c9641e00b2f"
  const mdcAddr: string = "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
  const checkChallenge_mockChallenger: string = "0xafcfbb382b28dae47b76224f24ee29be2c823648"
  beforeAll(() => {
    mockChallengeInput = Bytes.fromHexString(functionCheckChallengeInput) as Bytes;
    let challengeId = Bytes.fromHexString(ChallengeId)
    let freezeToken: Address = Address.fromString("0x5f9204bc7402d77d8c9baa97d8f225e85347961e")
    let statementTuple: Array<ethereum.Value> = [
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromAddress(freezeToken),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
    ]
    let statementInfo = changetype<ethereum.Tuple>(statementTuple)

    let winner: Address = Address.fromString("0x5f9204bc7402d77d8c9baa97d8f225e85347961e")
    let resultTuple: Array<ethereum.Value> = [
      ethereum.Value.fromAddress(winner),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromBytes(Address.fromHexString("0x5f9204bc7402d77d8c9baa97d8f225e85347961e")),
    ]
    let resultInfo = changetype<ethereum.Tuple>(resultTuple)

    // let challengeInfo = changetype<ethereum.Tuple>(challengeTuple)
    let newChallengeInfoUpdatedEvent = createChallengeInfoUpdatedEvent(
      challengeId,
      statementInfo,
      resultInfo
    )
    handleChallengeInfoUpdated(newChallengeInfoUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  test("checkChallenge related entities created and stored", () => {
    assert.entityCount("challengeManager", 1)
    assert.entityCount("liquidation", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "liquidation",
      checkChallenge_mockChallenger,
      "id",
      checkChallenge_mockChallenger
    )

    assert.fieldEquals(
      "liquidation",
      checkChallenge_mockChallenger,
      "challengeId",
      ChallengeId
    )

    assert.fieldEquals(
      "liquidation",
      checkChallenge_mockChallenger,
      "liquidators",
      Challenger
    )

    assert.fieldEquals(
      "challengeManager",
      ChallengeId,
      "liquidation",
      `[${checkChallenge_mockChallenger}\]`
    )
  })
})

describe("test MDC Challenge related function", () => {
  const ChallengeId: string = "0x123456"
  const Challenger: string = "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
  const CreateChallengeID: string = "0x778717170816eec659b4cafc039ffd50d70a4a72e9043886d3597c9641e00b2f"
  const mdcAddr: string = "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
  const checkChallenge_mockChallenger: string = "0xafcfbb382b28dae47b76224f24ee29be2c823648"
  beforeAll(() => {
    mockChallengeInput = Bytes.fromHexString(functionrChallengeinput) as Bytes;
    let challengeId = Bytes.fromHexString(ChallengeId)
    let freezeToken: Address = Address.fromString("0x5f9204bc7402d77d8c9baa97d8f225e85347961e")
    let statementTuple: Array<ethereum.Value> = [
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromAddress(freezeToken),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
    ]
    let statementInfo = changetype<ethereum.Tuple>(statementTuple)

    let winner: Address = Address.fromString("0x5f9204bc7402d77d8c9baa97d8f225e85347961e")
    let resultTuple: Array<ethereum.Value> = [
      ethereum.Value.fromAddress(winner),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromBytes(Address.fromHexString("0x5f9204bc7402d77d8c9baa97d8f225e85347961e")),
    ]
    let resultInfo = changetype<ethereum.Tuple>(resultTuple)

    // let challengeInfo = changetype<ethereum.Tuple>(challengeTuple)
    let newChallengeInfoUpdatedEvent = createChallengeInfoUpdatedEvent(
      challengeId,
      statementInfo,
      resultInfo
    )
    handleChallengeInfoUpdated(newChallengeInfoUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  test("challenger related entities created and stored", () => {
    assert.entityCount("challengeManager", 1)
    assert.entityCount("createChallenge", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "challengeManager",
      ChallengeId,
      "id",
      ChallengeId
    )

    let createChallengeIdList = new Array<string>()
    createChallengeIdList.push(CreateChallengeID)

    assert.fieldEquals(
      "challengeManager",
      ChallengeId,
      "createChallenge",
      `[${createChallengeIdList}\]`
    )

    assert.fieldEquals(
      "MDC",
      mdcAddr,
      "challengeNodeList",
      "[0x00000000499602d2000000000000000500000000499602d200000000499602d2]"
    )


  })

})
