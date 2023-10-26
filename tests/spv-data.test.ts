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
import { handleBlockIntervalUpdated, handleHistoryBlockSaved } from "../src/mappings/spv-data"
import { createBlockIntervalUpdatedEvent, createHistoryBlockSavedEvent } from "./spv-data-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  const blockNumber = 123
  const blockHash = "0x0000000000000000000000000000000000000000000000000000000000000000"
  beforeAll(() => {
    const _blockNumber: BigInt = BigInt.fromI32(blockNumber);
    const _blockHash: Bytes = Bytes.fromHexString(blockHash)
    let newHistoryBlockSavedEvent = createHistoryBlockSavedEvent(_blockNumber, _blockHash)
    handleHistoryBlockSaved(newHistoryBlockSavedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  test("HistoryBlockSaved created and stored", () => {
    assert.entityCount("HistoryBlockSaved", 1)

    assert.fieldEquals(
      "HistoryBlockSaved",
      blockNumber.toString(),
      "blockHash",
      blockHash
    )
  })
})
