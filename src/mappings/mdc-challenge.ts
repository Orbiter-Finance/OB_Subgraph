import { log } from "matchstick-as"
import {
    MDC,
    challengeManager,
    createChallenge,
    liquidation,
    verifyChallengeDest,
    verifyChallengeSource
} from "../types/schema"
import {
    entity,
    padZeroToBytes
} from "./utils"
import { STRING_EMPTY } from "./helpers"
import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"

export function getChallengeManagerEntity(
    mdc: MDC,
    challengeId: string
): challengeManager {
    let manager = challengeManager.load(
        challengeId
    )
    if (manager == null) {
        manager = new challengeManager(
            challengeId
        )
        manager.createChallenge = []
        manager.verifyChallengeSource = STRING_EMPTY
        manager.verifyChallengeDest = STRING_EMPTY
        manager.liquidation = []
        mdc.challengeManager = entity.addRelation(
            mdc.challengeManager,
            challengeId)
    }
    return manager as challengeManager
}

export function getCreateChallenge(
    challengeManager: challengeManager,
    challenger: string
): createChallenge {
    let id = entity.createHashID([challengeManager.id, challenger])
    let _createChallenge = createChallenge.load(
        id
    )
    if (_createChallenge == null) {
        _createChallenge = new createChallenge(
            id
        )
        _createChallenge.challengeId = challengeManager.id
        _createChallenge.challenger = challenger
        challengeManager.createChallenge = entity.addRelation(
            challengeManager.createChallenge,
            id)
        log.info("create Challenge! challengeId: {}, challenger: {}, ({})", [challengeManager.id, challenger, id])
    }
    return _createChallenge as createChallenge
}

export function calChallengeNodeList(
    mdc: MDC,
    event: ethereum.Event,
    sourceTxTime: BigInt,
    sourceChainId: BigInt,
    sourceTXBlockNumber: BigInt,
    sourceTxIndex: BigInt,
): Bytes {
    const challengeIdentstring: string =
        (padZeroToBytes(16, sourceTxTime.toHexString())) +
        (padZeroToBytes(16, sourceChainId.toHexString())).slice(2) +
        (padZeroToBytes(16, sourceTXBlockNumber.toHexString())).slice(2) +
        (padZeroToBytes(16, sourceTxIndex.toHexString())).slice(2);
    const challengeIdentNum = (Bytes.fromHexString(challengeIdentstring))
    mdc.challengeNodeList = mdc.challengeNodeList.concat([challengeIdentNum])
    mdc.challengeNodeList = entity.addRelationBytes(mdc.challengeNodeList, challengeIdentNum)
    // debug fake list
    // let fakeBytes: Array<Bytes> = [
    //     Bytes.fromHexString('0x00000000499602d2000000000000000500000000499602d200000000499602FF'),
    //     Bytes.fromHexString('0x00000000499602d2000000000000000500000000499602d20000000049960200')]
    // fakeBytes = entity.addRelationBytes(fakeBytes, challengeIdentNum)

    // for (let i = 0; i < fakeBytes.length; i++) {
    //     log.warning("fakeBytes{}: {}", [i.toString(), fakeBytes[i].toHexString()])
    // }

    return challengeIdentNum;
}

export function getLiquidationEntity(
    challenger: string,
    challengeId: string,
    event: ethereum.Event
): liquidation {
    let _liquidation = liquidation.load(challenger)
    if (_liquidation == null) {
        _liquidation = new liquidation(challenger)
        _liquidation.challengeId = challengeId
        _liquidation.liquidators = event.transaction.from.toHexString()
        _liquidation.latestUpdateBlockNumber = event.block.number
        _liquidation.latestUpdateTimestamp = event.block.timestamp
        _liquidation.latestUpdateHash = event.transaction.hash.toHexString()
        log.info("Liquidation! challengeId: {}, challenger: {}, liquidators: {}", [challengeId, challenger, event.transaction.from.toHexString()])
    }
    return _liquidation as liquidation
}

export function getVerifyChallengeSourceEntity(
    challengeManager: challengeManager,
    challengeId: string
): verifyChallengeSource {
    let _entity = verifyChallengeSource.load(
        challengeId
    )
    if (_entity == null) {
        _entity = new verifyChallengeSource(
            challengeId
        )
        _entity.challengeId = challengeId
        challengeManager.verifyChallengeSource = challengeId
        log.info("verifyChallengeSource! challengeId: {}", [challengeId])
    }
    return _entity as verifyChallengeSource
}

export function getVerifyChallengeDestEntity(
    challengeManager: challengeManager,
    challengeId: string
): verifyChallengeDest {
    let _entity = verifyChallengeDest.load(
        challengeId
    )
    if (_entity == null) {
        _entity = new verifyChallengeDest(
            challengeId
        )
        _entity.challengeId = challengeId
        challengeManager.verifyChallengeDest = challengeId
        log.info("verifyChallengeDest! challengeId: {}", [challengeId])
    }
    return _entity as verifyChallengeDest
}

