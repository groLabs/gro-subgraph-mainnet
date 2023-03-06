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
    LOG_DEPOSIT_STAKER_SIG,
    LOG_WITHDRAW_STAKER_SIG,
} from '../utils/constants';


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

// @dev: When there is a deposit/withdrawal in the lpTokenStaker, 
// the LogUpdatePool event gives the total supply of that pool BEFORE
// the deposit/withdrawal -> this needs to be added/deducted from the 
// total supply within the LogUpdatePool event.
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

// @dev: from staker->LogUpdatePool()
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
    staker.lp_supply = tokenToDecimal(lpSupply, 18, 12).plus(amount).truncate(12);
    staker.acc_gro_per_share = tokenToDecimal(accGroPerShare, 12, 12);
    staker.block_number = blockNumber.toI32();
    staker.block_timestamp = blockTimestamp.toI32();
    staker.save();
}

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

export const updateStakerGroPerBlock = (
    gro_per_block: BigInt,
): void => {
    const md = initMD();
    const groPerBlock = tokenToDecimal(gro_per_block, 18, DECIMALS);
    md.gro_per_block = groPerBlock
    md.save();
}

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
        ? 'multiclaim'
        : 'claim';
    tx.user_address = ev.userAddress;
    tx.pool_id = ev.pid;
    tx.vest = ev.vest;
    tx.amount = coinAmount;
    tx.save();
    return tx;
}
