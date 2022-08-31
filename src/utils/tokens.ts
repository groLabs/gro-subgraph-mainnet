import {
    Address,
    BigDecimal,
    BigInt,
    log,
} from '@graphprotocol/graph-ts';
import { Gvt } from '../../generated/Gvt/Gvt';
import {
    ZERO,
    ONE,
} from '../utils/constants';


const getPricePerShare = (
    contractAddress: Address,
    token: string,
): BigDecimal => {
    // log.info('hheeoo contractAddress: {}', [contractAddress.toHexString()])
    let price: BigDecimal;
    if (token === 'gvt') {
        const contract = Gvt.bind(contractAddress);
        const pricePerShare = contract.try_getPricePerShare();
        if (pricePerShare.reverted) {
            log.info('getPricePerShare() reverted in src/utils/tokens.ts', []);
            price = ZERO;
        } else {
            price = tokenToDecimal(pricePerShare.value, 18, 7);
        }
    } else if (token === 'pwrd') {
        price = ONE;
    } else {
        price = ZERO;
    }
    return price;
}

const getTokenFromPoolId = (
    poolId: i32,
    type: string
): string => {
    if (type == 'claim') return 'gro'
    switch (poolId) {
        case 0:
            return 'gro';
        case 1:
            return 'uniswap_gvt_gro';
        case 2:
            return 'uniswap_gro_usdc';
        case 3:
            return 'gvt';
        case 4:
            return 'curve_pwrd3crv';
        case 5:
            return 'balancer_gro_weth';
        case 6:
            return 'pwrd';
        default:
            return 'unknown';
    }
}

// Converts a BigInt into a N-decimal BigDecimal
function tokenToDecimal(
    amount: BigInt,
    precision: i32,
    decimals: i32,
): BigDecimal {
    const scale = BigInt.fromI32(10)
        .pow(precision as u8)
        .toBigDecimal();
    return amount.toBigDecimal()
        .div(scale)
        .truncate(decimals);
}

export {
    getPricePerShare,
    getTokenFromPoolId,
    tokenToDecimal,
}
