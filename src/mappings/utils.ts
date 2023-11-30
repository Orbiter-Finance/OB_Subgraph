import {
  BigInt,
  BigDecimal,
  Bytes,
  log,
  EthereumUtils,
  ethereum,
  Address,
  crypto,
  Value,
  ValueKind,
  ByteArray,
} from '@graphprotocol/graph-ts';

export const tupleprefix =
  '0x0000000000000000000000000000000000000000000000000000000000000020';

export class entity {
  id: string;
  constructor(id: string) {
    this.id = id;
  }

  static addRelation(entity: string[], id: string): string[] {
    if (entity == null) {
      entity = [id];
    } else if (!entity.includes(id)) {
      entity = entity.concat([id]);
    }
    return entity;
  }

  static addRelationBytes(entity: Bytes[], id: Bytes): Bytes[] {
    if (entity == null) {
      entity = [id];
    } else if (!entity.includes(id)) {
      entity = entity.concat([id]);
      entity.sort((a, b) => b.toHexString().localeCompare(a.toHexString()));
    }
    return entity;
  }

  static createBindID(ids: Array<string>): string {
    let id = '';
    for (let i = 0; i < ids.length; i++) {
      if (i === 0) {
        id = ids[i];
      } else {
        id = id + '-' + ids[i];
      }
    }
    return id;
  }

  static createHashID(ids: Array<string>): string {
    let dataArray: Bytes = Bytes.fromHexString('');
    for (let i = 0; i < ids.length; i++) {
      dataArray = dataArray.concat(
        Bytes.fromHexString(padZeroToBytes(64, ids[i])),
      );
    }
    const key = crypto.keccak256(dataArray);
    return key.toHexString();
  }

  static createEventID(event: ethereum.Event): string {
    return (
      event.transaction.hash.toHexString() + '-' + event.logIndex.toString()
    );
  }

  static createHashEventID(event: ethereum.Event): string {
    const ids = [
      event.transaction.hash.toHexString(),
      event.logIndex.toString(),
    ];
    const tupleValue: Array<ethereum.Value> = new Array<ethereum.Value>(
      ids.length,
    );
    for (let i = 0; i < ids.length; i++) {
      tupleValue[i] = ethereum.Value.fromString(ids[i]);
    }
    const encodeData = ethereum.encode(
      ethereum.Value.fromTuple(changetype<ethereum.Tuple>(tupleValue)),
    )!;
    const key = crypto.keccak256(encodeData);
    return key.toHexString();
  }
}

export class calldata {
  static getSelector(data: Bytes): Bytes {
    return Bytes.fromHexString(data.toHexString().slice(2, 10));
  }

  static addPrefix(data: Bytes): Bytes {
    const dataWithoutSelector = Bytes.fromUint8Array(
      data.slice(4, data.length),
    );
    const Prefix = ByteArray.fromHexString(tupleprefix);
    const functionInputAsTuple = new Uint8Array(
      Prefix.length + dataWithoutSelector.length,
    );
    functionInputAsTuple.set(Prefix, 0);
    functionInputAsTuple.set(dataWithoutSelector, Prefix.length);
    if (functionInputAsTuple.length < 32) {
      log.error('Failed to decode transaction input data', ['error']);
    }
    const tupleInputBytes = Bytes.fromUint8Array(functionInputAsTuple);
    return tupleInputBytes;
  }
  static decodeWOPrefix(data: Bytes, functionFormat: string): ethereum.Tuple {
    const decoded = ethereum.decode(
      functionFormat,
      Bytes.fromUint8Array(data.slice(4, data.length)),
    ) as ethereum.Value;
    if (!decoded) {
      log.error('Failed to decode transaction input data', ['error']);
    }
    let tuple = decoded.toTuple();
    return tuple;
  }

  static decode(data: Bytes, functionFormat: string): ethereum.Tuple {
    const tupleInputBytes = this.addPrefix(data);
    const decoded = ethereum.decode(
      functionFormat,
      tupleInputBytes,
    ) as ethereum.Value;
    if (!decoded) {
      log.error('Failed to decode transaction input data', ['error']);
    }
    let tuple = decoded.toTuple();
    return tuple;
  }
}

export function encode(values: Array<ethereum.Value>): Bytes {
  const tuple = changetype<ethereum.Tuple>(new ArrayBuffer(32 * values.length));
  for (let i = 0; i < values.length; i++) {
    tuple[i] = values[i];
  }
  return ethereum.encode(ethereum.Value.fromTuple(tuple))!;
}

export function intConverHexString(value: BigInt): string {
  if (value) {
    return value.toHexString();
  } else {
    const address = Address.fromString(
      '0x0000000000000000000000000000000000000000',
    );
    return address.toHexString();
  }
}
export function padZeroToUint(hexString: string): string {
  const uint256Length = 64;
  let paddedHexString = hexString;
  if (paddedHexString.startsWith('0x')) {
    paddedHexString = paddedHexString.slice(2);
  }
  const hexStringLength = paddedHexString.length;
  if (hexStringLength < uint256Length) {
    const paddingLength = uint256Length - hexStringLength;
    const padding = '0'.repeat(paddingLength);
    paddedHexString = padding + paddedHexString;
  } else if (hexStringLength > uint256Length) {
    throw new Error('Invalid hex string length');
  }
  return '0x' + paddedHexString;
}

export function padZeroToAddress(hexString: string): string {
  const uint256Length = 40;
  let paddedHexString = hexString;
  if (paddedHexString.startsWith('0x')) {
    paddedHexString = paddedHexString.slice(2);
  }
  const hexStringLength = paddedHexString.length;
  if (hexStringLength < uint256Length) {
    const paddingLength = uint256Length - hexStringLength;
    const padding = '0'.repeat(paddingLength);
    paddedHexString = padding + paddedHexString;
  } else if (hexStringLength > uint256Length) {
    throw new Error('Invalid hex string length');
  }
  return '0x' + paddedHexString;
}

// notice: 2 BytesNumber = 1 bytes
// so: if you want to pad 32 bytes, you should set BytesNumber = 64
export function padZeroToBytes(BytesNumber: number, hexString: string): string {
  const uint256Length: number = BytesNumber;
  let paddedHexString = hexString.replace('0x', '').replace('-', '');
  const hexStringLength: number = paddedHexString.length;
  if (hexStringLength < uint256Length) {
    const paddingLength: i32 = ((uint256Length as i32) -
      hexStringLength) as i32;
    const padding = '0'.repeat(paddingLength as i32);
    paddedHexString = padding + paddedHexString;
  } else {
    // throw new Error('Invalid hex string length');
    paddedHexString = padZeroToEven(hexString);
    log.warning('paddedHexString: {}', [paddedHexString]);
  }

  return '0x' + paddedHexString;
}

export function findDifferentData(A: string[], B: string[]): string[] {
  // find the elements in A that are not in B
  // b elements > a elements
  const differentData: string[] = [];

  for (let i = 0; i < B.length; i++) {
    let found = false;

    for (let j = 0; j < A.length; j++) {
      if (B[i] == A[j]) {
        found = true;
        break;
      }
    }

    if (!found) {
      differentData.push(B[i]);
    }
  }

  return differentData;
}

export function calcaulateFunctionSelector(functionName: string): Bytes {
  return Bytes.fromHexString(
    crypto.keccak256(Bytes.fromUTF8(functionName)).toHexString().slice(0, 10),
  );
}

export function removeDuplicates(data: Array<Address>): Array<Address> {
  const uniques = new Array<Address>();
  for (let i = 0; i < data.length; i++) {
    let isDuplicate = false;
    for (let j = 0; j < uniques.length; j++) {
      if (data[i].equals(uniques[j])) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      uniques.push(data[i]);
    }
  }
  return uniques;
}

export function removeDuplicatesBigInt(data: Array<BigInt>): Array<BigInt> {
  const uniques = new Array<BigInt>();
  for (let i = 0; i < data.length; i++) {
    let isDuplicate = false;
    for (let j = 0; j < uniques.length; j++) {
      if (data[i].equals(uniques[j])) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      uniques.push(data[i]);
    }
  }
  return uniques;
}

export function padZeroToEven(hexString: string): string {
  let paddedHexString = hexString.replace('0x', '').replace('-', '');
  if (paddedHexString.length % 2 != 0) {
    paddedHexString = '0' + paddedHexString;
  }
  return paddedHexString;
}
