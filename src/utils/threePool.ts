import { ThreePool } from "../../generated/GRouter/ThreePool"
import { ADDR } from '../utils/constants';
import { log, BigInt } from '@graphprotocol/graph-ts';


export function get3CrvVirtualPrice( tx: string):BigInt {
    const contract = ThreePool.bind(ADDR.THREE_POOL);
    const price = contract.try_get_virtual_price();
    if (price.reverted) {
        log.error('Get virtual price for 3crv on tx:{} failed', [tx]);
        return BigInt.zero();
    }
    return price.value;
}