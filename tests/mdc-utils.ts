import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  ChallengeInfoUpdated,
  ColumnArrayUpdated,
  ResponseMakersUpdated,
  RulesRootUpdated,
  SpvUpdated
} from "../src/types/templates/MDC/MDC"

export function createChallengeInfoUpdatedEvent(
  challengeId: Bytes,
  statement: ethereum.Tuple,
  result: ethereum.Tuple
): ChallengeInfoUpdated {
  let challengeInfoUpdatedEvent = changetype<ChallengeInfoUpdated>(
    newMockEvent()
  )

  challengeInfoUpdatedEvent.parameters = new Array()

  challengeInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "challengeId",
      ethereum.Value.fromFixedBytes(challengeId)
    )
  )
  challengeInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam("statement", ethereum.Value.fromTuple(statement))
  )
  challengeInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam("result", ethereum.Value.fromTuple(result))
  )

  return challengeInfoUpdatedEvent
}

export function createColumnArrayUpdatedEvent(
  impl: Address,
  columnArrayHash: Bytes,
  dealers: Array<Address>,
  ebcs: Array<Address>,
  chainIds: Array<BigInt>
): ColumnArrayUpdated {
  let columnArrayUpdatedEvent = changetype<ColumnArrayUpdated>(newMockEvent())

  columnArrayUpdatedEvent.parameters = new Array()

  columnArrayUpdatedEvent.parameters.push(
    new ethereum.EventParam("impl", ethereum.Value.fromAddress(impl))
  )
  columnArrayUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "columnArrayHash",
      ethereum.Value.fromFixedBytes(columnArrayHash)
    )
  )
  columnArrayUpdatedEvent.parameters.push(
    new ethereum.EventParam("dealers", ethereum.Value.fromAddressArray(dealers))
  )
  columnArrayUpdatedEvent.parameters.push(
    new ethereum.EventParam("ebcs", ethereum.Value.fromAddressArray(ebcs))
  )
  columnArrayUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "chainIds",
      ethereum.Value.fromUnsignedBigIntArray(chainIds)
    )
  )

  return columnArrayUpdatedEvent
}

export function createResponseMakersUpdatedEvent(
  impl: Address,
  responseMakers: Array<BigInt>
): ResponseMakersUpdated {
  let responseMakersUpdatedEvent = changetype<ResponseMakersUpdated>(
    newMockEvent()
  )

  responseMakersUpdatedEvent.parameters = new Array()

  responseMakersUpdatedEvent.parameters.push(
    new ethereum.EventParam("impl", ethereum.Value.fromAddress(impl))
  )
  responseMakersUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "responseMakers",
      ethereum.Value.fromUnsignedBigIntArray(responseMakers)
    )
  )

  return responseMakersUpdatedEvent
}

export function createRulesRootUpdatedEvent(
  impl: Address,
  ebc: Address,
  rootWithVersion: ethereum.Tuple
): RulesRootUpdated {
  let rulesRootUpdatedEvent = changetype<RulesRootUpdated>(newMockEvent())

  rulesRootUpdatedEvent.parameters = new Array()

  rulesRootUpdatedEvent.parameters.push(
    new ethereum.EventParam("impl", ethereum.Value.fromAddress(impl))
  )
  rulesRootUpdatedEvent.parameters.push(
    new ethereum.EventParam("ebc", ethereum.Value.fromAddress(ebc))
  )
  rulesRootUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "rootWithVersion",
      ethereum.Value.fromTuple(rootWithVersion)
    )
  )

  return rulesRootUpdatedEvent
}

export function createSpvUpdatedEvent(
  impl: Address,
  chainId: BigInt,
  spv: Address
): SpvUpdated {
  let spvUpdatedEvent = changetype<SpvUpdated>(newMockEvent())

  spvUpdatedEvent.parameters = new Array()

  spvUpdatedEvent.parameters.push(
    new ethereum.EventParam("impl", ethereum.Value.fromAddress(impl))
  )
  spvUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "chainId",
      ethereum.Value.fromUnsignedBigInt(chainId)
    )
  )
  spvUpdatedEvent.parameters.push(
    new ethereum.EventParam("spv", ethereum.Value.fromAddress(spv))
  )

  return spvUpdatedEvent
}
