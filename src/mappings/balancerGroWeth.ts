
import { PoolBalanceChanged, Swap } from '../../generated/BalancerGroWethVault/Vault';
import { Transfer } from '../../generated/BalancerGroWethPool/WeightedPool';
import { setBalancerGroWethPrice } from '../setters/price';
import { BALANCER_GRO_WETH_POOLID } from '../utils/constants';



import {
    log
} from '@graphprotocol/graph-ts';

// Not using if because there aren't balance changes in our poolId.
// if (event.params.poolId == BALANCER_GRO_WETH_POOLID) {}
export function handlePoolBalanceChanged(event: PoolBalanceChanged): void {

    //TODO: update weth price (and usdc)
    setBalancerGroWethPrice();
    log.error('** handlePoolBalanceChanged INSIDE params {} POOLID {}',
        [
            event.params.poolId.toHexString(),
            BALANCER_GRO_WETH_POOLID.toHexString()
        ]);
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

export function handleTransfer(event: Transfer): void {
    setBalancerGroWethPrice();
}