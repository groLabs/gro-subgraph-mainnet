import { getTxData } from '../utils/tx';
import { tokenToDecimal } from '../utils/tokens';
import { setPoolSwap } from '../setters/poolSwaps';
import { Transfer } from '../../generated/BalancerGroWethPool/ERC20';
import { PoolBalanceChanged } from '../../generated/BalancerGroWethVault/Vault';
import { WeightedPool as BalancerPool } from '../../generated/BalancerGroWethPool/WeightedPool';
import {
    setWethPrice,
    setBalancerGroWethPrice
} from '../setters/price';
import {
    NUM,
    ADDR,
    DECIMALS,
} from '../utils/constants';
import {
    log,
    BigDecimal,
} from '@graphprotocol/graph-ts';


export function handlePoolBalanceChanged(event: PoolBalanceChanged): void {
    setWethPrice();
    setBalancerGroWethPrice(getTxData(event));
}

export function handleTransfer(event: Transfer): void {
    setWethPrice();
    setBalancerGroWethPrice(getTxData(event));
}

export function handleBalancerSwap(
    _now: i32,
): void {
    const now = new Date(_now * 1000);
    if (now.getUTCHours() === 0) {
        log.error('update!!!', []);
        setPoolSwap(
            _now.toString() + '-5',
            5,
            _now,
            ADDR.ZERO,
            NUM.ZERO,
            NUM.ZERO,
            NUM.ZERO,
            NUM.ZERO,
            ADDR.ZERO,
            getVirtualPrice(),
        );
    }
}

const getVirtualPrice = (): BigDecimal => {
    const contract = BalancerPool.bind(ADDR.BALANCER_GRO_WETH_POOL);
    const virtualPrice = contract.try_getRate();
    if (virtualPrice.reverted) {
        log.error('getVirtualPrice() reverted in src/mappings/balancerGroWeth.ts', []);
    } else {
        return tokenToDecimal(virtualPrice.value, 18, DECIMALS);
    }
    return NUM.ZERO;
}

// Way too many swaps -> not feasible
// export function handleSwap(event: Swap): void {
//     if (event.params.poolId == BALANCER_GRO_WETH_POOLID) {
//         setBalancerGroWethPrice();
//         log.error('** handlePoolBalanceChanged INSIDE {}', [event.params.poolId.toHexString()]);
//     } else {
//         //log.error('** handlePoolBalanceChanged OUTSIDE {}', [event.params.poolId.toString()]);
//     }
// }
