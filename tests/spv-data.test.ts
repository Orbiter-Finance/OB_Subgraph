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
import { handleBlockIntervalUpdated, handleHistoryBlocksRootSaved } from "../src/mappings/spv-data"
import { createBlockIntervalUpdatedEvent, createHistoryBlocksRootSavedEvent } from "./spv-data-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  const blockNumber = 123
  const blocksRoot = "0x0000000000000000000000000000000000000000000000000000000000000000"
  const blockInterval = 100
  beforeAll(() => {
    const _blockNumber: BigInt = BigInt.fromI32(blockNumber);
    const _blocksRoot: Bytes = Bytes.fromHexString(blocksRoot)
    const _blockInterval: BigInt = BigInt.fromI32(blockInterval)
    let newHistoryBlockSavedEvent = createHistoryBlocksRootSavedEvent(_blockNumber, _blocksRoot, _blockInterval)
    handleHistoryBlocksRootSaved(newHistoryBlockSavedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  test("HistoryBlockSaved created and stored", () => {
    assert.entityCount("HistoryBlocksRootSaved", 1)

    assert.fieldEquals(
      "HistoryBlocksRootSaved",
      blockNumber.toString(),
      "blocksRoot",
      blocksRoot
    )

    assert.fieldEquals(
      "HistoryBlocksRootSaved",
      blockNumber.toString(),
      "id",
      blockNumber.toString()
    )

    assert.fieldEquals(
      "HistoryBlocksRootSaved",
      blockNumber.toString(),
      "blockInterval",
      blockInterval.toString()
    )
  })
})
