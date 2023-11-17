import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { HistoryBlocksRootSaved } from "../types/schema";


function getHistoryBlockSavedEntity(
    event: ethereum.Event,
    blockNumber: BigInt
): HistoryBlocksRootSaved {
    const id = blockNumber.toString()
    let entity = HistoryBlocksRootSaved.load(id)
    if (entity == null) {
        entity = new HistoryBlocksRootSaved(id)
    }
    entity.latestUpdateBlockNumber = blockNumber
    entity.latestUpdateTimestamp = event.block.timestamp
    entity.latestUpdateHash = event.transaction.hash.toHexString()
    return entity as HistoryBlocksRootSaved
}

export function handleHistoryBlocksRootSavedEvent(
    event: ethereum.Event,
    startBlockNumber: BigInt,
    blocksRoot: string,
    blockInterval: BigInt
): void {
    let historyBlockSaved = getHistoryBlockSavedEntity(event, startBlockNumber)
    historyBlockSaved.blocksRoot = blocksRoot
    historyBlockSaved.blockInterval = blockInterval
    historyBlockSaved.save()
}