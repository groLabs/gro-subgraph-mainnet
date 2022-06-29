/*
import {
  Approval as ApprovalEvent,
  LogDistributer as LogDistributerEvent,
  LogInflationRate as LogInflationRateEvent,
  GroOwnershipTransferred as GroOwnershipTransferredEvent,
  Transfer as TransferEvent
} from "../generated/Gro/Gro"
import {
  Approval,
  LogDistributer,
  LogInflationRate,
  GroOwnershipTransferred,
  Transfer
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}

export function handleLogDistributer(event: LogDistributerEvent): void {
  let entity = new LogDistributer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.newDistributer = event.params.newDistributer
  entity.save()
}

export function handleLogInflationRate(event: LogInflationRateEvent): void {
  let entity = new LogInflationRate(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.newInflationRate = event.params.newInflationRate
  entity.newInflationPerSecond = event.params.newInflationPerSecond
  entity.lastMaxTotalSupply = event.params.lastMaxTotalSupply
  entity.lastMaxTotalSupplyTime = event.params.lastMaxTotalSupplyTime
  entity.save()
}

export function handleGroOwnershipTransferred(
  event: GroOwnershipTransferredEvent
): void {
  let entity = new GroOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.save()
}
*/