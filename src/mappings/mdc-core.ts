import {
  Bytes,
  BigInt,
  ethereum,
  log,
  ByteArray,
  Address
} from "@graphprotocol/graph-ts";
import { MDC as mdcContract } from "../types/templates/MDC/MDC"
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
  getMDCBindSPVEntity,
  getdealerSnapshotEntity,
  mdcStoreEBCNewMapping,
  mdcStoreDealerNewMapping,
  mdcStoreChainIdNewMapping,
  mdcStoreResponseMaker,
  mdcStoreRuleSnapshot,
  getEBCEntityNew,
  getEBCSnapshotEntity,
  getChainIdSnapshotEntity,
  decodeEnabletime,
  func_updateColumnArrayName,
  STRING_INVALID,
  ETH_ZERO_ADDRESS,
  func_registerChainsName,
  func_updateChainSpvsName,
  fullfillLatestRuleSnapshot,
  function_challenge,
  func_challengeName,
  decodeChallengeSourceChainId,
  function_checkChallenge,
  function_verifyChallengeSource,
  function_verifyChallengeDest,
  decodeCheckChallenge,
  decodeVerifyChallengeSource,
  decodeVerifyChallengeDest
} from "./helpers"
import {
  FactoryManager, ebcRel
} from "../types/schema";
import {
  funcETHRootMockInput,
  funcERC20RootMockInput,
  mockMdcAddr,
  funcETHRootMockInput2,
  functionUpdateChainSpvsMockinput,
  functionRegisterChainMockinput,
  functionupdateColumnArrayMockinput,
  functionrChallengeinput,
  functionCheckChallengeInput
} from "../../tests/mock-data";
import { ChainInfoUpdatedChainInfoStruct, ChainTokenUpdatedTokenInfoStruct } from "../types/ORManager/ORManager";
import {
  calldata,
  entity,
  padZeroToUint,
  removeDuplicates,
  removeDuplicatesBigInt
} from "./utils";
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from "./ERC20utils";
import {
  isProduction
} from './config'
import { rscRules } from "./rule-utils";
import { calChallengeNodeList, getChallengeManagerEntity, getCreateChallenge, getLiquidationEntity, getVerifyChallengeDestEntity, getVerifyChallengeSourceEntity } from "./mdc-challenge";

enum challengeENUM {
  CREATE = 0,
  VERIFY_SOURCE = 1,
  VERIFY_DEST = 2,
  LIQUIDATION = 3
}

const challengeStatues: string[] = [
  "CREATE",
  "VERIFY_SOURCE",
  "VERIFY_DEST",
  "LIQUIDATION"
]

export function handleupdateRulesRootEvent(
  event: ethereum.Event,
  impl: Bytes,
  ebc: Bytes,
  root: Bytes,
  version: BigInt
): void {
  const _mdcAddress = event.address.toHexString()
  const mdcAddress = isProduction ? _mdcAddress as string : mockMdcAddr
  const inputData = isProduction ? event.transaction.input : Bytes.fromHexString(funcERC20RootMockInput) as Bytes
  const updateRulesRootEntity = rscRules.parseCalldata(inputData, mdcAddress)
  const ebcAddress = updateRulesRootEntity.ebcAddress
  let mdc = getMDCEntity(Address.fromString(mdcAddress), event)
  let factoryAddress = Bytes.fromHexString(mdc.factory._id)
  let factory = FactoryManager.load(factoryAddress.toHexString())

  log.info('inputdata decode: ebc: {}, enableTime: {}, root: {}, version: {}, sourceChainIds:{}, pledgeAmounts: {}, tokenAddress :{}',
    [
      ebcAddress,
      updateRulesRootEntity.enableTimestamp.toString(),
      updateRulesRootEntity.root,
      updateRulesRootEntity.version.toString(),
      updateRulesRootEntity.sourceChainIds.toString(),
      updateRulesRootEntity.pledgeAmounts.toString(),
      updateRulesRootEntity.tokenAddr
    ])
  let lastestRuleIdArray: string[] = []
  let ebcEntity: ebcRel
  if (ebcAddress != null) {
    ebcEntity = getEBCEntityNew(ebcAddress, event)
    lastestRuleIdArray = mdcStoreRuleSnapshot(event, updateRulesRootEntity, mdc, ebcEntity)
    ebcSave(ebcEntity, mdc)
    ebcEntity.save()
    mdc.save()
    if (ebcEntity != null) {
      fullfillLatestRuleSnapshot(
        event,
        mdc,
        ebcEntity,
        lastestRuleIdArray)
    }
    if (factory) {
      factory.save()
    }
  } else {
    log.warning("ebcAddress is null", ["error"])
  }

}

export function handleColumnArrayUpdatedEvent(
  event: ethereum.Event,
  impl: Bytes,
  columnArrayHash: Bytes,
  dealers: Array<Address>,
  ebcs: Array<Address>,
  chainIds: Array<BigInt>
): void {
  const mdcAddress = isProduction ? event.address : Address.fromString(mockMdcAddr);
  let mdc = getMDCEntity(mdcAddress, event)
  const inputData = isProduction ? event.transaction.input : Bytes.fromHexString(functionupdateColumnArrayMockinput) as Bytes
  const enableTimestamp = decodeEnabletime(inputData, func_updateColumnArrayName)

  // process dealers
  let uniqueDealers = removeDuplicates(dealers)
  let dealerArray = new Array<string>()
  for (let i = 0; i < uniqueDealers.length; i++) {
    dealerArray.push(uniqueDealers[i].toHexString())
  }
  const dealerSnapshot = getdealerSnapshotEntity(mdc, event)
  mdcStoreDealerNewMapping(mdc, dealerSnapshot, dealerArray, event, enableTimestamp)
  dealerSnapshot.save()

  // process chainIds
  let uniqueChainIds = removeDuplicatesBigInt(chainIds)
  const chainIdSnapshot = getChainIdSnapshotEntity(mdc, event)
  mdcStoreChainIdNewMapping(mdc, chainIdSnapshot, uniqueChainIds, event, enableTimestamp)
  chainIdSnapshot.save()

  // process ebcs
  let uniqueEbcs = removeDuplicates(ebcs)
  let ebcsArray = new Array<string>()
  for (let i = 0; i < uniqueEbcs.length; i++) {
    ebcsArray.push(uniqueEbcs[i].toHexString())
  }
  const ebcSnapshot = getEBCSnapshotEntity(mdc, event)
  mdcStoreEBCNewMapping(mdc, ebcSnapshot, ebcsArray, event, enableTimestamp)
  ebcSnapshot.save()

  // process ColumnArray
  let columnArrayUpdated = getColumnArrayUpdatedEntity(event, mdc)
  columnArrayUpdated.impl = impl.toHexString()
  columnArrayUpdated.columnArrayHash = columnArrayHash.toHexString()
  if (dealerArray.length > 0) {
    columnArrayUpdated.dealers = dealerArray
  }
  if (ebcsArray.length > 0) {
    columnArrayUpdated.ebcs = dealerArray
  }
  if (uniqueChainIds.length > 0) {
    columnArrayUpdated.chainIds = uniqueChainIds
  }
  columnArrayUpdated.save()

  mdc.save()
}

export function handleEbcsUpdatedEvent(
  event: ethereum.Event,
  ebcs: Array<Address>,
  statuses: Array<boolean>
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
  chainInfo: ChainInfoUpdatedChainInfoStruct
): void {
  // log.debug("handleChainInfoUpdated id:{}", [chainInfoId.toString()])
  let _chainInfo = getChainInfoEntity(event, chainInfoId)
  _chainInfo.nativeToken = padZeroToUint(chainInfo.nativeToken.toHexString())
  let batchLimit = chainInfo.batchLimit
  let minVerifyChallengeSourceTxSecond = chainInfo.minVerifyChallengeSourceTxSecond
  let maxVerifyChallengeSourceTxSecond = chainInfo.maxVerifyChallengeSourceTxSecond
  let minVerifyChallengeDestTxSecond = chainInfo.minVerifyChallengeDestTxSecond
  let maxVerifyChallengeDestTxSecond = chainInfo.maxVerifyChallengeDestTxSecond
  let spvs = isProduction ? chainInfo.spvs : [Address.fromString(mockMdcAddr)]

  const inputdata = isProduction ?
    event.transaction.input :
    Bytes.fromHexString(functionRegisterChainMockinput) as Bytes
  const selector = compareChainInfoUpdatedSelector(calldata.getSelector(inputdata))
  if (selector == ChainInfoUpdatedMode.registerChains) {
    log.info("registerChains", ["registerChains"])
    const enableTime = decodeEnabletime(inputdata, func_registerChainsName)
    _chainInfo.batchLimit = batchLimit
    _chainInfo.minVerifyChallengeSourceTxSecond = minVerifyChallengeSourceTxSecond
    _chainInfo.maxVerifyChallengeSourceTxSecond = maxVerifyChallengeSourceTxSecond
    _chainInfo.minVerifyChallengeDestTxSecond = minVerifyChallengeDestTxSecond
    _chainInfo.maxVerifyChallengeDestTxSecond = maxVerifyChallengeDestTxSecond
    for (let i = 0; i < spvs.length; i++) {
      _chainInfo.spvs = _chainInfo.spvs.concat([AddressFmtPadZero(spvs[i].toHexString())]);
    }
    _chainInfo.enableTimestamp = enableTime

  } else if (selector == ChainInfoUpdatedMode.updateChainSpvs) {
    log.info("updateChainSpvs", ["updateChainSpvs"])
    const enableTime = decodeEnabletime(inputdata, func_updateChainSpvsName)
    parseChainInfoUpdatedInputData(inputdata, _chainInfo)
    _chainInfo.enableTimestamp = enableTime

  } else {
    log.warning("chainInfoUpdated selector not match {}", [calldata.getSelector(inputdata).toHexString()])
  }
  _chainInfo.save()

}

export function handleChainTokenUpdatedEvent(
  event: ethereum.Event,
  chainId: BigInt,
  tokenInfo: ChainTokenUpdatedTokenInfoStruct
): void {
  const token = tokenInfo.token.toHexString()
  const decimals = tokenInfo.decimals
  const mainnetToken = tokenInfo.mainnetToken
  const ERC20Token
    = mainnetToken.toHexString() != ETH_ZERO_ADDRESS
      ? mainnetToken.toHexString() : token
  let Token = getTokenEntity(chainId, tokenInfo.token.toHexString(), event)
  Token.mainnetToken = mainnetToken.toHexString()
  if (mainnetToken.toHexString() == ETH_ZERO_ADDRESS) {
    log.info("native token is ether", [])
    Token.name = "Ether"
    Token.symbol = "ETH"
    Token.decimals = decimals
  } else {
    log.info("ERC20Token is {}, mainnetToken is {}", [ERC20Token, mainnetToken.toHexString()])
    Token.name = fetchTokenName(Address.fromString(ERC20Token))
    Token.symbol = fetchTokenSymbol(Address.fromString(ERC20Token))
    const fetchTokenDecimal = fetchTokenDecimals(Address.fromString(ERC20Token)).toI32()
    Token.decimals = fetchTokenDecimal != 0 ? fetchTokenDecimal : decimals
  }

  Token.save()
}

export function handleResponseMakersUpdatedEvent(
  event: ethereum.Event,
  impl: Bytes,
  responseMakers: Array<BigInt>
): void {
  const mdcAddress = isProduction ? event.address : Address.fromString(mockMdcAddr);
  let mdc = getMDCEntity(mdcAddress, event)
  let responseMakersArray = new Array<string>()
  for (let i = 0; i < responseMakers.length; i++) {
    responseMakersArray.push(AddressFmtPadZero(responseMakers[i].toHexString()))
  }

  mdcStoreResponseMaker(mdc, responseMakersArray, event)
  mdc.save()
}

export function handleSpvUpdatedEvent(
  event: ethereum.Event,
  impl: Bytes,
  chainId: BigInt,
  spv: Bytes
): void {
  let mdc = isProduction ? getMDCEntity(event.address, event) : getMDCEntity(Address.fromString(mockMdcAddr), event)
  let _spv = getMDCBindSPVEntity(mdc, chainId)
  _spv.spv = spv.toHexString()
  _spv.save()
  mdc.save()
  log.info('mdc {} update:  _spv[{}] = {}', [mdc.id, chainId.toString(), spv.toHexString()])
}

export function handleChallengeInfoUpdatedEvent(
  event: ethereum.Event,
  challengeId: string,
  sourceTxFrom: BigInt,
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
  verifiedDataHash0: string
): void {
  const inputdata = isProduction ?
    event.transaction.input :
    Bytes.fromHexString(functionCheckChallengeInput) as Bytes
  const selector: string = calldata.getSelector(inputdata).toHexString()
  let mdc = getMDCEntity(event.address, event)
  let challengeManager = getChallengeManagerEntity(mdc, challengeId)
  if (selector == function_challenge) {
    log.debug("trigger challenge(), selector: {}", [selector]);
    const sourceChainId = decodeChallengeSourceChainId(inputdata)
    // log.debug("SourceChainId: {}", [sourceChainId.toString()])
    const challenger: string = event.transaction.from.toHexString();
    let createChallenge = getCreateChallenge(challengeManager, challenger)
    createChallenge.sourceChainId = sourceChainId
    createChallenge.msgSender = event.transaction.from.toHexString()
    createChallenge.challenger = event.transaction.from.toHexString()
    createChallenge.sourceTxTime = sourceTxTime
    createChallenge.freezeToken = freezeToken
    createChallenge.freezeAmount0 = freezeAmount0
    createChallenge.freezeAmount1 = freezeAmount1
    createChallenge.challengeTime = challengeTime
    createChallenge.sourceTxBlockNum = sourceTXBlockNumber
    createChallenge.sourceTxIndex = sourceTxIndex
    createChallenge.challengerVerifyTransactionFee = challengerVerifyTransactionFee
    createChallenge.latestUpdateHash = event.transaction.hash.toHexString()
    createChallenge.latestUpdateTimestamp = event.block.timestamp
    createChallenge.latestUpdateBlockNumber = event.block.number
    createChallenge.challengeNodeNumber = calChallengeNodeList(
      mdc,
      event,
      sourceTxTime,
      sourceChainId,
      sourceTXBlockNumber,
      sourceTxIndex
    )
    createChallenge.save()
    challengeManager.challengeStatues = challengeStatues[challengeENUM.CREATE]
  } else if (selector == function_checkChallenge) {
    log.debug("trigger checkChallenge(), selector: {}", [selector]);
    const challengerArray: string[] = decodeCheckChallenge(inputdata)
    for (let i = 0; i < challengerArray.length; i++) {
      let liquidation = getLiquidationEntity(
        challengerArray[i],
        challengeId,
        event)
      challengeManager.liquidation = entity.addRelation(challengeManager.liquidation, challengerArray[i])
      liquidation.save()
    }
    challengeManager.challengeStatues = challengeStatues[challengeENUM.LIQUIDATION]

  } else if (selector == function_verifyChallengeSource) {
    let verifyChallengeSource = getVerifyChallengeSourceEntity(
      challengeManager, challengeId
    )
    const challenger = decodeVerifyChallengeSource(inputdata)
    let createChallenge = getCreateChallenge(challengeManager, challenger)
    verifyChallengeSource.sourceChainId = createChallenge.sourceChainId
    verifyChallengeSource.sourceTxFrom = sourceTxFrom
    verifyChallengeSource.sourceTxTime = sourceTxTime
    verifyChallengeSource.challenger = challenger
    verifyChallengeSource.freezeToken = freezeToken
    verifyChallengeSource.challengeUserRatio = challengeUserRatio
    verifyChallengeSource.freezeAmount0 = freezeAmount0
    verifyChallengeSource.freezeAmount1 = freezeAmount1
    verifyChallengeSource.challengeTime = challengeTime
    verifyChallengeSource.sourceTxBlockNum = sourceTXBlockNumber
    verifyChallengeSource.sourceTxIndex = sourceTxIndex
    verifyChallengeSource.challengerVerifyTransactionFee = challengerVerifyTransactionFee
    verifyChallengeSource.verifiedTime0 = verifiedTime0
    verifyChallengeSource.verifiedTime1 = verifiedTime1
    verifyChallengeSource.verifiedDataHash0 = verifiedDataHash0
    verifyChallengeSource.challengeNodeNumber = createChallenge.challengeNodeNumber
    verifyChallengeSource.msgSender = event.transaction.from.toHexString()
    verifyChallengeSource.latestUpdateHash = event.transaction.hash.toHexString()
    verifyChallengeSource.latestUpdateTimestamp = event.block.timestamp
    verifyChallengeSource.latestUpdateBlockNumber = event.block.number
    challengeManager.challengeStatues = challengeStatues[challengeENUM.VERIFY_SOURCE]
  } else if (selector == function_verifyChallengeDest) {
    let verifyChallengeDest = getVerifyChallengeDestEntity(
      challengeManager, challengeId
    )
    const challenger = decodeVerifyChallengeDest(inputdata)
    let createChallenge = getCreateChallenge(challengeManager, challenger)
    verifyChallengeDest.sourceChainId = createChallenge.sourceChainId
    verifyChallengeDest.sourceTxFrom = sourceTxFrom
    verifyChallengeDest.sourceTxTime = sourceTxTime
    verifyChallengeDest.challenger = challenger
    verifyChallengeDest.freezeToken = freezeToken
    verifyChallengeDest.challengeUserRatio = challengeUserRatio
    verifyChallengeDest.freezeAmount0 = freezeAmount0
    verifyChallengeDest.freezeAmount1 = freezeAmount1
    verifyChallengeDest.challengeTime = challengeTime
    verifyChallengeDest.sourceTxBlockNum = sourceTXBlockNumber
    verifyChallengeDest.sourceTxIndex = sourceTxIndex
    verifyChallengeDest.challengerVerifyTransactionFee = challengerVerifyTransactionFee
    verifyChallengeDest.verifiedTime0 = verifiedTime0
    verifyChallengeDest.verifiedTime1 = verifiedTime1
    verifyChallengeDest.verifiedDataHash0 = verifiedDataHash0
    verifyChallengeDest.challengeNodeNumber = createChallenge.challengeNodeNumber
    verifyChallengeDest.msgSender = event.transaction.from.toHexString()
    verifyChallengeDest.latestUpdateHash = event.transaction.hash.toHexString()
    verifyChallengeDest.latestUpdateTimestamp = event.block.timestamp
    verifyChallengeDest.latestUpdateBlockNumber = event.block.number
    challengeManager.challengeStatues = challengeStatues[challengeENUM.VERIFY_SOURCE]
  } else {
    log.error("challenge function selector mismatch: {}", [selector])
  }

  challengeManager.save()
  mdc.save()
}