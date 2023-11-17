import {
  BlockIntervalUpdated as BlockIntervalUpdatedEvent,
  HistoryBlocksRootSaved as HistoryBlockSavedEvent,
  InjectOwnerUpdated as InjectOwnerUpdatedEvent
} from "../types/spvData/spvData"
import {
  InjectOwnerUpdated,
  BlockIntervalUpdated,
  HistoryBlocksRootSaved
} from "../types/schema"
import { handleHistoryBlocksRootSavedEvent } from "./spv-data-core"
import { entity } from "./utils"

export function handleBlockIntervalUpdated(
  event: BlockIntervalUpdatedEvent
): void {
  let _entity = new BlockIntervalUpdated(
    entity.createHashEventID(event)
  )
  _entity.blockInterval = event.params.blockInterval
  _entity.latestUpdateBlockNumber = event.block.number
  _entity.latestUpdateTimestamp = event.block.timestamp
  _entity.latestUpdateHash = event.transaction.hash.toHexString()
  _entity.save()
}

export function handleHistoryBlocksRootSaved(event: HistoryBlockSavedEvent): void {
  handleHistoryBlocksRootSavedEvent(
    event,
    event.params.startBlockNumber,
    event.params.blocksRoot.toHexString(),
    event.params.blockInterval
  )
}

export function handleInjectOwnerUpdated(event: InjectOwnerUpdatedEvent): void {
  let _entity = new InjectOwnerUpdated(
    entity.createHashEventID(event)
  )
  _entity.injectOwner = event.params.injectOwner
  _entity.latestUpdateBlockNumber = event.block.number
  _entity.latestUpdateTimestamp = event.block.timestamp
  _entity.latestUpdateHash = event.transaction.hash.toHexString()

  _entity.save()
}

