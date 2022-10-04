import { Price } from '../../generated/schema';
import { Address } from '@graphprotocol/graph-ts';
import {
    ONE,
    ZERO,
    UNISWAPV2_GRO_USDC_ADDRESS,
    UNISWAPV2_USDC_WETH_ADDRESS,
} from '../utils/constants';
import { getPricePerShare } from '../utils/tokens';
import { getUniV2Price } from '../utils/pool'


const initPrice = (): Price => {
    let price = Price.load('0x');
    if (!price) {
        price = new Price('0x');
        price.pwrd = ONE;
        price.gvt = ZERO;
        price.gro = ZERO;
        price.weth = ZERO;
        price.balancer_gro_weth = ZERO;
        price.uniswap_gvt_gro = ZERO;
        price.uniswap_gro_usdc = ZERO;
        price.curve_pwrd3crv = ZERO;
    }
    return price;
}

// Triggered by PnLExecution events
export const setGvtPrice = (): void => {
    let price = initPrice();
    price.gvt = getPricePerShare('gvt');
    price.save();
}

// Triggered by UniswapV2 Gro-Usdc swap events
export const setGroPrice = (contractAddress: Address): void => {
    // const groPrice = getUniV2Price(UNISWAPV2_GRO_USDC_ADDRESS);
    const groPrice = getUniV2Price(contractAddress, true);
    if (groPrice != ZERO) {
        let price = initPrice();
        price.gro = groPrice;
        price.save();
    }
}

// Triggered by UniswapV2 Gro-Usdc swap events
export const setWethPrice = (): void => {
    const wethPrice = getUniV2Price(UNISWAPV2_USDC_WETH_ADDRESS, true);
    if (wethPrice != ZERO) {
        let price = initPrice();
        price.weth = wethPrice;
        price.save();
    }
}
