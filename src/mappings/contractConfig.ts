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
        '0x414ab2622945dCf473726437aD9d7dFB734db3a6',
        '0x1752ae0B5d66470EC9e60067B312A57849CF301b',
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
