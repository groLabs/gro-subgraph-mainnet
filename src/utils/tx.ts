// @ts-nocheck
import { Tx } from '../types/tx';


/// @return transaction data in a structured way
/// @dev only used for Balancer pool to show descriptive logs
export function getTxData<T>(ev: T): Tx {
    const tx = new Tx(
        'on hash {}, block {}, timestamp {} contract {}',
        [
            ev.transaction.hash.toHexString(),
            ev.block.number.toString(),
            ev.block.timestamp.toString(),
            ev.address.toHexString(),
        ],
        ev.block.number.toI32(),
    )
    return tx;
}
