import { Price } from '../../generated/schema';
import { GVT_ADDRESS } from '../utils/constants';
import {
    // tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';
import { BigDecimal, BigInt, Address } from '@graphprotocol/graph-ts';

const initPrice = (): Price => {
    let price = Price.load('0x');

    if (!price) {
        price = new Price('0x');
        price.pwrd = BigDecimal.fromString('0');
        price.gvt = BigDecimal.fromString('0');
        price.gro = BigDecimal.fromString('0');
        price.weth = BigDecimal.fromString('0');
    }
    
    return price;
}

export const setGvtPrice = (
): void => {
    let price = initPrice();

    price.gvt = getPricePerShare(
        GVT_ADDRESS,
        'gvt'
    );

    price.save();
}
