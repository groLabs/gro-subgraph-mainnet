import { DECIMALS } from '../utils/constants';
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
    tx.owner_address = ev.ownerAddress;
    tx.contract_address = ev.contractAddress;
    tx.block_number = ev.block.toI32();
    tx.block_timestamp = ev.timestamp.toI32();
    tx.token = token;
    tx.type = 'approval';
    tx.hash = ev.hash;
    tx.coin_amount = coinAmount;
    tx.usd_amount = coinAmount.times(pricePerShare);
    tx.spender_address = ev.spenderAddress;
    tx.save();
    return tx;
}

