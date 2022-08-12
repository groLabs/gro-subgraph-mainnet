import { Price } from '../../generated/schema';
import {
    DECIMALS,
    GVT_ADDRESS,
    UNISWAPV2_GRO_USDC_ADDRESS,
    UNISWAPV2_USDC_WETH_ADDRESS,
} from '../utils/constants';
import {
    tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';
import {
    BigDecimal,
    log
} from '@graphprotocol/graph-ts';
import { UniswapV2GroUsdc } from '../../generated/UniswapV2GroUsdc/UniswapV2GroUsdc';
import { UniswapV2UsdcWeth } from '../../generated/UniswapV2UsdcWeth/UniswapV2UsdcWeth';


const initPrice = (): Price => {
    let price = Price.load('0x');
    if (!price) {
        price = new Price('0x');
        price.pwrd = BigDecimal.fromString('1');
        price.gvt = BigDecimal.fromString('0');
        price.gro = BigDecimal.fromString('0');
        price.weth = BigDecimal.fromString('0');
    }
    return price;
}

export const setGvtPrice = (): void => {
    let price = initPrice();
    price.gvt = getPricePerShare(
        GVT_ADDRESS,
        'gvt'
    );
    price.save();
}

export const setGroPrice = (): void => {
    let price = initPrice();
    const contract = UniswapV2GroUsdc.bind(UNISWAPV2_GRO_USDC_ADDRESS);
    const reserves = contract.try_getReserves();
    if (reserves.reverted) {
        log.info('setGroPrice() reverted in src/setters/price.ts', []);
    } else {
        const gvt_reserve = reserves.value.get_reserve0();
        const usdc_reserve = reserves.value.get_reserve1();
        const gro_price_usdc = tokenToDecimal(usdc_reserve, 6, 7).div(tokenToDecimal(gvt_reserve, 18, 7)).truncate(DECIMALS);
        // TODO: chainlink to calc the USD price of USDC.
        price.gro = gro_price_usdc;
        price.save();
    }
}

export const setWethPrice = (): void => {
    let price = initPrice();
    const contract = UniswapV2UsdcWeth.bind(UNISWAPV2_USDC_WETH_ADDRESS);
    const reserves = contract.try_getReserves();
    if (reserves.reverted) {
        log.info('setGroPrice() reverted in src/setters/price.ts', []);
    } else {
        const usdc_reserve = reserves.value.get_reserve0();
        const weth_reserve = reserves.value.get_reserve1();
        const weth_price_usdc = tokenToDecimal(usdc_reserve, 6, 7).div(tokenToDecimal(weth_reserve, 18, 7)).truncate(DECIMALS);
        // TODO: chainlink to calc the USD price of USDC.
        price.weth = weth_price_usdc;
        price.save();
    }
}