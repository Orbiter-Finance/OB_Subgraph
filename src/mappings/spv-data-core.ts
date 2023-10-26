import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { HistoryBlockSaved } from "../types/schema";


function getHistoryBlockSavedEntity(
    event: ethereum.Event,
    blockNumber: BigInt
): HistoryBlockSaved {
    const id = blockNumber.toString()
    let entity = HistoryBlockSaved.load(id)
    if (entity == null) {
        entity = new HistoryBlockSaved(id)
    }
    entity.latestUpdateBlockNumber = blockNumber
    entity.latestUpdateTimestamp = event.block.timestamp
    entity.latestUpdateHash = event.transaction.hash.toHexString()
    return entity as HistoryBlockSaved
}

export function handleHistoryBlockSavedEvent(
    event: ethereum.Event,
    blockNumber: BigInt,
    blockHash: string,
): void {
    let historyBlockSaved = getHistoryBlockSavedEntity(event, blockNumber)
    historyBlockSaved.blockHash = blockHash
    historyBlockSaved.save()
}