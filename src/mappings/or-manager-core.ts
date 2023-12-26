import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
  DealerMapping,
  FactoryManager,
  SubgraphManager,
  challengeUserRatioSnapshot,
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
  decodeEnabletime,
  func_updateChallengeUserRatio,
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
}
