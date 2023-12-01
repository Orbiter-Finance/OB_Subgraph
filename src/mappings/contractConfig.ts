import {
  Address,
  BigInt,
  Bytes,
  log,
  crypto,
  ByteArray,
} from '@graphprotocol/graph-ts';
import { calcaulateFunctionSelector, entity } from './utils';
import { ManulDataSource } from './config';

export const subgraphManagerID: string = crypto
  .keccak256(Bytes.fromUTF8('subgraphManager'))
  .toHexString();

export class ContractDeployment {
  static getFactoryList(): Array<Address> {
    let lists = new Array<Address>(0);
    if (ManulDataSource == true) {
      const factoryList: string[] = [
        '0x3E3A1e7A190E87bf60F3313C174BCc308973826b',
        '0xd7860BCEBaEc6Bc8dF2C5bD451d8bfc433b6E9D4',
        '0x5f26A8514b7A7A5fbF2a8a749AEeF06cBa8A00Cb',
        '0x08d4149CD76c0519Bf97BF5FDb97Aa97CEeF2D9D',
      ];
      for (let i = 0; i < factoryList.length; i++) {
        lists.push(Address.fromString(factoryList[i]));
      }
    }
    return lists;
  }

  // TODO: other contracts
  // static getFeeManagerList(): Array<Address> {

  // }

  // static getManagerList(): Array<Address> {

  // }
}
