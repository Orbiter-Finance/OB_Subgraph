import { log } from "matchstick-as"
import {
    MDC,
    challengeManager,
    createChallenge
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
): void {
    const challengeIdentstring: string =
        (padZeroToBytes(16, sourceTxTime.toHexString())) +
        (padZeroToBytes(16, sourceChainId.toHexString())).slice(2) +
        (padZeroToBytes(16, sourceTXBlockNumber.toHexString())).slice(2) +
        (padZeroToBytes(16, sourceTxIndex.toHexString())).slice(2);
    log.info("new challengeIdentstring: {}", [challengeIdentstring])
    const challengeIdentNum = (Bytes.fromHexString(challengeIdentstring))
    log.info("new challengeIdentNum: {}", [challengeIdentNum.toHexString()])
    mdc.challengeNodeList = mdc.challengeNodeList.concat([challengeIdentNum])
    // mdc.challengeNodeList = entity.BytesSorting(mdc.challengeNodeList, challengeIdentNum)
    // debug fake list
    // let fakeBytes: Array<Bytes> = [Bytes.fromHexString('0x00000000499602d2000000000000000500000000499602d200000000499602FF')]
    // fakeBytes = entity.BytesSorting(fakeBytes, challengeIdentNum)

    // for (let i = 0; i < fakeBytes.length; i++) {
    //     log.warning("fakeBytes{}: {}", [i.toString(), fakeBytes[i].toHexString()])
    // }

}