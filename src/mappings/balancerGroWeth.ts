import { getTxData } from '../utils/tx';
import { tokenToDecimal } from '../utils/tokens';
import { setPoolSwap } from '../setters/poolSwaps';
import { setTotalSupply } from '../setters/coreData';
import { balGroWethPoolAddress } from '../utils/contracts';
import { Transfer } from '../../generated/BalancerGroWethPool/ERC20';
import { AuthorizerChanged } from '../../generated/BalancerGroWethVault/Vault';
import { WeightedPool as BalancerPool } from '../../generated/BalancerGroWethPool/WeightedPool';
import { setBalancerGroWethPrice } from '../setters/price';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import {
    log,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';


export function handleAuthorizerChanged(event: AuthorizerChanged): void {
    // do nothing ;)
}

export function handleTransfer(event: Transfer): void {
    setBalancerGroWethPrice(getTxData(event));
    setTotalSupply(
        event.params.from,
        event.params.to,
        event.params.value,
        'balancer_gro_weth',
    );
}

// @dev: 
// - creates an 'artificial swap' if the time is at 00:XX UTC. Since this function
//   is called every hour, it will only store the swap once a day (midnight)
// - this is done because real swaps only happen in the Balancer Vault, shared by other
//   projects with hundreds of swaps a day (not feasible for the subgraph), so it's
//   not feasible to listen for Vault swaps
export function handleBalancerSwap(
    _now: i32,
    blockNumber: i32,
): void {
    const now = new Date(_now * 1000);
    if (now.getUTCHours() === 0) {
        setPoolSwap(
            _now.toString() + '-5',
            5,
            _now,
            blockNumber,
            Address.zero(),
            NUM.ZERO,
            NUM.ZERO,
            NUM.ZERO,
            NUM.ZERO,
            Address.zero(),
            getVirtualPrice(),
        );
    }
}

const getVirtualPrice = (): BigDecimal => {
    const contract = BalancerPool.bind(balGroWethPoolAddress);
    const virtualPrice = contract.try_getRate();
    if (virtualPrice.reverted) {
        log.error('getVirtualPrice(): try_getRate() reverted in /mappings/balancerGroWeth.ts', []);
    } else {
        return tokenToDecimal(virtualPrice.value, 18, DECIMALS);
    }
    return NUM.ZERO;
}
