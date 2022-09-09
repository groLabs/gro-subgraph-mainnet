import {
    ONE,
    ZERO,
    UNISWAPV2_GRO_USDC_ADDRESS,
    UNISWAPV2_USDC_WETH_ADDRESS,
} from '../utils/constants';
import {
    getUniV2Price,
    getPricePerShare,
} from '../utils/tokens';
import { Price } from '../../generated/schema';


const initPrice = (): Price => {
    let price = Price.load('0x');
    if (!price) {
        price = new Price('0x');
        price.pwrd = ONE;
        price.gvt = ZERO;
        price.gro = ZERO;
        price.weth = ZERO;
    }
    return price;
}

export const setGvtPrice = (): void => {
    let price = initPrice();
    price.gvt = getPricePerShare('gvt');
    price.save();
}

export const setGroPrice = (): void => {
    const groPrice = getUniV2Price(UNISWAPV2_GRO_USDC_ADDRESS);
    if (groPrice != ZERO) {
        let price = initPrice();
        price.gro = groPrice;
        price.save();
    }
}

export const setWethPrice = (): void => {
    const wethPrice = getUniV2Price(UNISWAPV2_USDC_WETH_ADDRESS);
    if (wethPrice != ZERO) {
        let price = initPrice();
        price.weth = wethPrice;
        price.save();
    }
}
