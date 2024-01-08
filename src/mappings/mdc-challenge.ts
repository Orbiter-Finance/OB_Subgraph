import { log } from 'matchstick-as';
import { MDC, challengeManager, createChallenge } from '../types/schema';
import { entity, padZeroToBytes } from './utils';
import { STRING_EMPTY } from './helpers';
import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import {
  challengeStatuses,
  challengeENUM,
  stringInitENUM,
  stringInitStatuses,
} from './mdc-core';

export function getChallengeManagerEntity(
  mdc: MDC,
  challengeId: string,
): challengeManager {
  const challengeManagerId = entity.createHashID([challengeId, mdc.id]);
  let manager = challengeManager.load(challengeManagerId);
  if (manager == null) {
    manager = new challengeManager(challengeManagerId);
    manager.createChallenge = [];
    mdc.challengeManager = entity.addRelation(
      mdc.challengeManager,
      challengeManagerId,
    );
    manager.mdcAddr = mdc.id;
    manager.owner = mdc.owner;
    log.info('create challengeManager: {}', [challengeManagerId]);
    manager.challengeStatuses = challengeStatuses[challengeENUM.CREATE];
    manager.challengeId = challengeId;
    manager.sourceTxFrom = stringInitStatuses[stringInitENUM.EMPTY];
    manager.challengeUserRatio = BigInt.fromI32(0);
    manager.verifyChallengeSourceTimestamp = BigInt.fromI32(0);
    manager.verifiedDataHash0 = stringInitStatuses[stringInitENUM.EMPTY];
    manager.verifyPassChallenger = stringInitStatuses[stringInitENUM.EMPTY];
    // manager.challengerVerifyTransactionFee = BigInt.fromI32(0);
    manager.challengeSourceVerifier = stringInitStatuses[stringInitENUM.EMPTY];
    manager.verifyChallengeSourceHash =
      stringInitStatuses[stringInitENUM.EMPTY];
    manager.verifyChallengeSourceNumber = BigInt.fromI32(0);
    manager.challengeDestVerifier = stringInitStatuses[stringInitENUM.EMPTY];
    manager.verifyChallengeDestTimestamp = BigInt.fromI32(0);
    manager.verifyChallengeDestHash = stringInitStatuses[stringInitENUM.EMPTY];
    manager.verifyChallengeDestNumber = BigInt.fromI32(0);
  }
  return manager as challengeManager;
}

export function getCreateChallenge(
  challengeManager: challengeManager,
  challenger: string,
  mdc: MDC,
  createChallengeTimestamp: BigInt,
): createChallenge {
  let id = entity.createHashID([
    challengeManager.challengeId,
    challenger,
    mdc.id,
    createChallengeTimestamp.toHexString(),
  ]);
  let _createChallenge = createChallenge.load(id);
  if (_createChallenge == null) {
    _createChallenge = new createChallenge(id);
    _createChallenge.challengeId = challengeManager.challengeId;
    _createChallenge.challenger = challenger;
    _createChallenge.isVerifyPass = false;
    log.info('new_CreateChallenge, managerId: {}, challenger: {}, id: {}', [
      challengeManager.id,
      challenger,
      id,
    ]);
    challengeManager.createChallenge = entity.addRelation(
      challengeManager.createChallenge,
      id,
    );
    challengeManager.save();
  } else {
    log.info('load_CreateChallenge, managerId: {}, challenger: {}, id: {}', [
      challengeManager.id,
      challenger,
      id,
    ]);
  }
  return _createChallenge as createChallenge;
}

export function calChallengeNodeList(
  sourceTxTime: BigInt,
  sourceChainId: BigInt,
  sourceTXBlockNumber: BigInt,
  sourceTxIndex: BigInt,
): string {
  return Bytes.fromHexString(
    padZeroToBytes(16, sourceTxTime.toHexString()) +
      padZeroToBytes(16, sourceChainId.toHexString()).slice(2) +
      padZeroToBytes(16, sourceTXBlockNumber.toHexString()).slice(2) +
      padZeroToBytes(16, sourceTxIndex.toHexString()).slice(2),
  ).toHexString();
}

// export function getLiquidationEntity(
//   challenger: string,
//   challengeId: string,
//   event: ethereum.Event,
// ): liquidation {
//   let _liquidation = liquidation.load(challenger);
//   if (_liquidation == null) {
//     _liquidation = new liquidation(challenger);
//     _liquidation.challengeId = challengeId;
//     _liquidation.liquidators = event.transaction.from.toHexString();
//     _liquidation.latestUpdateBlockNumber = event.block.number;
//     _liquidation.latestUpdateHash = event.transaction.hash.toHexString();
//     log.info('Liquidation! challengeId: {}, challenger: {}, liquidators: {}', [
//       challengeId,
//       challenger,
//       event.transaction.from.toHexString(),
//     ]);
//   }
//   return _liquidation as liquidation;
// }

// export function getVerifyChallengeSourceEntity(
//   challengeManager: challengeManager,
//   challengeId: string,
//   challengerAddress: string,
//   mdcAddress: string,
//   verifyChallengeSourceTimestamp: BigInt,
// ): verifyChallengeSource {
//   const verifyChallengeSourceId = entity.createHashID([
//     challengeId,
//     challengerAddress,
//     mdcAddress,
//     verifyChallengeSourceTimestamp.toHexString(),
//   ]);
//   let _entity = verifyChallengeSource.load(verifyChallengeSourceId);
//   if (_entity == null) {
//     _entity = new verifyChallengeSource(verifyChallengeSourceId);
//     challengeManager.verifyChallengeSource = verifyChallengeSourceId;
//     log.info('create verifySourceEntity! challengeId: {}', [
//       verifyChallengeSourceId,
//     ]);
//   }
//   return _entity as verifyChallengeSource;
// }

// export function getVerifyChallengeDestEntity(
//   challengeManager: challengeManager,
//   challengeId: string,
//   challengerAddress: string,
//   mdcAddress: string,
//   verifyChallengeDestTimestamp: BigInt,
// ): verifyChallengeDest {
//   const verifyChallengeDestId = entity.createHashID([
//     challengeId,
//     challengerAddress,
//     mdcAddress,
//     verifyChallengeDestTimestamp.toHexString(),
//   ]);
//   let _entity = verifyChallengeDest.load(verifyChallengeDestId);
//   if (_entity == null) {
//     _entity = new verifyChallengeDest(verifyChallengeDestId);
//     challengeManager.verifyChallengeDest = verifyChallengeDestId;
//     log.info('create verifyDestEntity! challengeId: {}', [
//       verifyChallengeDestId,
//     ]);
//   }
//   return _entity as verifyChallengeDest;
// }
