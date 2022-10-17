import {
    MasterData,
    StakerData,
} from '../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';
import {
    NUM,
    DECIMALS
} from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import { initMD } from './masterdata';


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

// @dev: from staker->LogUpdatePool()
export const updateStakerSupply = (
    poolId: BigInt,
    lpSupply: BigInt,
    accGroPerShare: BigInt,
    blockNumber: BigInt,
    blockTimestamp: BigInt,
): void => {
    const staker = initStakerData(poolId.toI32());
    staker.lp_supply = tokenToDecimal(lpSupply, 18, 7);
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
    for (let i = 0; i <= 6; i++) {
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
    for (let i = 0; i <= 6; i++) {
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
    const groPerBlock = tokenToDecimal(gro_per_block, 18, 7);
    md.gro_per_block = groPerBlock
    md.save();
}
