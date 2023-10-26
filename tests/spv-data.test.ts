import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { BlockIntervalUpdated } from "../src/types/schema"
import { BlockIntervalUpdated as BlockIntervalUpdatedEvent } from "../src/types/spvData/spvData"
import { handleBlockIntervalUpdated } from "../src/mappings/spv-data"
import { createBlockIntervalUpdatedEvent } from "./spv-data-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let blockInterval = BigInt.fromI32(234)
    let newBlockIntervalUpdatedEvent = createBlockIntervalUpdatedEvent(
      blockInterval
    )
    handleBlockIntervalUpdated(newBlockIntervalUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  // test("BlockIntervalUpdated created and stored", () => {
  //   assert.entityCount("BlockIntervalUpdated", 1)

  //   // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
  //   assert.fieldEquals(
  //     "BlockIntervalUpdated",
  //     "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
  //     "blockInterval",
  //     "234"
  //   )

  //   // More assert options:
  //   // https://thegraph.com/docs/en/developer/matchstick/#asserts
  // })
})
