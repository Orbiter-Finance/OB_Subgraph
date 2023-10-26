import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  BlockIntervalUpdated,
  HistoryBlockSaved
} from "../src/types/spvData/spvData"

export function createBlockIntervalUpdatedEvent(
  blockInterval: BigInt
): BlockIntervalUpdated {
  let blockIntervalUpdatedEvent = changetype<BlockIntervalUpdated>(
    newMockEvent()
  )

  blockIntervalUpdatedEvent.parameters = new Array()

  blockIntervalUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "blockInterval",
      ethereum.Value.fromUnsignedBigInt(blockInterval)
    )
  )

  return blockIntervalUpdatedEvent
}

export function createHistoryBlockSavedEvent(
  blockNumber: BigInt,
  blockHash: Bytes
): HistoryBlockSaved {
  let historyBlockSavedEvent = changetype<HistoryBlockSaved>(newMockEvent())

  historyBlockSavedEvent.parameters = new Array()

  historyBlockSavedEvent.parameters.push(
    new ethereum.EventParam(
      "blockNumber",
      ethereum.Value.fromUnsignedBigInt(blockNumber)
    )
  )
  historyBlockSavedEvent.parameters.push(
    new ethereum.EventParam(
      "blockHash",
      ethereum.Value.fromFixedBytes(blockHash)
    )
  )

  return historyBlockSavedEvent
}
