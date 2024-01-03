import {
  Bytes,
  BigInt,
  ethereum,
  log,
  ByteArray,
  Address,
  bigInt,
} from '@graphprotocol/graph-ts';
import { MDC as mdcContract } from '../types/templates/MDC/MDC';
import {
  ONE_ADDRESS,
  getMDCEntity,
  ebcSave,
  AddressFmtPadZero,
  getChainInfoEntity,
  ChainInfoUpdatedMode,
  compareChainInfoUpdatedSelector,
  parseChainInfoUpdatedInputData,
  getTokenEntity,
  getColumnArrayUpdatedEntity,
  getcurrBoundSpvInfoEntity,
  // getdealerSnapshotEntity,
  mdcStoreEBCNewMapping,
  mdcStoreDealerNewMapping,
  mdcStoreChainIdNewMapping,
  mdcStoreResponseMaker,
  mdcStoreRuleSnapshot,
  getEBCEntityNew,
  // getEBCSnapshotEntity,
  // getChainIdSnapshotEntity,
  decodeEnabletime,
  func_updateColumnArrayName,
  STRING_INVALID,
  ETH_ZERO_ADDRESS,
  func_registerChainsName,
  func_updateChainSpvsName,
  fullfillLatestRuleSnapshot,
  function_challenge,
  func_challengeName,
  decodeCreateChallenge,
  function_checkChallenge,
  func_verifyChallengeSourceNameArray,
  function_verifyChallengeDest,
  decodeCheckChallenge,
  decodeVerifyChallengeSource,
  decodeVerifyChallengeDest,
  customData,
  function_verifyChallengeSourceSelcetorArray,
  function_verifyChallengeDestSelcetorArray,
  getChainInfoSnapshotEntity,
} from './helpers';
import {
  FactoryManager,
  withdrawRequestList,
  ebcRel,
  createChallenge,
} from '../types/schema';
import {
  funcETHRootMockInput,
  funcERC20RootMockInput,
  mockMdcAddr,
  funcETHRootMockInput2,
  functionUpdateChainSpvsMockinput,
  functionRegisterChainMockinput,
  functionupdateColumnArrayMockinput,
  functionrChallengeinput,
  functionCheckChallengeInput,
} from '../../tests/mock-data';
import {
  ChainInfoUpdatedChainInfoStruct,
  ChainTokenUpdatedTokenInfoStruct,
} from '../types/ORManager/ORManager';
import {
  calldata,
  entity,
  padZeroToBytes,
  padZeroToEven,
  padZeroToUint,
  removeDuplicates,
  removeDuplicatesBigInt,
} from './utils';
import {
  fetchTokenDecimals,
  fetchTokenName,
  fetchTokenSymbol,
} from './ERC20utils';
import { isProduction } from './config';
import { rscRules } from './rule-utils';
import {
  calChallengeNodeList,
  getChallengeManagerEntity,
  getCreateChallenge,
} from './mdc-challenge';

export enum challengeENUM {
  CREATE = 0,
  VERIFY_SOURCE = 1,
  VERIFY_DEST = 2,
  LIQUIDATION = 3,
}

export const challengeStatuses: string[] = [
  'CREATE',
  'VERIFY_SOURCE',
  'VERIFY_DEST',
  'LIQUIDATION',
];

export enum stringInitENUM {
  EMPTY = 0,
  INVALID = 1,
}

export const columnArrayStatuses: string[] = [
  'PARAMETER_DUPLICATION',
  'ALL_CLEAR',
];

export enum columnArrayENUM {
  PARAMETER_DUPLICATION = 0,
  ALL_CLEAR = 1,
}

export const stringInitStatuses: string[] = ['EMPTY', 'INVALID'];

export function handleupdateRulesRootEvent(
  event: ethereum.Event,
  impl: Bytes,
  ebc: Bytes,
  root: Bytes,
  version: BigInt,
): void {
  const _mdcAddress = event.address.toHexString();
  const mdcAddress = isProduction ? (_mdcAddress as string) : mockMdcAddr;
  const inputData = isProduction
    ? event.transaction.input
    : (Bytes.fromHexString(funcERC20RootMockInput) as Bytes);
  const updateRulesRootEntity = rscRules.parseCalldata(inputData, mdcAddress);
  const ebcAddress = updateRulesRootEntity.ebcAddress;
  let mdc = getMDCEntity(Address.fromString(mdcAddress), event);
  let factoryAddress = Bytes.fromHexString(mdc.factory._id);
  let factory = FactoryManager.load(factoryAddress.toHexString());

  log.info(
    'inputdata decode: ebc: {}, enableTime: {}, root: {}, version: {}, sourceChainIds:{}, pledgeAmounts: {}, tokenAddress :{}',
    [
      ebcAddress,
      updateRulesRootEntity.enableTimestamp.toString(),
      updateRulesRootEntity.root,
      updateRulesRootEntity.version.toString(),
      updateRulesRootEntity.sourceChainIds.toString(),
      updateRulesRootEntity.pledgeAmounts.toString(),
      updateRulesRootEntity.tokenAddr,
    ],
  );
  let lastestRuleIdArray: string[] = [];
  let ebcEntity: ebcRel;
  if (ebcAddress != null) {
    ebcEntity = getEBCEntityNew(ebcAddress, event);
    lastestRuleIdArray = mdcStoreRuleSnapshot(
      event,
      updateRulesRootEntity,
      mdc,
      ebcEntity,
    );
    ebcSave(ebcEntity, mdc);
    ebcEntity.save();
    mdc.save();
    if (ebcEntity != null) {
      fullfillLatestRuleSnapshot(event, mdc, ebcEntity, lastestRuleIdArray);
    }
    if (factory) {
      factory.save();
    }
  } else {
    log.warning('ebcAddress is null', ['error']);
  }
}

export function handleColumnArrayUpdatedEvent(
  event: ethereum.Event,
  impl: Bytes,
  columnArrayHash: Bytes,
  dealers: Array<Address>,
  ebcs: Array<Address>,
  chainIds: Array<BigInt>,
): void {
  let parameterDuplication: bool = false;
  const mdcAddress = isProduction
    ? event.address
    : Address.fromString(mockMdcAddr);
  let mdc = getMDCEntity(mdcAddress, event);
  const inputData = isProduction
    ? event.transaction.input
    : (Bytes.fromHexString(functionupdateColumnArrayMockinput) as Bytes);
  const enableTimestamp = decodeEnabletime(
    inputData,
    func_updateColumnArrayName,
  );

  // process dealers
  let uniqueDealers = removeDuplicates(dealers);
  if (dealers.length != uniqueDealers.length) {
    parameterDuplication = true;
  }
  let dealerArray = new Array<string>();
  for (let i = 0; i < uniqueDealers.length; i++) {
    dealerArray.push(uniqueDealers[i].toHexString());
  }
  // let dealerSnapshot = getdealerSnapshotEntity(mdc, event);
  // dealerSnapshot.columnArrayHash = columnArrayHash.toHexString();

  // process chainIds
  let uniqueChainIds = removeDuplicatesBigInt(chainIds);
  if (chainIds.length != uniqueChainIds.length) {
    parameterDuplication = true;
  }
  // let chainIdSnapshot = getChainIdSnapshotEntity(mdc, event);
  // chainIdSnapshot.columnArrayHash = columnArrayHash.toHexString();

  // process ebcs
  let uniqueEbcs = removeDuplicates(ebcs);
  if (ebcs.length != uniqueEbcs.length) {
    parameterDuplication = true;
  }
  let ebcsArray = new Array<string>();
  for (let i = 0; i < uniqueEbcs.length; i++) {
    ebcsArray.push(uniqueEbcs[i].toHexString());
  }
  // let ebcSnapshot = getEBCSnapshotEntity(mdc, event);
  // ebcSnapshot.columnArrayHash = columnArrayHash.toHexString();

  // process ColumnArray
  let columnArraySnapshot = getColumnArrayUpdatedEntity(event, mdc);
  columnArraySnapshot.enableTimestamp = enableTimestamp;
  columnArraySnapshot.columnArrayHash = columnArrayHash.toHexString();
  columnArraySnapshot.dealers = dealerArray;
  columnArraySnapshot.ebcs = ebcsArray;
  columnArraySnapshot.chainIds = uniqueChainIds;
  if (parameterDuplication) {
    columnArraySnapshot.columnArrayStatuses =
      columnArrayStatuses[columnArrayENUM.PARAMETER_DUPLICATION];
  } else {
    columnArraySnapshot.columnArrayStatuses =
      columnArrayStatuses[columnArrayENUM.ALL_CLEAR];
  }

  mdcStoreDealerNewMapping(
    mdc,
    dealerArray,
    event,
    enableTimestamp,
    columnArraySnapshot,
  );
  // dealerSnapshot.save();

  mdcStoreChainIdNewMapping(
    mdc,
    uniqueChainIds,
    event,
    enableTimestamp,
    columnArraySnapshot,
  );
  // chainIdSnapshot.save();

  mdcStoreEBCNewMapping(
    mdc,
    ebcsArray,
    event,
    enableTimestamp,
    columnArraySnapshot,
  );
  // ebcSnapshot.save();

  columnArraySnapshot.save();
  mdc.save();
}

export function handleEbcsUpdatedEvent(
  event: ethereum.Event,
  ebcs: Array<Address>,
  statuses: Array<boolean>,
): void {
  let _statuses = statuses;
  if (ebcs.length > statuses.length) {
    for (let i = statuses.length; i < ebcs.length; i++) {
      _statuses.push(true);
    }
  } else if (ebcs.length < statuses.length) {
    _statuses = statuses.slice(0, ebcs.length);
  }
}

export function handleChainInfoUpdatedEvent(
  event: ethereum.Event,
  chainInfoId: BigInt,
  chainInfo: ChainInfoUpdatedChainInfoStruct,
): void {
  // log.debug("handleChainInfoUpdated id:{}", [chainInfoId.toString()])
  let _chainInfo = getChainInfoEntity(event, chainInfoId);
  _chainInfo.nativeToken = padZeroToUint(chainInfo.nativeToken.toHexString());
  let batchLimit = chainInfo.batchLimit;
  let minVerifyChallengeSourceTxSecond =
    chainInfo.minVerifyChallengeSourceTxSecond;
  let maxVerifyChallengeSourceTxSecond =
    chainInfo.maxVerifyChallengeSourceTxSecond;
  let minVerifyChallengeDestTxSecond = chainInfo.minVerifyChallengeDestTxSecond;
  let maxVerifyChallengeDestTxSecond = chainInfo.maxVerifyChallengeDestTxSecond;
  let spvs = isProduction ? chainInfo.spvs : [Address.fromString(mockMdcAddr)];

  const inputdata = isProduction
    ? event.transaction.input
    : (Bytes.fromHexString(functionRegisterChainMockinput) as Bytes);
  const selector = compareChainInfoUpdatedSelector(
    calldata.getSelector(inputdata),
  );
  if (selector == ChainInfoUpdatedMode.registerChains) {
    log.info('registerChains', ['registerChains']);
    const enableTime = decodeEnabletime(inputdata, func_registerChainsName);
    _chainInfo.batchLimit = batchLimit;
    _chainInfo.minVerifyChallengeSourceTxSecond =
      minVerifyChallengeSourceTxSecond;
    _chainInfo.maxVerifyChallengeSourceTxSecond =
      maxVerifyChallengeSourceTxSecond;
    _chainInfo.minVerifyChallengeDestTxSecond = minVerifyChallengeDestTxSecond;
    _chainInfo.maxVerifyChallengeDestTxSecond = maxVerifyChallengeDestTxSecond;
    for (let i = 0; i < spvs.length; i++) {
      _chainInfo.spvs = entity.addRelation(
        _chainInfo.spvs,
        AddressFmtPadZero(spvs[i].toHexString()),
      );
    }
    _chainInfo.enableTimestamp = enableTime;
  } else if (selector == ChainInfoUpdatedMode.updateChainSpvs) {
    log.info('updateChainSpvs', ['updateChainSpvs']);
    const enableTime = decodeEnabletime(inputdata, func_updateChainSpvsName);
    parseChainInfoUpdatedInputData(inputdata, _chainInfo);
    _chainInfo.enableTimestamp = enableTime;
  } else {
    log.warning('chainInfoUpdated selector not match {}', [
      calldata.getSelector(inputdata).toHexString(),
    ]);
  }
  _chainInfo.save();

  let chainInfoSnapshot = getChainInfoSnapshotEntity(event, chainInfoId);
  chainInfoSnapshot.chainId = _chainInfo.id;
  chainInfoSnapshot.spvs = _chainInfo.spvs;
  chainInfoSnapshot.nativeToken = _chainInfo.nativeToken;
  chainInfoSnapshot.batchLimit = _chainInfo.batchLimit;
  chainInfoSnapshot.minVerifyChallengeSourceTxSecond =
    _chainInfo.minVerifyChallengeSourceTxSecond;
  chainInfoSnapshot.maxVerifyChallengeSourceTxSecond =
    _chainInfo.maxVerifyChallengeSourceTxSecond;
  chainInfoSnapshot.minVerifyChallengeDestTxSecond =
    _chainInfo.minVerifyChallengeDestTxSecond;
  chainInfoSnapshot.maxVerifyChallengeDestTxSecond =
    _chainInfo.maxVerifyChallengeDestTxSecond;
  chainInfoSnapshot.enableTimestamp = _chainInfo.enableTimestamp;
  chainInfoSnapshot.latestUpdateBlockNumber = event.block.number;
  chainInfoSnapshot.latestUpdateTimestamp = event.block.timestamp;
  chainInfoSnapshot.latestUpdateHash = event.transaction.hash.toHexString();
  chainInfoSnapshot.save();
}

export function handleChainTokenUpdatedEvent(
  event: ethereum.Event,
  chainId: BigInt,
  tokenInfo: ChainTokenUpdatedTokenInfoStruct,
): void {
  const token = tokenInfo.token.toHexString();
  const decimals = tokenInfo.decimals;
  const mainnetToken = tokenInfo.mainnetToken;
  const ERC20Token =
    mainnetToken.toHexString() != ETH_ZERO_ADDRESS
      ? mainnetToken.toHexString()
      : token;
  let Token = getTokenEntity(chainId, tokenInfo.token.toHexString(), event);
  Token.mainnetToken = mainnetToken.toHexString();
  if (mainnetToken.toHexString() == ETH_ZERO_ADDRESS) {
    // log.info('native token is ether', []);
    Token.name = 'Ether';
    Token.symbol = 'ETH';
    Token.decimals = decimals;
  } else {
    log.info('ERC20Token is {}, mainnetToken is {}', [
      ERC20Token,
      mainnetToken.toHexString(),
    ]);
    Token.name = fetchTokenName(Address.fromString(ERC20Token));
    Token.symbol = fetchTokenSymbol(Address.fromString(ERC20Token));
    const fetchTokenDecimal = fetchTokenDecimals(
      Address.fromString(ERC20Token),
    ).toI32();
    Token.decimals = fetchTokenDecimal != 0 ? fetchTokenDecimal : decimals;
  }

  Token.save();
}

export function handleResponseMakersUpdatedEvent(
  event: ethereum.Event,
  impl: Bytes,
  responseMakers: Array<BigInt>,
): void {
  const mdcAddress = isProduction
    ? event.address
    : Address.fromString(mockMdcAddr);
  let mdc = getMDCEntity(mdcAddress, event);
  let responseMakersArray = new Array<string>();
  for (let i = 0; i < responseMakers.length; i++) {
    responseMakersArray.push(
      AddressFmtPadZero(responseMakers[i].toHexString()),
    );
  }

  mdcStoreResponseMaker(mdc, responseMakersArray, event);
  mdc.save();
}

export function handleSpvUpdatedEvent(
  event: ethereum.Event,
  impl: Bytes,
  chainId: BigInt,
  spv: Bytes,
): void {
  let mdc = isProduction
    ? getMDCEntity(event.address, event)
    : getMDCEntity(Address.fromString(mockMdcAddr), event);
  let _spv = getcurrBoundSpvInfoEntity(mdc, chainId);
  _spv.spv = spv.toHexString();
  _spv.save();
  mdc.save();
  log.info('mdc {} update:  _spv[{}] = {}', [
    mdc.id,
    chainId.toString(),
    spv.toHexString(),
  ]);
}

export function handleChallengeInfoUpdatedEvent(
  event: ethereum.Event,
  challengeId: string,
  sourceTxFrom: string,
  sourceTxTime: BigInt,
  freezeToken: string,
  challengeUserRatio: BigInt,
  freezeAmount0: BigInt,
  freezeAmount1: BigInt,
  challengeTime: BigInt,
  abortTime: BigInt,
  sourceTXBlockNumber: BigInt,
  sourceTxIndex: BigInt,
  challengerVerifyTransactionFee: BigInt,
  winner: string,
  verifiedTime0: BigInt,
  verifiedTime1: BigInt,
  verifiedDataHash0: string,
): void {
  const inputdata = isProduction ? event.transaction.input : customData.input;
  const selector: string = calldata.getSelector(inputdata).toHexString();
  let mdc = getMDCEntity(event.address, event);
  let challengeManager = getChallengeManagerEntity(mdc, challengeId);
  if (selector == function_challenge) {
    log.info('trigger_challenge(), selector: {}', [selector]);
    const DecodeResult = decodeCreateChallenge(inputdata);
    const challenger: string = isProduction
      ? event.transaction.from.toHexString()
      : customData.challenger;
    let createChallenge = getCreateChallenge(
      challengeManager,
      challenger,
      mdc,
      challengeTime,
    );
    createChallenge.sourceChainId = DecodeResult.sourceChainId;
    createChallenge.sourceTxHash = DecodeResult.sourceTxHash;
    createChallenge.ruleKey = DecodeResult.ruleKey;
    createChallenge.challenger = event.transaction.from.toHexString();
    createChallenge.sourceTxTime = sourceTxTime;
    createChallenge.freezeToken = freezeToken;
    createChallenge.freezeAmountMaker = freezeAmount0;
    createChallenge.freezeAmountChallenger = freezeAmount1;
    createChallenge.createChallengeTimestamp = challengeTime;
    createChallenge.sourceTxBlockNum = sourceTXBlockNumber;
    createChallenge.sourceTxIndex = sourceTxIndex;
    createChallenge.totalChallengeVerifyCost = challengerVerifyTransactionFee;
    createChallenge.createChallengeHash = event.transaction.hash.toHexString();
    createChallenge.createChallengeBlockNumber = event.block.number;
    createChallenge.challengeNodeNumberParent = padZeroToBytes(
      64,
      DecodeResult.challengeNodeNumberParent,
    );
    createChallenge.challengeNodeNumber = calChallengeNodeList(
      sourceTxTime,
      DecodeResult.sourceChainId,
      sourceTXBlockNumber,
      sourceTxIndex,
    );
    createChallenge.liquidationTimestamp = BigInt.fromI32(0);
    createChallenge.liquidator = stringInitStatuses[stringInitENUM.EMPTY];
    createChallenge.liquidationHash = stringInitStatuses[stringInitENUM.EMPTY];
    createChallenge.liquidationBlockNumber = BigInt.fromI32(0);
    challengeManager.challengeStatuses =
      challengeStatuses[challengeENUM.CREATE];
    createChallenge.save();
  } else if (selector == function_checkChallenge) {
    let createChallenge: createChallenge;
    const challengerArray: string[] = decodeCheckChallenge(inputdata);
    for (let i = 0; i < challengerArray.length; i++) {
      const challenger: string = isProduction
        ? challengerArray[i]
        : customData.challenger;
      createChallenge = getCreateChallenge(
        challengeManager,
        challenger,
        mdc,
        challengeTime,
      );
      log.info(
        'trigger_checkChallenge(), selector: {}, id:{}, hash{}, index:{}',
        [
          selector,
          createChallenge.id,
          event.transaction.hash.toHexString(),
          i.toString(),
        ],
      );
      if (
        createChallenge.liquidator == stringInitStatuses[stringInitENUM.EMPTY]
      ) {
        createChallenge.liquidationTimestamp = abortTime;
        createChallenge.liquidator = event.transaction.from.toHexString();
        createChallenge.totalChallengeVerifyCost =
          challengerVerifyTransactionFee;
        createChallenge.liquidationHash = event.transaction.hash.toHexString();
        createChallenge.liquidationBlockNumber = event.block.number;
        createChallenge.save();
        break;
      }
    }
    challengeManager.challengeStatuses =
      challengeStatuses[challengeENUM.LIQUIDATION];
  } else if (function_verifyChallengeSourceSelcetorArray.includes(selector)) {
    log.info('trigger_verifyChallengeSource(), selector: {}', [selector]);
    // const challenger = decodeVerifyChallengeSource(inputdata, selector);
    // let verifyChallengeSource = getVerifyChallengeSourceEntity(
    //   challengeManager,
    //   challengeId,
    //   challenger,
    //   mdc.id,
    //   verifiedTime0,
    // );
    let createChallenge = getCreateChallenge(
      challengeManager,
      winner,
      mdc,
      challengeTime,
    );
    createChallenge.isVerifyPass = true;
    // verifyChallengeSource.sourceChainId = createChallenge.sourceChainId;
    challengeManager.sourceTxFrom = sourceTxFrom;
    // verifyChallengeSource.sourceTxTime = sourceTxTime;
    // challengeManager.challenger = challenger;
    // verifyChallengeSource.freezeToken = freezeToken;
    challengeManager.challengeUserRatio = challengeUserRatio;
    // verifyChallengeSource.freezeAmount0 = freezeAmount0;
    // verifyChallengeSource.freezeAmount1 = freezeAmount1;
    // verifyChallengeSource.challengeTime = challengeTime;
    // verifyChallengeSource.sourceTxBlockNum = sourceTXBlockNumber;
    // verifyChallengeSource.sourceTxIndex = sourceTxIndex;
    // challengeManager.challengerVerifyTransactionFee = challengerVerifyTransactionFee;
    challengeManager.verifyChallengeSourceTimestamp = verifiedTime0;
    // verifyChallengeSource.verifiedTime1 = verifiedTime1;
    // verifyChallengeSource.abortTime = abortTime;
    challengeManager.verifiedDataHash0 = verifiedDataHash0;
    // verifyChallengeSource.challengeNodeNumber =createChallenge.challengeNodeNumber;
    // verifyChallengeSource.createChallenge = createChallenge.id;
    challengeManager.verifyPassChallenger = winner;
    challengeManager.challengeSourceVerifier =
      event.transaction.from.toHexString();
    challengeManager.verifyChallengeSourceHash =
      event.transaction.hash.toHexString();
    challengeManager.verifyChallengeSourceNumber = event.block.number;
    challengeManager.challengeStatuses =
      challengeStatuses[challengeENUM.VERIFY_SOURCE];
    // verifyChallengeSource.save();
    createChallenge.save();
  } else if (function_verifyChallengeDestSelcetorArray.includes(selector)) {
    log.info('trigger_verifyChallengeDest(), selector: {}', [selector]);

    // const challenger = decodeVerifyChallengeDest(inputdata, selector);
    // let verifyChallengeDest = getVerifyChallengeDestEntity(
    //   challengeManager,
    //   challengeId,
    //   challenger,
    //   mdc.id,
    //   verifiedTime1,
    // );
    // let createChallenge = getCreateChallenge(challengeManager, challenger, mdc);
    // let verifyChallengeSource = getVerifyChallengeSourceEntity(
    //   challengeManager,
    //   challengeId,
    // );
    // verifyChallengeDest.sourceChainId = createChallenge.sourceChainId;
    // verifyChallengeDest.sourceTxFrom = sourceTxFrom;
    // verifyChallengeDest.sourceTxTime = sourceTxTime;
    // challengeManager.challenger = challenger;
    // verifyChallengeDest.freezeToken = freezeToken;
    // verifyChallengeDest.challengeUserRatio = challengeUserRatio;
    // verifyChallengeDest.freezeAmount0 = freezeAmount0;
    // verifyChallengeDest.freezeAmount1 = freezeAmount1;
    // verifyChallengeDest.challengeTime = challengeTime;
    // verifyChallengeDest.sourceTxBlockNum = sourceTXBlockNumber;
    // verifyChallengeDest.sourceTxIndex = sourceTxIndex;
    // verifyChallengeDest.challengerVerifyTransactionFee = challengerVerifyTransactionFee;
    // verifyChallengeDest.verifiedTime0 = verifiedTime0;
    challengeManager.verifyChallengeDestTimestamp = verifiedTime1;
    // verifyChallengeDest.abortTime = abortTime;
    // verifyChallengeDest.verifiedDataHash0 = verifiedDataHash0;
    // verifyChallengeDest.challengeNodeNumber = createChallenge.challengeNodeNumber;
    // verifyChallengeDest.createChallenge = createChallenge.id;
    // verifyChallengeDest.verifyChallengeSource = verifyChallengeSource.id;
    // verifyChallengeDest.winner = winner;
    challengeManager.challengeDestVerifier =
      event.transaction.from.toHexString();
    challengeManager.verifyChallengeDestHash =
      event.transaction.hash.toHexString();
    challengeManager.verifyChallengeDestNumber = event.block.number;
    challengeManager.challengeStatuses =
      challengeStatuses[challengeENUM.VERIFY_DEST];
    // verifyChallengeDest.save();
  } else {
    log.error('challenge function selector mismatch: {}', [selector]);
  }

  challengeManager.save();
  mdc.save();
}

export function handleWithdrawRequestedEvent(
  event: ethereum.Event,
  requestAmount: BigInt,
  minWithdrawTimestamp: BigInt,
  requestToken: string,
): void {
  let Id = entity.createHashEventID(event);
  let withdrawEntity = new withdrawRequestList(Id);
  if (withdrawEntity == null) {
    withdrawEntity = new withdrawRequestList(Id);
  }
  withdrawEntity.requestAmount = requestAmount;
  withdrawEntity.minWithdrawTimestamp = minWithdrawTimestamp;
  withdrawEntity.requestToken = requestToken;
  let mdc = getMDCEntity(event.address, event);
  withdrawEntity.owner = mdc.owner;
  mdc.withdrawRequestList = entity.addRelation(mdc.withdrawRequestList, Id);
  withdrawEntity.latestUpdateHash = event.transaction.hash.toHexString();
  withdrawEntity.latestUpdateTimestamp = event.block.timestamp;
  withdrawEntity.latestUpdateBlockNumber = event.block.number;
  withdrawEntity.save();
  mdc.save();
}
