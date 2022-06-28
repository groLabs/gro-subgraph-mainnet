import {
  PwrdApproval as PwrdApprovalEvent,
  PwrdLogAddToWhitelist as PwrdLogAddToWhitelistEvent,
  PwrdLogRemoveFromWhitelist as PwrdLogRemoveFromWhitelistEvent,
  PwrdLogTransfer as PwrdLogTransferEvent,
  PwrdOwnershipTransferred as PwrdOwnershipTransferredEvent,
  PwrdTransfer as PwrdTransferEvent
} from "../generated/Pwrd/Pwrd"
import {
  PwrdApproval,
  PwrdLogAddToWhitelist,
  PwrdLogRemoveFromWhitelist,
  PwrdLogTransfer,
  PwrdOwnershipTransferred,
  PwrdTransfer
} from "../generated/schema"

export function handlePwrdApproval(event: PwrdApprovalEvent): void {
  let entity = new PwrdApproval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}

export function handlePwrdLogAddToWhitelist(
  event: PwrdLogAddToWhitelistEvent
): void {
  let entity = new PwrdLogAddToWhitelist(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.save()
}

export function handlePwrdLogRemoveFromWhitelist(
  event: PwrdLogRemoveFromWhitelistEvent
): void {
  let entity = new PwrdLogRemoveFromWhitelist(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.save()
}

export function handlePwrdLogTransfer(event: PwrdLogTransferEvent): void {
  let entity = new PwrdLogTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.sender = event.params.sender
  entity.recipient = event.params.recipient
  entity.amount = event.params.amount
  entity.save()
}

export function handlePwrdOwnershipTransferred(
  event: PwrdOwnershipTransferredEvent
): void {
  let entity = new PwrdOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handlePwrdTransfer(event: PwrdTransferEvent): void {
  let entity = new PwrdTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.save()
}
