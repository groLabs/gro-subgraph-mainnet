import { ThreePool } from "../../generated/GRouter/ThreePool"
import { ADDR,NUM } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import { log, BigDecimal } from '@graphprotocol/graph-ts';


export function get3CrvVirtualPrice( tx: string):BigDecimal {
    const contract = ThreePool.bind(ADDR.THREE_POOL);
    const price = contract.try_get_virtual_price();
    if (price.reverted) {
        log.error('Get virtual price for 3crv on tx:{} failed', [tx]);
        return NUM.ZERO;
    }
    return tokenToDecimal(price.value, 18, 7);
}