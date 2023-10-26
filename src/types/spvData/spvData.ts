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

export class BlockIntervalUpdated extends ethereum.Event {
  get params(): BlockIntervalUpdated__Params {
    return new BlockIntervalUpdated__Params(this);
  }
}

export class BlockIntervalUpdated__Params {
  _event: BlockIntervalUpdated;

  constructor(event: BlockIntervalUpdated) {
    this._event = event;
  }

  get blockInterval(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class HistoryBlockSaved extends ethereum.Event {
  get params(): HistoryBlockSaved__Params {
    return new HistoryBlockSaved__Params(this);
  }
}

export class HistoryBlockSaved__Params {
  _event: HistoryBlockSaved;

  constructor(event: HistoryBlockSaved) {
    this._event = event;
  }

  get blkNumber(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get blockHash(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }
}

export class spvData extends ethereum.SmartContract {
  static bind(address: Address): spvData {
    return new spvData("spvData", address);
  }

  getBlockHash(blkNumber: BigInt): Bytes {
    let result = super.call("getBlockHash", "getBlockHash(uint256):(bytes32)", [
      ethereum.Value.fromUnsignedBigInt(blkNumber)
    ]);

    return result[0].toBytes();
  }

  try_getBlockHash(blkNumber: BigInt): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "getBlockHash",
      "getBlockHash(uint256):(bytes32)",
      [ethereum.Value.fromUnsignedBigInt(blkNumber)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  getBlockInterval(): BigInt {
    let result = super.call(
      "getBlockInterval",
      "getBlockInterval():(uint64)",
      []
    );

    return result[0].toBigInt();
  }

  try_getBlockInterval(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getBlockInterval",
      "getBlockInterval():(uint64)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get manager_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class InjectBlocksByManagerCall extends ethereum.Call {
  get inputs(): InjectBlocksByManagerCall__Inputs {
    return new InjectBlocksByManagerCall__Inputs(this);
  }

  get outputs(): InjectBlocksByManagerCall__Outputs {
    return new InjectBlocksByManagerCall__Outputs(this);
  }
}

export class InjectBlocksByManagerCall__Inputs {
  _call: InjectBlocksByManagerCall;

  constructor(call: InjectBlocksByManagerCall) {
    this._call = call;
  }

  get startBlockNumber(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get endBlockNumber(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get injectionBlocks(): Array<InjectBlocksByManagerCallInjectionBlocksStruct> {
    return this._call.inputValues[2].value.toTupleArray<
      InjectBlocksByManagerCallInjectionBlocksStruct
    >();
  }
}

export class InjectBlocksByManagerCall__Outputs {
  _call: InjectBlocksByManagerCall;

  constructor(call: InjectBlocksByManagerCall) {
    this._call = call;
  }
}

export class InjectBlocksByManagerCallInjectionBlocksStruct extends ethereum.Tuple {
  get blkNumber(): BigInt {
    return this[0].toBigInt();
  }

  get blockHash(): Bytes {
    return this[1].toBytes();
  }
}

export class SaveHistoryBlocksCall extends ethereum.Call {
  get inputs(): SaveHistoryBlocksCall__Inputs {
    return new SaveHistoryBlocksCall__Inputs(this);
  }

  get outputs(): SaveHistoryBlocksCall__Outputs {
    return new SaveHistoryBlocksCall__Outputs(this);
  }
}

export class SaveHistoryBlocksCall__Inputs {
  _call: SaveHistoryBlocksCall;

  constructor(call: SaveHistoryBlocksCall) {
    this._call = call;
  }
}

export class SaveHistoryBlocksCall__Outputs {
  _call: SaveHistoryBlocksCall;

  constructor(call: SaveHistoryBlocksCall) {
    this._call = call;
  }
}

export class UpdateBlockIntervalCall extends ethereum.Call {
  get inputs(): UpdateBlockIntervalCall__Inputs {
    return new UpdateBlockIntervalCall__Inputs(this);
  }

  get outputs(): UpdateBlockIntervalCall__Outputs {
    return new UpdateBlockIntervalCall__Outputs(this);
  }
}

export class UpdateBlockIntervalCall__Inputs {
  _call: UpdateBlockIntervalCall;

  constructor(call: UpdateBlockIntervalCall) {
    this._call = call;
  }

  get blockInterval(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class UpdateBlockIntervalCall__Outputs {
  _call: UpdateBlockIntervalCall;

  constructor(call: UpdateBlockIntervalCall) {
    this._call = call;
  }
}
