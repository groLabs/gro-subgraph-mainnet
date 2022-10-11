import {
    MasterData,
    StakerData,
} from '../../generated/schema';
import {
    BigInt,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import { DECIMALS, ZERO, ONE } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import { setMasterData } from './masterdata';


const initStakerData = (
    poolId: i32,
): StakerData => {
    const id = poolId.toString();
    let staker = StakerData.load(id);
    if (!staker) {
        staker = new StakerData(id);
        staker.lp_supply = ZERO.plus(ONE).minus(ONE);  //**TODO: TESTING */
        staker.acc_gro_per_share = ZERO;
        staker.alloc_point = ZERO;
        staker.pool_share = ZERO;
    }
    return staker;
}

const updateTotalAlloc = (): BigDecimal => {
    let md = MasterData.load('0x');
    if (md) {
        md.total_alloc = ZERO
        for (let i = 0; i <= 6; i++) {
            let staker = StakerData.load(i.toString());
            if (staker) {
                md.total_alloc = md.total_alloc.plus(staker.alloc_point)
            }
        }
        md.save();
        return md.total_alloc;
    }
    return ZERO;
}

// @dev: from staker->LogUpdatePool()
export const updateStakerSupply = (
    poolId: BigInt,
    lpSupply: BigInt,
    accGroPerShare: BigInt,
): void => {
    const staker = initStakerData(poolId.toI32());
    staker.lp_supply = tokenToDecimal(lpSupply, 18, 7);
    staker.acc_gro_per_share = tokenToDecimal(accGroPerShare, 18, 12);
    staker.save();
}

// @dev: from staker->LogSetPool()
export const updateStakerAllocation = (
    poolId: BigInt,
    alloc_point: BigInt,
): void => {
    const staker = initStakerData(poolId.toI32());
    const allocPoint = alloc_point.toBigDecimal();
    staker.alloc_point = allocPoint
    staker.save();
    const totalAlloc = updateTotalAlloc();
    staker.pool_share = (totalAlloc.equals(ZERO)) 
        ? ZERO
        : allocPoint.div(totalAlloc).truncate(DECIMALS);
    staker.save();
}

export const updateStakerGroPerBlock = (
    gro_per_block: BigInt,
): void => {
    const md = setMasterData();
    const groPerBlock = tokenToDecimal(gro_per_block, 18, 7);
    md.gro_per_block = groPerBlock
    md.save();
}
