import { BigInt } from "@graphprotocol/graph-ts"
import {
    LogDeposit as LogDepositEventV1
} from "../../generated/LpTokenStakerV1/LpTokenStaker"
import {
  // LPTokenStaker,
  // LogAddPool,
  // LogClaim,
  LogDeposit as LogDepositEventV2,
  // LogEmergencyWithdraw,
  // LogGroPerBlock,
  // LogLpTokenAdded,
  // LogMaxGroPerBlock,
  // LogMigrate,
  // LogMigrateFrom,
  // LogMigrateFromV1,
  // LogMigrateUser,
  // LogMultiClaim,
  // LogMultiWithdraw,
  // LogNewManagment,
  // LogNewPwrdPid,
  // LogNewStaker,
  // LogNewVester,
  // LogOldStaker,
  // LogSetPool,
  // LogSetStatus,
  // LogSetTimelock,
  // LogUpdatePool,
  // LogUserMigrateFromV1,
  // LogWithdraw,
  // OwnershipTransferred
} from "../../generated/LPTokenStakerV2/LPTokenStaker"

import {
  User,
  LogDeposit,
  Transaction
} from "../../generated/schema"

// export function handleLogAddPool(event: LogAddPool): void {

//   // It is also possible to access smart contracts from mappings. For
//   // example, the contract that has emitted the event can be connected to
//   // with:
//   //
//   // let contract = Contract.bind(event.address)
//   //
//   // The following functions can then be called on this contract to access
//   // state variables and other data:
//   //
//   // - contract.PWRD(...)
//   // - contract.TIME_LOCK(...)
//   // - contract.activeLpTokens(...)
//   // - contract.claimable(...)
//   // - contract.getUserPwrd(...)
//   // - contract.groPerBlock(...)
//   // - contract.initialized(...)
//   // - contract.manager(...)
//   // - contract.maxGroPerBlock(...)
//   // - contract.migratedFromV1(...)
//   // - contract.newStaker(...)
//   // - contract.oldStaker(...)
//   // - contract.owner(...)
//   // - contract.pPid(...)
//   // - contract.paused(...)
//   // - contract.poolInfo(...)
//   // - contract.poolLength(...)
//   // - contract.totalAllocPoint(...)
//   // - contract.updatePool(...)
//   // - contract.userInfo(...)
//   // - contract.userMigrated(...)
//   // - contract.vesting(...)
// }


function logDeposit<T> (event: T): void {

  // Step 1: store `LogDeposit` event
  let deposit = new LogDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  deposit.user = event.params.user
  deposit.pid = event.params.pid
  deposit.amount = event.params.amount
  deposit.save()

  // Step 2: create User if first deposit; load User otherwise
  let id = event.params.user.toHexString()
  let user = User.load(id)
  if (!user) {
    user = new User(
      event.params.user.toHexString()
    )
    user.txs = []
  }

  // Step 3: create transaction & add it to user
  // TODO: move to a function and reuse for every event type (deposit, withdrawal..)
  // TODO: function to determine token
  let tx = new Transaction(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  tx.userAddress = event.params.user
  tx.poolId = event.params.pid.toI32()
  tx.token = 'gro'
  tx.block = event.block.number.toI32()
  tx.timestamp = event.block.timestamp.toI32()
  tx.type = 'deposit'
  tx.coinAmount = event.params.amount
  tx.usdAmount = BigInt.fromI32(0)  // TODO
  tx.save()
  let txs = user.txs
  txs!.push(tx.id)
  user.txs = txs
  user.save()
}

export function handleLogDepositV1(event: LogDepositEventV1): void {

    logDeposit(event)
//   // Step 1: store `LogDeposit` event
//   let deposit = new LogDeposit(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   deposit.user = event.params.user
//   deposit.pid = event.params.pid
//   deposit.amount = event.params.amount
//   deposit.save()

//   // Step 2: create User if first deposit; load User otherwise
//   let id = event.params.user.toHexString()
//   let user = User.load(id)
//   if (!user) {
//     user = new User(
//       event.params.user.toHexString()
//     )
//     user.txs = []
//   }

//   // Step 3: create transaction & add it to user
//   // TODO: move to a function and reuse for every event type (deposit, withdrawal..)
//   // TODO: function to determine token
//   let tx = new Transaction(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   tx.userAddress = event.params.user
//   tx.poolId = event.params.pid.toI32()
//   tx.token = 'gro'
//   tx.block = event.block.number.toI32()
//   tx.timestamp = event.block.timestamp.toI32()
//   tx.type = 'deposit'
//   tx.coinAmount = event.params.amount
//   tx.usdAmount = BigInt.fromI32(0)  // TODO
//   tx.save()
//   let txs = user.txs
//   txs!.push(tx.id)
//   user.txs = txs
//   user.save()
}

export function handleLogDepositV2(event: LogDepositEventV2): void {
    logDeposit(event)
}

/*
export function handleLogClaim(event: LogClaim): void {}

export function handleLogEmergencyWithdraw(event: LogEmergencyWithdraw): void {}

export function handleLogGroPerBlock(event: LogGroPerBlock): void {}

export function handleLogLpTokenAdded(event: LogLpTokenAdded): void {}

export function handleLogMaxGroPerBlock(event: LogMaxGroPerBlock): void {}

export function handleLogMigrate(event: LogMigrate): void {}

export function handleLogMigrateFrom(event: LogMigrateFrom): void {}

export function handleLogMigrateFromV1(event: LogMigrateFromV1): void {}

export function handleLogMigrateUser(event: LogMigrateUser): void {}

export function handleLogMultiClaim(event: LogMultiClaim): void {}

export function handleLogMultiWithdraw(event: LogMultiWithdraw): void {}

export function handleLogNewManagment(event: LogNewManagment): void {}

export function handleLogNewPwrdPid(event: LogNewPwrdPid): void {}

export function handleLogNewStaker(event: LogNewStaker): void {}

export function handleLogNewVester(event: LogNewVester): void {}

export function handleLogOldStaker(event: LogOldStaker): void {}

export function handleLogSetPool(event: LogSetPool): void {}

export function handleLogSetStatus(event: LogSetStatus): void {}

export function handleLogSetTimelock(event: LogSetTimelock): void {}

export function handleLogUpdatePool(event: LogUpdatePool): void {}

export function handleLogUserMigrateFromV1(event: LogUserMigrateFromV1): void {}

export function handleLogWithdraw(event: LogWithdraw): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
*/
