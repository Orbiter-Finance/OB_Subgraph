import { Bytes } from "@graphprotocol/graph-ts"
import {
  ChallengeInfoUpdated as ChallengeInfoUpdatedEvent,
  ColumnArrayUpdated as ColumnArrayUpdatedEvent,
  ResponseMakersUpdated as ResponseMakersUpdatedEvent,
  RulesRootUpdated as RulesRootUpdatedEvent,
  SpvUpdated as SpvUpdatedEvent,
  WithdrawRequested as WithdrawRequestedEvent
} from "../types/templates/MDC/MDC"
import {
  handleChallengeInfoUpdatedEvent,
  handleColumnArrayUpdatedEvent,
  handleResponseMakersUpdatedEvent,
  handleSpvUpdatedEvent,
  handleWithdrawRequestedEvent,
  handleupdateRulesRootEvent
} from "./mdc-core"

export function handleChallengeInfoUpdated(
  event: ChallengeInfoUpdatedEvent
): void {
  handleChallengeInfoUpdatedEvent(
    event,
    event.params.challengeId.toHexString(),
    event.params.statement.sourceTxFrom,
    event.params.statement.sourceTxTime,
    event.params.statement.freezeToken.toHexString(),
    event.params.statement.challengeUserRatio,
    event.params.statement.freezeAmount0,
    event.params.statement.freezeAmount1,
    event.params.statement.challengeTime,
    event.params.statement.abortTime,
    event.params.statement.sourceTxBlockNum,
    event.params.statement.sourceTxIndex,
    event.params.statement.challengerVerifyTransactionFee,
    event.params.result.winner.toHexString(),
    event.params.result.verifiedTime0,
    event.params.result.verifiedTime1,
    event.params.result.verifiedDataHash0.toHexString(),
  )
}

export function handleColumnArrayUpdated(event: ColumnArrayUpdatedEvent): void {
  handleColumnArrayUpdatedEvent(
    event,
    event.params.impl,
    event.params.columnArrayHash,
    event.params.dealers,
    event.params.ebcs,
    event.params.chainIds
  )
}

export function handleResponseMakersUpdated(
  event: ResponseMakersUpdatedEvent
): void {
  handleResponseMakersUpdatedEvent(
    event,
    event.params.impl,
    event.params.responseMakers
  )
}

export function handleRulesRootUpdated(event: RulesRootUpdatedEvent): void {
  handleupdateRulesRootEvent(
    event,
    event.params.impl,
    event.params.ebc,
    event.params.rootWithVersion.root,
    event.params.rootWithVersion.version
  )
}

export function handleSpvUpdated(event: SpvUpdatedEvent): void {
  handleSpvUpdatedEvent(
    event,
    event.params.impl,
    event.params.chainId,
    event.params.spv
  )
}

export function handleWithdrawRequested(event: WithdrawRequestedEvent): void {
  handleWithdrawRequestedEvent(
    event,
    event.params.requestAmount,
    event.params.requestTimestamp,
    event.params.requestToken.toHexString()
  )

}
