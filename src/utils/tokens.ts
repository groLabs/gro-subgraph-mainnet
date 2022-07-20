import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

const getTokenFromPoolId = (poolId: i32, type: string): string => {
    if (type == 'claim') return 'gro'
    switch (poolId) {
        case 0:
            return 'gro';
        case 1:
            return 'uniswap_gvt_gro'
        case 2:
            return 'uniswap_gro_usdc'
        case 3:
            return 'gvt'
        case 4:
            return 'curve_pwrd3crv'
        case 5:
            return 'balancer_gro_weth'
        case 6:
            return 'pwrd'
        default:
            return 'unknown';
    }
}

const tokenToDecimal = (amount: BigInt, decimals: i32): BigDecimal => {
    let scale = BigInt.fromI32(10)
        .pow(decimals as u8)
        .toBigDecimal();
    return amount.toBigDecimal().div(scale);
}

export {
    getTokenFromPoolId,
    tokenToDecimal,
}
