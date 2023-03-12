import { getFactor } from '../setters/factors';
import { Bytes } from '@graphprotocol/graph-ts';
import { TransferEvent } from '../types/transfer';
import { TransferTx } from '../../generated/schema';
import {
    NO_POOL,
    DECIMALS,
    TX_TYPE as TxType,
} from '../utils/constants';
import {
    tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';


export const setTransferTx = (
    ev: TransferEvent,
    userAddress: Bytes,
    type: string,
    token: string,
): TransferTx => {
    const transfer_tag = (type == TxType.TRANSFER_IN)
        ? 0
        : (type == TxType.TRANSFER_OUT)
            ? 1
            : 2;
    const id = ev.id.concatI32(transfer_tag);  
    let tx = new TransferTx(id);
    const coinAmount = tokenToDecimal(ev.value, 18, DECIMALS);
    const pricePerShare = getPricePerShare(token);
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block.toI32();
    tx.block_timestamp = ev.timestamp.toI32();
    tx.token = token;
    tx.type = type;
    tx.hash = ev.hash;
    tx.user_address = userAddress;
    tx.from_address = ev.fromAddress;
    tx.to_address = ev.toAddress;
    tx.coin_amount = coinAmount;
    tx.usd_amount = (coinAmount.times(pricePerShare)).truncate(DECIMALS);
    tx.factor = getFactor(token);
    tx.pool_id = NO_POOL;
    tx.save();
    return tx;
}
