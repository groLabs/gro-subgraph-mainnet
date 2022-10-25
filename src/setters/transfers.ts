import { getFactor } from '../setters/factors';
import { Bytes } from '@graphprotocol/graph-ts';
import { TransferEvent } from '../types/transfer';
import { TransferTx } from '../../generated/schema';
import {
    NO_POOL,
    DECIMALS,
} from '../utils/constants';
import {
    tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';


export const setTransferTx = (
    ev: TransferEvent,
    userAddress: string,
    type: string,
    token: string,
): TransferTx => {
    const transfer_tag = (type == 'transfer_in')
        ? '-in'
        : (type == 'transfer_out')
            ? '-out'
            : '';
    let tx = new TransferTx(
        ev.id + transfer_tag
    );

    const coinAmount = tokenToDecimal(ev.value, 18, DECIMALS);
    const pricePerShare = getPricePerShare(token);

    tx.contractAddress = ev.contractAddress;
    tx.block = ev.block.toI32();
    tx.timestamp = ev.timestamp.toI32();
    tx.token = token;
    tx.type = type;
    tx.hash = Bytes.fromHexString(ev.id.split('-')[0]);
    tx.userAddress = userAddress;
    tx.fromAddress = ev.fromAddress;
    tx.toAddress = ev.toAddress;
    tx.coinAmount = coinAmount;
    tx.usdAmount = (coinAmount.times(pricePerShare)).truncate(DECIMALS);
    tx.factor = getFactor(token);
    tx.poolId = NO_POOL;
    tx.save();
    return tx;
}
