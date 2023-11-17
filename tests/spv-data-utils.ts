import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  BlockIntervalUpdated,
  HistoryBlocksRootSaved,
  InjectOwnerUpdated
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

export function createHistoryBlocksRootSavedEvent(
  startBlockNumber: BigInt,
  blocksRoot: Bytes,
  blockInterval: BigInt
): HistoryBlocksRootSaved {
  let historyBlocksRootSavedEvent = changetype<HistoryBlocksRootSaved>(
    newMockEvent()
  )

  historyBlocksRootSavedEvent.parameters = new Array()

  historyBlocksRootSavedEvent.parameters.push(
    new ethereum.EventParam(
      "startBlockNumber",
      ethereum.Value.fromUnsignedBigInt(startBlockNumber)
    )
  )
  historyBlocksRootSavedEvent.parameters.push(
    new ethereum.EventParam(
      "blocksRoot",
      ethereum.Value.fromFixedBytes(blocksRoot)
    )
  )
  historyBlocksRootSavedEvent.parameters.push(
    new ethereum.EventParam(
      "blockInterval",
      ethereum.Value.fromUnsignedBigInt(blockInterval)
    )
  )

  return historyBlocksRootSavedEvent
}

export function createInjectOwnerUpdatedEvent(
  injectOwner: Address
): InjectOwnerUpdated {
  let injectOwnerUpdatedEvent = changetype<InjectOwnerUpdated>(newMockEvent())

  injectOwnerUpdatedEvent.parameters = new Array()

  injectOwnerUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "injectOwner",
      ethereum.Value.fromAddress(injectOwner)
    )
  )

  return injectOwnerUpdatedEvent
}
