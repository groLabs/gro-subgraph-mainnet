// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice
///     - Initialises entity <StakerData> and updates LP supply, acc gro per share,
///       allocation point, pool share and block number/timestamp in entity <StakerData>
///     - Updates total allocation and gro per block in entity <MasterData>
///     - Stores claims in entity <StakerClaimTx>

import { Log } from '../types/log';
import { initMD } from './masterdata';
import { tokenToDecimal } from '../utils/tokens';
import { StakerClaimEvent } from '../types/stakerClaim';
import {
    StakerData,
    StakerClaimTx,
} from '../../generated/schema';
import {
    BigInt,
    ethereum,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    NUM,
    DECIMALS,
    NUM_POOLS,
    STAKER_ADDRESSES,
    TX_TYPE as TxType,
    LOG_DEPOSIT_STAKER_SIG,
    LOG_WITHDRAW_STAKER_SIG,
} from '../utils/constants';


/// @notice Initialises entity <StakerData> with default values if not created yet
/// @param poolId the pool identifier
/// @return StakerData object for a given poolId
const initStakerData = (
    poolId: i32,
): StakerData => {
    const id = poolId.toString();
    let staker = StakerData.load(id);
    if (!staker) {
        staker = new StakerData(id);
        staker.lp_supply = NUM.ZERO;
        staker.acc_gro_per_share = NUM.ZERO;
        staker.alloc_point = NUM.ZERO;
        staker.pool_share = NUM.ZERO;
        staker.block_number = 0;
        staker.block_timestamp = 0;
    }
    return staker;
}

/// @notice Retrieves the coin amount from a <Transfer> event within a staker deposit
///         or withdrawal transaction
/// @dev - When there is a deposit/withdrawal in the Staker, the <LogUpdatePool> event
///        gives the total supply of that pool BEFORE the deposit/withdrawal: this needs
///        to be added/deducted from the LogUpdatePool's total supply
///      - Triggered by <LogUpdatePool> event from Staker contract
///      - <LogUpdatePool> events are automatically triggered after every <LogDeposit>,
///        <LogWithdraw>, <LogEmergencyWithdraw>, <LogClaim>, <LogMultiClaim>
/// @param logs the logs from the staker deposit or withdrawal transaction 
/// @return the transfer amount of a staker deposit or withdrawal:
///         - positive amount if deposit (will be then added to LP supply)
///         - negative amount if withdrawal (will be then deducted from LP supply)
const getTransferFromUpdatePool = (
    logs: Log[]
): BigDecimal => {
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if (
            STAKER_ADDRESSES.includes(log.address)
            && (log.topics[0].toHexString() == LOG_WITHDRAW_STAKER_SIG
                || log.topics[0].toHexString() == LOG_DEPOSIT_STAKER_SIG)
            && log.topics.length === 3
        ) {
            const value = ethereum.decode('uin256', log.data)!.toBigInt();
            const result = (log.topics[0].toHexString() == LOG_WITHDRAW_STAKER_SIG)
                ? tokenToDecimal(value, 18, 12).times(NUM.MINUS_ONE)
                : tokenToDecimal(value, 18, 12);
            return result;
        }
    }
    return NUM.ZERO;
}

/// @notice Updates the LP supply, accrued gro per share, block number and
///         block timestamp in entity <StakerData>
/// @dev Triggered by <LogUpdatePool> event from Staker contract
/// @param poolId the pool identifier
/// @param lpSupply the LP supply
/// @param accGroPerShare the accrued gro per share
/// @param blockNumber the block number
/// @param blockTimestamp the block timestamp
/// @param logs the logs from a LogUpdatePool transaction
export const updateStakerSupply = (
    poolId: BigInt,
    lpSupply: BigInt,
    accGroPerShare: BigInt,
    blockNumber: BigInt,
    blockTimestamp: BigInt,
    logs: Log[],
): void => {
    const staker = initStakerData(poolId.toI32());
    const amount = getTransferFromUpdatePool(logs);
    staker.lp_supply = tokenToDecimal(lpSupply, 18, 12)
        .plus(amount)
        .truncate(12);
    staker.acc_gro_per_share = tokenToDecimal(accGroPerShare, 12, 12);
    staker.block_number = blockNumber.toI32();
    staker.block_timestamp = blockTimestamp.toI32();
    staker.save();
}

/// @notice Updates the pool allocation in entity <StakerData> for a given
///         pool and the total allocation in entity <MasterData>
/// @dev Triggered by events <LogAddPool> & <LogSetPool> from Staker contract
/// @param _poolId the pool identifier to be updated
/// @param alloc_point the allocation point
export const updateStakerAllocation = (
    _poolId: BigInt,
    alloc_point: BigInt,
): void => {
    let poolId = _poolId.toI32();
    let allocPoint = alloc_point.toBigDecimal();
    let totalAlloc = NUM.ZERO;
    let staker: StakerData[] = [];
    // update alloc_point on target pool & calc the totalAlloc
    for (let i = 0; i < NUM_POOLS; i++) {
        staker[i] = initStakerData(i);
        if (i === poolId) {
            staker[i].alloc_point = allocPoint;
            totalAlloc = totalAlloc.plus(allocPoint);
        } else {
            totalAlloc = totalAlloc.plus(staker[i].alloc_point);
        }
    }
    // update total_alloc in MD 
    let md = initMD();
    md.total_alloc = totalAlloc;
    md.save();
    // update pool_share on each pool
    for (let i = 0; i < NUM_POOLS; i++) {
        staker[i].pool_share = (totalAlloc.equals(NUM.ZERO))
            ? NUM.ZERO
            : staker[i].alloc_point.div(totalAlloc).truncate(DECIMALS);
        staker[i].save();
    }
}

/// @notice Updates the gro per block in entity <MasterData>
/// @dev Triggered by event <LogGroPerBlock> from staker contract
/// @param gro_per_block the gro amount per block
export const updateStakerGroPerBlock = (
    gro_per_block: BigInt,
): void => {
    const md = initMD();
    const groPerBlock = tokenToDecimal(gro_per_block, 18, DECIMALS);
    md.gro_per_block = groPerBlock;
    md.save();
}

/// @notice Stores staker claims & multi-claims in entity <StakerClaimTx>
/// @dev Triggered by <LogClaim> & <LogMultiClaim> from staker contract
/// @param ev the parsed claim event
/// @return claim object from entity <StakerClaimTx>
export const setClaimTx = (
    ev: StakerClaimEvent,
): StakerClaimTx => {
    let tx = new StakerClaimTx(ev.id);
    const coinAmount = tokenToDecimal(ev.amount, 18, DECIMALS);
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block;
    tx.block_timestamp = ev.timestamp;
    tx.hash = ev.hash;
    tx.type = (ev.pid.length > 1)
        ? TxType.MULTICLAIM
        : TxType.CLAIM;
    tx.user_address = ev.userAddress;
    tx.pool_id = ev.pid;
    tx.vest = ev.vest;
    tx.amount = coinAmount;
    tx.save();
    return tx;
}
