import {
  GvtApproval as GvtApprovalEvent,
  LogAddToWhitelist as LogAddToWhitelistEvent,
  LogRemoveFromWhitelist as LogRemoveFromWhitelistEvent,
  LogTransfer as LogTransferEvent,
  GvtOwnershipTransferred as GvtOwnershipTransferredEvent,
  GvtTransfer as GvtTransferEvent
} from "../generated/Gvt/Gvt"
import {
  GvtApproval,
  LogAddToWhitelist,
  LogRemoveFromWhitelist,
  LogTransfer,
  GvtOwnershipTransferred,
  GvtTransfer
} from "../generated/schema"

export function handleGvtApproval(event: GvtApprovalEvent): void {
  let entity = new GvtApproval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}

export function handleLogAddToWhitelist(event: LogAddToWhitelistEvent): void {
  let entity = new LogAddToWhitelist(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.save()
}

export function handleLogRemoveFromWhitelist(
  event: LogRemoveFromWhitelistEvent
): void {
  let entity = new LogRemoveFromWhitelist(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.save()
}

export function handleLogTransfer(event: LogTransferEvent): void {
  let entity = new LogTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.sender = event.params.sender
  entity.recipient = event.params.recipient
  entity.amount = event.params.amount
  entity.factor = event.params.factor
  entity.save()
}

export function handleGvtOwnershipTransferred(
  event: GvtOwnershipTransferredEvent
): void {
  let entity = new GvtOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleGvtTransfer(event: GvtTransferEvent): void {
  let entity = new GvtTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.save()
}
