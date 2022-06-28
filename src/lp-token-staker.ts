import { BigInt } from "@graphprotocol/graph-ts"
import {
  LPTokenStaker,
  LogAddPool,
  LogClaim,
  LogDeposit,
  LogEmergencyWithdraw,
  LogGroPerBlock,
  LogLpTokenAdded,
  LogMaxGroPerBlock,
  LogMigrate,
  LogMigrateFrom,
  LogMigrateFromV1,
  LogMigrateUser,
  LogMultiClaim,
  LogMultiWithdraw,
  LogNewManagment,
  LogNewPwrdPid,
  LogNewStaker,
  LogNewVester,
  LogOldStaker,
  LogSetPool,
  LogSetStatus,
  LogSetTimelock,
  LogUpdatePool,
  LogUserMigrateFromV1,
  LogWithdraw,
  OwnershipTransferred
} from "../generated/LPTokenStaker/LPTokenStaker"
import { ExampleEntity } from "../generated/schema"

export function handleLogAddPool(event: LogAddPool): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.pid = event.params.pid
  entity.allocPoint = event.params.allocPoint

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.PWRD(...)
  // - contract.TIME_LOCK(...)
  // - contract.activeLpTokens(...)
  // - contract.claimable(...)
  // - contract.getUserPwrd(...)
  // - contract.groPerBlock(...)
  // - contract.initialized(...)
  // - contract.manager(...)
  // - contract.maxGroPerBlock(...)
  // - contract.migratedFromV1(...)
  // - contract.newStaker(...)
  // - contract.oldStaker(...)
  // - contract.owner(...)
  // - contract.pPid(...)
  // - contract.paused(...)
  // - contract.poolInfo(...)
  // - contract.poolLength(...)
  // - contract.totalAllocPoint(...)
  // - contract.updatePool(...)
  // - contract.userInfo(...)
  // - contract.userMigrated(...)
  // - contract.vesting(...)
}

export function handleLogClaim(event: LogClaim): void {}

export function handleLogDeposit(event: LogDeposit): void {}

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
