// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ChallengeInfoUpdated extends ethereum.Event {
  get params(): ChallengeInfoUpdated__Params {
    return new ChallengeInfoUpdated__Params(this);
  }
}

export class ChallengeInfoUpdated__Params {
  _event: ChallengeInfoUpdated;

  constructor(event: ChallengeInfoUpdated) {
    this._event = event;
  }

  get challengeId(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get challengeInfo(): ChallengeInfoUpdatedChallengeInfoStruct {
    return changetype<ChallengeInfoUpdatedChallengeInfoStruct>(
      this._event.parameters[1].value.toTuple()
    );
  }
}

export class ChallengeInfoUpdatedChallengeInfoStruct extends ethereum.Tuple {
  get sourceTxFrom(): BigInt {
    return this[0].toBigInt();
  }

  get sourceTxTime(): BigInt {
    return this[1].toBigInt();
  }

  get challenger(): Address {
    return this[2].toAddress();
  }

  get freezeToken(): Address {
    return this[3].toAddress();
  }

  get challengeUserRatio(): BigInt {
    return this[4].toBigInt();
  }

  get freezeAmount0(): BigInt {
    return this[5].toBigInt();
  }

  get freezeAmount1(): BigInt {
    return this[6].toBigInt();
  }

  get challengeTime(): BigInt {
    return this[7].toBigInt();
  }

  get abortTime(): BigInt {
    return this[8].toBigInt();
  }

  get verifiedTime0(): BigInt {
    return this[9].toBigInt();
  }

  get verifiedTime1(): BigInt {
    return this[10].toBigInt();
  }

  get verifiedDataHash0(): Bytes {
    return this[11].toBytes();
  }
}

export class ColumnArrayUpdated extends ethereum.Event {
  get params(): ColumnArrayUpdated__Params {
    return new ColumnArrayUpdated__Params(this);
  }
}

export class ColumnArrayUpdated__Params {
  _event: ColumnArrayUpdated;

  constructor(event: ColumnArrayUpdated) {
    this._event = event;
  }

  get impl(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get columnArrayHash(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get dealers(): Array<Address> {
    return this._event.parameters[2].value.toAddressArray();
  }

  get ebcs(): Array<Address> {
    return this._event.parameters[3].value.toAddressArray();
  }

  get chainIds(): Array<BigInt> {
    return this._event.parameters[4].value.toBigIntArray();
  }
}

export class ResponseMakersUpdated extends ethereum.Event {
  get params(): ResponseMakersUpdated__Params {
    return new ResponseMakersUpdated__Params(this);
  }
}

export class ResponseMakersUpdated__Params {
  _event: ResponseMakersUpdated;

  constructor(event: ResponseMakersUpdated) {
    this._event = event;
  }

  get impl(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get responseMakers(): Array<BigInt> {
    return this._event.parameters[1].value.toBigIntArray();
  }
}

export class RulesRootUpdated extends ethereum.Event {
  get params(): RulesRootUpdated__Params {
    return new RulesRootUpdated__Params(this);
  }
}

export class RulesRootUpdated__Params {
  _event: RulesRootUpdated;

  constructor(event: RulesRootUpdated) {
    this._event = event;
  }

  get impl(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get ebc(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get rootWithVersion(): RulesRootUpdatedRootWithVersionStruct {
    return changetype<RulesRootUpdatedRootWithVersionStruct>(
      this._event.parameters[2].value.toTuple()
    );
  }
}

export class RulesRootUpdatedRootWithVersionStruct extends ethereum.Tuple {
  get root(): Bytes {
    return this[0].toBytes();
  }

  get version(): BigInt {
    return this[1].toBigInt();
  }
}

export class SpvUpdated extends ethereum.Event {
  get params(): SpvUpdated__Params {
    return new SpvUpdated__Params(this);
  }
}

export class SpvUpdated__Params {
  _event: SpvUpdated;

  constructor(event: SpvUpdated) {
    this._event = event;
  }

  get impl(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get chainId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get spv(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class MDC__getVersionAndEnableTimeResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  getVersion(): BigInt {
    return this.value0;
  }

  getBlockNumber(): BigInt {
    return this.value1;
  }

  getEnableTime(): BigInt {
    return this.value2;
  }
}

export class MDC__rulesRootResultValue0Struct extends ethereum.Tuple {
  get root(): Bytes {
    return this[0].toBytes();
  }

  get version(): BigInt {
    return this[1].toBigInt();
  }
}

export class MDC extends ethereum.SmartContract {
  static bind(address: Address): MDC {
    return new MDC("MDC", address);
  }

  columnArrayHash(): Bytes {
    let result = super.call(
      "columnArrayHash",
      "columnArrayHash():(bytes32)",
      []
    );

    return result[0].toBytes();
  }

  try_columnArrayHash(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "columnArrayHash",
      "columnArrayHash():(bytes32)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  freezeAssets(token: Address): BigInt {
    let result = super.call("freezeAssets", "freezeAssets(address):(uint256)", [
      ethereum.Value.fromAddress(token)
    ]);

    return result[0].toBigInt();
  }

  try_freezeAssets(token: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "freezeAssets",
      "freezeAssets(address):(uint256)",
      [ethereum.Value.fromAddress(token)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getVersionAndEnableTime(): MDC__getVersionAndEnableTimeResult {
    let result = super.call(
      "getVersionAndEnableTime",
      "getVersionAndEnableTime():(uint128,uint64,uint64)",
      []
    );

    return new MDC__getVersionAndEnableTimeResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_getVersionAndEnableTime(): ethereum.CallResult<
    MDC__getVersionAndEnableTimeResult
  > {
    let result = super.tryCall(
      "getVersionAndEnableTime",
      "getVersionAndEnableTime():(uint128,uint64,uint64)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new MDC__getVersionAndEnableTimeResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }

  mdcFactory(): Address {
    let result = super.call("mdcFactory", "mdcFactory():(address)", []);

    return result[0].toAddress();
  }

  try_mdcFactory(): ethereum.CallResult<Address> {
    let result = super.tryCall("mdcFactory", "mdcFactory():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  responseMakersHash(): Bytes {
    let result = super.call(
      "responseMakersHash",
      "responseMakersHash():(bytes32)",
      []
    );

    return result[0].toBytes();
  }

  try_responseMakersHash(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "responseMakersHash",
      "responseMakersHash():(bytes32)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  rulesRoot(ebc: Address): MDC__rulesRootResultValue0Struct {
    let result = super.call(
      "rulesRoot",
      "rulesRoot(address):((bytes32,uint32))",
      [ethereum.Value.fromAddress(ebc)]
    );

    return changetype<MDC__rulesRootResultValue0Struct>(result[0].toTuple());
  }

  try_rulesRoot(
    ebc: Address
  ): ethereum.CallResult<MDC__rulesRootResultValue0Struct> {
    let result = super.tryCall(
      "rulesRoot",
      "rulesRoot(address):((bytes32,uint32))",
      [ethereum.Value.fromAddress(ebc)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<MDC__rulesRootResultValue0Struct>(value[0].toTuple())
    );
  }

  spv(chainId: BigInt): Address {
    let result = super.call("spv", "spv(uint64):(address)", [
      ethereum.Value.fromUnsignedBigInt(chainId)
    ]);

    return result[0].toAddress();
  }

  try_spv(chainId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("spv", "spv(uint64):(address)", [
      ethereum.Value.fromUnsignedBigInt(chainId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ChallengeCall extends ethereum.Call {
  get inputs(): ChallengeCall__Inputs {
    return new ChallengeCall__Inputs(this);
  }

  get outputs(): ChallengeCall__Outputs {
    return new ChallengeCall__Outputs(this);
  }
}

export class ChallengeCall__Inputs {
  _call: ChallengeCall;

  constructor(call: ChallengeCall) {
    this._call = call;
  }

  get sourceChainId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get sourceTxHash(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get sourceTxTime(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get freezeToken(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get freezeAmount1(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }
}

export class ChallengeCall__Outputs {
  _call: ChallengeCall;

  constructor(call: ChallengeCall) {
    this._call = call;
  }
}

export class CheckChallengeCall extends ethereum.Call {
  get inputs(): CheckChallengeCall__Inputs {
    return new CheckChallengeCall__Inputs(this);
  }

  get outputs(): CheckChallengeCall__Outputs {
    return new CheckChallengeCall__Outputs(this);
  }
}

export class CheckChallengeCall__Inputs {
  _call: CheckChallengeCall;

  constructor(call: CheckChallengeCall) {
    this._call = call;
  }

  get sourceChainId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get sourceTxHash(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get verifiedData0(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }
}

export class CheckChallengeCall__Outputs {
  _call: CheckChallengeCall;

  constructor(call: CheckChallengeCall) {
    this._call = call;
  }
}

export class DepositCall extends ethereum.Call {
  get inputs(): DepositCall__Inputs {
    return new DepositCall__Inputs(this);
  }

  get outputs(): DepositCall__Outputs {
    return new DepositCall__Outputs(this);
  }
}

export class DepositCall__Inputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }

  get token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class DepositCall__Outputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get owner_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class UpdateColumnArrayCall extends ethereum.Call {
  get inputs(): UpdateColumnArrayCall__Inputs {
    return new UpdateColumnArrayCall__Inputs(this);
  }

  get outputs(): UpdateColumnArrayCall__Outputs {
    return new UpdateColumnArrayCall__Outputs(this);
  }
}

export class UpdateColumnArrayCall__Inputs {
  _call: UpdateColumnArrayCall;

  constructor(call: UpdateColumnArrayCall) {
    this._call = call;
  }

  get enableTime(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get dealers(): Array<Address> {
    return this._call.inputValues[1].value.toAddressArray();
  }

  get ebcs(): Array<Address> {
    return this._call.inputValues[2].value.toAddressArray();
  }

  get chainIds(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }
}

export class UpdateColumnArrayCall__Outputs {
  _call: UpdateColumnArrayCall;

  constructor(call: UpdateColumnArrayCall) {
    this._call = call;
  }
}

export class UpdateResponseMakersCall extends ethereum.Call {
  get inputs(): UpdateResponseMakersCall__Inputs {
    return new UpdateResponseMakersCall__Inputs(this);
  }

  get outputs(): UpdateResponseMakersCall__Outputs {
    return new UpdateResponseMakersCall__Outputs(this);
  }
}

export class UpdateResponseMakersCall__Inputs {
  _call: UpdateResponseMakersCall;

  constructor(call: UpdateResponseMakersCall) {
    this._call = call;
  }

  get enableTime(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get responseMakerSignatures(): Array<Bytes> {
    return this._call.inputValues[1].value.toBytesArray();
  }
}

export class UpdateResponseMakersCall__Outputs {
  _call: UpdateResponseMakersCall;

  constructor(call: UpdateResponseMakersCall) {
    this._call = call;
  }
}

export class UpdateRulesRootCall extends ethereum.Call {
  get inputs(): UpdateRulesRootCall__Inputs {
    return new UpdateRulesRootCall__Inputs(this);
  }

  get outputs(): UpdateRulesRootCall__Outputs {
    return new UpdateRulesRootCall__Outputs(this);
  }
}

export class UpdateRulesRootCall__Inputs {
  _call: UpdateRulesRootCall;

  constructor(call: UpdateRulesRootCall) {
    this._call = call;
  }

  get enableTime(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get ebc(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get rules(): Array<UpdateRulesRootCallRulesStruct> {
    return this._call.inputValues[2].value.toTupleArray<
      UpdateRulesRootCallRulesStruct
    >();
  }

  get rootWithVersion(): UpdateRulesRootCallRootWithVersionStruct {
    return changetype<UpdateRulesRootCallRootWithVersionStruct>(
      this._call.inputValues[3].value.toTuple()
    );
  }

  get sourceChainIds(): Array<BigInt> {
    return this._call.inputValues[4].value.toBigIntArray();
  }

  get pledgeAmounts(): Array<BigInt> {
    return this._call.inputValues[5].value.toBigIntArray();
  }
}

export class UpdateRulesRootCall__Outputs {
  _call: UpdateRulesRootCall;

  constructor(call: UpdateRulesRootCall) {
    this._call = call;
  }
}

export class UpdateRulesRootCallRulesStruct extends ethereum.Tuple {
  get chainId0(): BigInt {
    return this[0].toBigInt();
  }

  get chainId1(): BigInt {
    return this[1].toBigInt();
  }

  get status0(): i32 {
    return this[2].toI32();
  }

  get status1(): i32 {
    return this[3].toI32();
  }

  get token0(): BigInt {
    return this[4].toBigInt();
  }

  get token1(): BigInt {
    return this[5].toBigInt();
  }

  get minPrice0(): BigInt {
    return this[6].toBigInt();
  }

  get minPrice1(): BigInt {
    return this[7].toBigInt();
  }

  get maxPrice0(): BigInt {
    return this[8].toBigInt();
  }

  get maxPrice1(): BigInt {
    return this[9].toBigInt();
  }

  get withholdingFee0(): BigInt {
    return this[10].toBigInt();
  }

  get withholdingFee1(): BigInt {
    return this[11].toBigInt();
  }

  get tradingFee0(): BigInt {
    return this[12].toBigInt();
  }

  get tradingFee1(): BigInt {
    return this[13].toBigInt();
  }

  get responseTime0(): BigInt {
    return this[14].toBigInt();
  }

  get responseTime1(): BigInt {
    return this[15].toBigInt();
  }

  get compensationRatio0(): BigInt {
    return this[16].toBigInt();
  }

  get compensationRatio1(): BigInt {
    return this[17].toBigInt();
  }
}

export class UpdateRulesRootCallRootWithVersionStruct extends ethereum.Tuple {
  get root(): Bytes {
    return this[0].toBytes();
  }

  get version(): BigInt {
    return this[1].toBigInt();
  }
}

export class UpdateRulesRootERC20Call extends ethereum.Call {
  get inputs(): UpdateRulesRootERC20Call__Inputs {
    return new UpdateRulesRootERC20Call__Inputs(this);
  }

  get outputs(): UpdateRulesRootERC20Call__Outputs {
    return new UpdateRulesRootERC20Call__Outputs(this);
  }
}

export class UpdateRulesRootERC20Call__Inputs {
  _call: UpdateRulesRootERC20Call;

  constructor(call: UpdateRulesRootERC20Call) {
    this._call = call;
  }

  get enableTime(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get ebc(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get rules(): Array<UpdateRulesRootERC20CallRulesStruct> {
    return this._call.inputValues[2].value.toTupleArray<
      UpdateRulesRootERC20CallRulesStruct
    >();
  }

  get rootWithVersion(): UpdateRulesRootERC20CallRootWithVersionStruct {
    return changetype<UpdateRulesRootERC20CallRootWithVersionStruct>(
      this._call.inputValues[3].value.toTuple()
    );
  }

  get sourceChainIds(): Array<BigInt> {
    return this._call.inputValues[4].value.toBigIntArray();
  }

  get pledgeAmounts(): Array<BigInt> {
    return this._call.inputValues[5].value.toBigIntArray();
  }

  get token(): Address {
    return this._call.inputValues[6].value.toAddress();
  }
}

export class UpdateRulesRootERC20Call__Outputs {
  _call: UpdateRulesRootERC20Call;

  constructor(call: UpdateRulesRootERC20Call) {
    this._call = call;
  }
}

export class UpdateRulesRootERC20CallRulesStruct extends ethereum.Tuple {
  get chainId0(): BigInt {
    return this[0].toBigInt();
  }

  get chainId1(): BigInt {
    return this[1].toBigInt();
  }

  get status0(): i32 {
    return this[2].toI32();
  }

  get status1(): i32 {
    return this[3].toI32();
  }

  get token0(): BigInt {
    return this[4].toBigInt();
  }

  get token1(): BigInt {
    return this[5].toBigInt();
  }

  get minPrice0(): BigInt {
    return this[6].toBigInt();
  }

  get minPrice1(): BigInt {
    return this[7].toBigInt();
  }

  get maxPrice0(): BigInt {
    return this[8].toBigInt();
  }

  get maxPrice1(): BigInt {
    return this[9].toBigInt();
  }

  get withholdingFee0(): BigInt {
    return this[10].toBigInt();
  }

  get withholdingFee1(): BigInt {
    return this[11].toBigInt();
  }

  get tradingFee0(): BigInt {
    return this[12].toBigInt();
  }

  get tradingFee1(): BigInt {
    return this[13].toBigInt();
  }

  get responseTime0(): BigInt {
    return this[14].toBigInt();
  }

  get responseTime1(): BigInt {
    return this[15].toBigInt();
  }

  get compensationRatio0(): BigInt {
    return this[16].toBigInt();
  }

  get compensationRatio1(): BigInt {
    return this[17].toBigInt();
  }
}

export class UpdateRulesRootERC20CallRootWithVersionStruct extends ethereum.Tuple {
  get root(): Bytes {
    return this[0].toBytes();
  }

  get version(): BigInt {
    return this[1].toBigInt();
  }
}

export class UpdateSpvsCall extends ethereum.Call {
  get inputs(): UpdateSpvsCall__Inputs {
    return new UpdateSpvsCall__Inputs(this);
  }

  get outputs(): UpdateSpvsCall__Outputs {
    return new UpdateSpvsCall__Outputs(this);
  }
}

export class UpdateSpvsCall__Inputs {
  _call: UpdateSpvsCall;

  constructor(call: UpdateSpvsCall) {
    this._call = call;
  }

  get enableTime(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get spvs(): Array<Address> {
    return this._call.inputValues[1].value.toAddressArray();
  }

  get chainIds(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }
}

export class UpdateSpvsCall__Outputs {
  _call: UpdateSpvsCall;

  constructor(call: UpdateSpvsCall) {
    this._call = call;
  }
}

export class VerifyChallengeDestCall extends ethereum.Call {
  get inputs(): VerifyChallengeDestCall__Inputs {
    return new VerifyChallengeDestCall__Inputs(this);
  }

  get outputs(): VerifyChallengeDestCall__Outputs {
    return new VerifyChallengeDestCall__Outputs(this);
  }
}

export class VerifyChallengeDestCall__Inputs {
  _call: VerifyChallengeDestCall;

  constructor(call: VerifyChallengeDestCall) {
    this._call = call;
  }

  get spvAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get proof(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get spvBlockHashs(): Array<Bytes> {
    return this._call.inputValues[2].value.toBytesArray();
  }

  get verifyInfo(): VerifyChallengeDestCallVerifyInfoStruct {
    return changetype<VerifyChallengeDestCallVerifyInfoStruct>(
      this._call.inputValues[3].value.toTuple()
    );
  }

  get verifiedData0(): Array<BigInt> {
    return this._call.inputValues[4].value.toBigIntArray();
  }

  get rawDatas(): Bytes {
    return this._call.inputValues[5].value.toBytes();
  }
}

export class VerifyChallengeDestCall__Outputs {
  _call: VerifyChallengeDestCall;

  constructor(call: VerifyChallengeDestCall) {
    this._call = call;
  }
}

export class VerifyChallengeDestCallVerifyInfoStruct extends ethereum.Tuple {
  get data(): Array<BigInt> {
    return this[0].toBigIntArray();
  }

  get slots(): Array<VerifyChallengeDestCallVerifyInfoSlotsStruct> {
    return this[1].toTupleArray<VerifyChallengeDestCallVerifyInfoSlotsStruct>();
  }
}

export class VerifyChallengeDestCallVerifyInfoSlotsStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get key(): Bytes {
    return this[1].toBytes();
  }

  get value(): BigInt {
    return this[2].toBigInt();
  }
}

export class VerifyChallengeSourceCall extends ethereum.Call {
  get inputs(): VerifyChallengeSourceCall__Inputs {
    return new VerifyChallengeSourceCall__Inputs(this);
  }

  get outputs(): VerifyChallengeSourceCall__Outputs {
    return new VerifyChallengeSourceCall__Outputs(this);
  }
}

export class VerifyChallengeSourceCall__Inputs {
  _call: VerifyChallengeSourceCall;

  constructor(call: VerifyChallengeSourceCall) {
    this._call = call;
  }

  get spvAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get proof(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get spvBlockHashs(): Array<Bytes> {
    return this._call.inputValues[2].value.toBytesArray();
  }

  get verifyInfo(): VerifyChallengeSourceCallVerifyInfoStruct {
    return changetype<VerifyChallengeSourceCallVerifyInfoStruct>(
      this._call.inputValues[3].value.toTuple()
    );
  }

  get rawDatas(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class VerifyChallengeSourceCall__Outputs {
  _call: VerifyChallengeSourceCall;

  constructor(call: VerifyChallengeSourceCall) {
    this._call = call;
  }
}

export class VerifyChallengeSourceCallVerifyInfoStruct extends ethereum.Tuple {
  get data(): Array<BigInt> {
    return this[0].toBigIntArray();
  }

  get slots(): Array<VerifyChallengeSourceCallVerifyInfoSlotsStruct> {
    return this[1].toTupleArray<
      VerifyChallengeSourceCallVerifyInfoSlotsStruct
    >();
  }
}

export class VerifyChallengeSourceCallVerifyInfoSlotsStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get key(): Bytes {
    return this[1].toBytes();
  }

  get value(): BigInt {
    return this[2].toBigInt();
  }
}

export class VersionIncreaseAndEnableTimeCall extends ethereum.Call {
  get inputs(): VersionIncreaseAndEnableTimeCall__Inputs {
    return new VersionIncreaseAndEnableTimeCall__Inputs(this);
  }

  get outputs(): VersionIncreaseAndEnableTimeCall__Outputs {
    return new VersionIncreaseAndEnableTimeCall__Outputs(this);
  }
}

export class VersionIncreaseAndEnableTimeCall__Inputs {
  _call: VersionIncreaseAndEnableTimeCall;

  constructor(call: VersionIncreaseAndEnableTimeCall) {
    this._call = call;
  }

  get enableTime(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class VersionIncreaseAndEnableTimeCall__Outputs {
  _call: VersionIncreaseAndEnableTimeCall;

  constructor(call: VersionIncreaseAndEnableTimeCall) {
    this._call = call;
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }

  get token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}