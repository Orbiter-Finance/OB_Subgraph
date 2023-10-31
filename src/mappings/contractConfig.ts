import {
  Address,
  BigInt,
  Bytes,
  log,
  crypto,
  ByteArray,
} from "@graphprotocol/graph-ts"
import { calcaulateFunctionSelector, entity } from "./utils"
import { ManulDataSource } from "./config";

export const subgraphManagerID: string = entity.createHashID(["subgraphManager"]);

export class ContractDeployment {

  static getFactoryList(): Array<Address> {
    let lists = new Array<Address>(0)
    if (ManulDataSource == true) {
      const factoryList: string[] = [
        "0x6747B308651B23C11D6019E38394b805F3BCa82B",
        "0xfd854cb189Eb6754f02c5d6d0f9a70D78629F644"
      ];
      for (let i = 0; i < factoryList.length; i++) {
        lists.push(Address.fromString(factoryList[i]))
      }
    }
    return lists
  }

  // TODO: other contracts
  // static getFeeManagerList(): Array<Address> {

  // }

  // static getManagerList(): Array<Address> {

  // }
}
