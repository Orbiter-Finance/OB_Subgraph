import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
  DealerMapping,
  FactoryManager,
  SubgraphManager,
  submitterSnapshot,
  challengeUserRatioSnapshot,
  orManagerEnableTimeSnapshot,
} from '../types/schema';
import { log } from '@graphprotocol/graph-ts';
import { MDCFactory } from '../types/MDCFactory/MDCFactory';
import {
  MDC as MDCTemplate,
  MDCFactory as FactoryTemplate,
} from '../types/templates';

import {
  ONE_ADDRESS,
  ONE_NUM,
  calculateEnableBlockNumber,
  customData,
  decodeEnabletime,
  func_updateChallengeUserRatio,
  func_updateSubmitter,
  getFactoryEntity,
  getMDCEntity,
  getmdcLatestColumnEntity,
} from './helpers';
import { entity } from './utils';
import { isProduction } from './config';

export function handlechallengeUserRatioEvent(
  event: ethereum.Event,
  challengeUserRatio: BigInt,
): void {
  const managerAddress = event.address.toHexString().toLowerCase();
  const inputdata = event.transaction.input;
  const enableTime = decodeEnabletime(
    inputdata,
    func_updateChallengeUserRatio,
    true,
  );
  const id = entity.createHashID([
    managerAddress,
    event.transaction.hash.toHexString(),
    event.logIndex.toString(),
  ]);
  let snapshot = new challengeUserRatioSnapshot(id);
  snapshot.orManagerAddress = managerAddress;
  snapshot.challengeUserRatio = challengeUserRatio;
  snapshot.enableTimestamp = enableTime;
  snapshot.enableBlockNumber = calculateEnableBlockNumber(
    event.block.timestamp,
    enableTime,
    event.block.number,
  );
  snapshot.latestUpdateBlockNumber = event.block.number;
  snapshot.latestUpdateTimestamp = event.block.timestamp;
  snapshot.latestUpdateHash = event.transaction.hash.toHexString();
  snapshot.save();

  orManagerUpdateTimeInfo(event, enableTime);
}

export function handleSubmitterFeeUpdatedEvent(
  event: ethereum.Event,
  submitter: Address,
): void {
  const inputdata = isProduction ? event.transaction.input : customData.input;
  const enableTime = decodeEnabletime(inputdata, func_updateSubmitter, true);
  const id = entity.createHashID([
    event.transaction.hash.toHexString(),
    event.logIndex.toString(),
  ]);
  let snapshot = new submitterSnapshot(id);
  snapshot.submitterAddr = submitter.toHexString();
  snapshot.enableTimestamp = enableTime;
  snapshot.latestUpdateBlockNumber = event.block.number;
  snapshot.latestUpdateTimestamp = event.block.timestamp;
  snapshot.latestUpdateHash = event.transaction.hash.toHexString();
  snapshot.save();
  log.info('create submitterSnapshot id: {}', [id]);

  orManagerUpdateTimeInfo(event, enableTime);
}

export function orManagerUpdateTimeInfo(
  event: ethereum.Event,
  enableTimestamp: BigInt,
): void {
  if (enableTimestamp) {
    const managerAddress = event.address.toHexString();
    const id = entity.createHashID([
      managerAddress,
      enableTimestamp.toHexString(),
    ]);
    let enableTimeSnapshot = orManagerEnableTimeSnapshot.load(id);
    if (enableTimeSnapshot == null) {
      enableTimeSnapshot = new orManagerEnableTimeSnapshot(id);
      enableTimeSnapshot.managerAddr = managerAddress;
      enableTimeSnapshot.orManagerenableTimestamp = enableTimestamp;
      enableTimeSnapshot.orManagerlatestUpdateHash =
        event.transaction.hash.toHexString();
      enableTimeSnapshot.orManagerlatestUpdateTimestamp = event.block.timestamp;
      enableTimeSnapshot.orManagerlatestUpdateBlockNumber = event.block.number;
      enableTimeSnapshot.save();
    }
  }
}
