import {
  Address,
  BigInt,
  Bytes,
  log,
  crypto,
  ByteArray,
} from '@graphprotocol/graph-ts';
import { calcaulateFunctionSelector, entity } from './utils';
import { factoryList } from './muti-dataSourceConfig';

export const subgraphManagerID: string = crypto
  .keccak256(Bytes.fromUTF8('subgraphManager'))
  .toHexString();

export class ContractDeployment {
  static getFactoryList(): Array<Address> {
    let lists = new Array<Address>(0);
    if (factoryList != '') {
      const factoryArray: string[] = factoryList.split(',');
      log.warning('factoryArray.length{}', [factoryArray.length.toString()]);
      if (factoryArray.length > 0) {
        for (let i = 0; i < factoryArray.length; i++) {
          log.info('create FactoryList[{}]: {}', [
            i.toString(),
            factoryArray[i],
          ]);
          lists.push(Address.fromString(factoryArray[i]));
        }
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
