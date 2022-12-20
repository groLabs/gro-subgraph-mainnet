import { DECIMALS } from '../utils/constants';
import { Bytes } from '@graphprotocol/graph-ts';
import { ApprovalEvent } from '../types/approval';
import { ApprovalTx } from '../../generated/schema';
import {
    tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';


export const setApprovalTx = (
    ev: ApprovalEvent,
    token: string,
): ApprovalTx => {
    let tx = new ApprovalTx(ev.id);

    const base = (token === 'usdc' || token === 'usdt')
        ? 6
        : 18;
    const coinAmount = tokenToDecimal(ev.value, base, DECIMALS);
    const pricePerShare = getPricePerShare(token);

    tx.ownerAddress = ev.ownerAddress;
    tx.contractAddress = ev.contractAddress;
    tx.block = ev.block.toI32();
    tx.timestamp = ev.timestamp.toI32();
    tx.token = token;
    tx.type = 'approval';
    tx.hash = Bytes.fromHexString(ev.id.split('-')[0]);
    tx.coinAmount = coinAmount;
    tx.usdAmount = coinAmount.times(pricePerShare);
    tx.spenderAddress = ev.spenderAddress;
    tx.save();
    return tx;
}

