import { log } from "matchstick-as"
import {
    MDC,
    challengeManager,
    createChallenge
} from "../types/schema"
import { entity } from "./utils"
import { STRING_EMPTY } from "./helpers"

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