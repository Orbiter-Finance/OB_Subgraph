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

export const subgraphManagerID: string = entity.createHashID([
  'subgraphManager',
]);

export class ContractDeployment {
  static getFactoryList(): Array<Address> {
    let lists = new Array<Address>(0);
    if (ManulDataSource == true) {
      const factoryList: string[] = [
        '0xd7860BCEBaEc6Bc8dF2C5bD451d8bfc433b6E9D4',
        '0x5f26A8514b7A7A5fbF2a8a749AEeF06cBa8A00Cb',
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
