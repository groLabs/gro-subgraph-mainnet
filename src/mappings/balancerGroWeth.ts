import { getTxData } from '../utils/tx';
import { tokenToDecimal } from '../utils/tokens';
import { setPoolSwap } from '../setters/poolSwaps';
import { setTotalSupply } from '../setters/coreData';
import { contracts as block } from '../../addresses';
import { balGroWethPoolAddress } from '../utils/contracts';
import { Transfer } from '../../generated/BalancerGroWethPool/ERC20';
import { PoolBalanceChanged } from '../../generated/BalancerGroWethVault/Vault';
import { WeightedPool as BalancerPool } from '../../generated/BalancerGroWethPool/WeightedPool';
import {
    setWethPrice,
    setBalancerGroWethPrice
} from '../setters/price';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import {
    log,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';


export function handlePoolBalanceChanged(event: PoolBalanceChanged): void {
    setWethPrice();
    setBalancerGroWethPrice(getTxData(event));
}

export function handleTransfer(event: Transfer): void {
    setWethPrice();
    setBalancerGroWethPrice(getTxData(event));
    setTotalSupply(
        event.params.from,
        event.params.to,
        event.params.value,
        'balancer_gro_weth',
    );
}

// @dev: creates an 'artificial swap' if the time is at 00:XX UTC. Since this function
//       is called every hour, it will only store the swap when it's midnight
export function handleBalancerSwap(
    _now: i32,
    blockNumber: i32,
): void {
    const now = new Date(_now * 1000);
    const balancerPoolStartBlock = block.BalancerGroWethPoolStartBlock;
    if (
        now.getUTCHours() === 0
        && blockNumber >= balancerPoolStartBlock
    ) {
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

