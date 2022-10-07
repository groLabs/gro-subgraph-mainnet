
import { PoolBalanceChanged } from '../../generated/BalancerGroWethVault/Vault';
import { 
    setWethPrice, 
    setBalancerGroWethPrice
} from '../setters/price';


// Not using if because there aren't balance changes in our poolId.
// if (event.params.poolId == BALANCER_GRO_WETH_POOLID) {}
export function handlePoolBalanceChanged(event: PoolBalanceChanged): void {
    setWethPrice();
    setBalancerGroWethPrice();
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
