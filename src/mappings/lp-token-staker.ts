import { BigInt } from "@graphprotocol/graph-ts"
import {
  LogClaim as LogClaimEventV1,
  LogDeposit as LogDepositEventV1,
  LogWithdraw as LogWithdrawEventV1,
} from "../../generated/LpTokenStakerV1/LpTokenStaker"
import {
  LogClaim as LogClaimEventV2,
  LogDeposit as LogDepositEventV2,
  LogWithdraw as LogWithdrawEventV2,
} from "../../generated/LPTokenStakerV2/LPTokenStaker"
import {
  User,
  PoolTx
} from "../../generated/schema"
import { getTokenFromPoolId } from "../utils/tokens"

/* *** REMARKS MVP ***
Staker.LogMultiWithdraw: no events found, so currently not used
Staker.LogEmergencyWithdraw: event generates no data, so currently excluded
Staker.LogMultiClaim: excluded for MVP (requires amount calculation per pool in block-1 via sc calls)
Staker.LogClaim: field 'vest' excluded from MVP
*/

function parseEvent<T>(event: T, type: string): void {
//function parseEvent(event: LogDepositEventV1, type: string): void {

  // Step 1: create User if first transaction; load User otherwise
  let id = event.params.user.toHexString()
  let user = User.load(id)
  if (!user) {
    user = new User(
      event.params.user.toHexString()
    )
    user.save()
  }

  // Step 2: create transaction & add it to user
  let tx = new PoolTx(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  tx.userAddress = event.params.user.toHexString();
  tx.contractAddress = event.address
  tx.poolId = event.params.pid.toI32()
  tx.token = getTokenFromPoolId(tx.poolId, type)
  tx.block = event.block.number.toI32()
  tx.timestamp = event.block.timestamp.toI32()
  tx.type = type
  tx.coinAmount = event.params.amount
  // tx.usdAmount = BigInt.fromI32(0)
  tx.save()
}

export function handleLogDepositV1(event: LogDepositEventV1): void {
  parseEvent(event, 'deposit')
}

export function handleLogDepositV2(event: LogDepositEventV2): void {
  parseEvent(event, 'deposit')
}

export function handleLogWithdrawV1(event: LogWithdrawEventV1): void {
  parseEvent(event, 'withdrawal')
}

export function handleLogWithdrawV2(event: LogWithdrawEventV2): void {
  parseEvent(event, 'withdrawal')
}

export function handleLogClaimV1(event: LogClaimEventV1): void {
  parseEvent(event, 'claim')
}

export function handleLogClaimV2(event: LogClaimEventV2): void {
  parseEvent(event, 'claim')
}


/*
export function handleLogAddPool(event: LogAddPool): void {

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