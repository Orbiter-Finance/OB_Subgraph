import {
  BlockIntervalUpdated as BlockIntervalUpdatedEvent,
  HistoryBlockSaved as HistoryBlockSavedEvent
} from "../types/spvData/spvData"
import { BlockIntervalUpdated, HistoryBlockSaved } from "../types/schema"
import { handleHistoryBlockSavedEvent } from "./spv-data-core"

export function handleBlockIntervalUpdated(
  event: BlockIntervalUpdatedEvent
): void {
  // let entity = new BlockIntervalUpdated(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.blockInterval = event.params.blockInterval

  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash

  // entity.save()
}

export function handleHistoryBlockSaved(event: HistoryBlockSavedEvent): void {
  handleHistoryBlockSavedEvent(
    event,
    event.params.blkNumber,
    event.params.blockHash.toHexString()
  )
}
