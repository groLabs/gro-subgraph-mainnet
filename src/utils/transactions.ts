import {
    Address,
    BigDecimal,
    BigInt,
    Bytes
} from '@graphprotocol/graph-ts';
import {
    ApprovalTx,
    TransferTx,
    Totals
} from '../../generated/schema';
import {
    tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';
import { ApprovalEvent } from '../utils/types';


const setApprovalTx = (
    ev: ApprovalEvent,
    token: string,
): ApprovalTx => {
    let tx = new ApprovalTx(ev.id);
    const coinAmount = tokenToDecimal(ev.value, 18, 7);
    const pricePerShare = getPricePerShare(
        ev.contractAddress,
        token,
    );
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

// TODO: review code reusability
// TODO: send TransferEvent class instead of all these fields
const setTransferTx = (
    id: string,
    type: string,
    token: string,
    contractAddress: Address,
    userAddress: string,
    fromAddress: Bytes,
    toAddress: Bytes,
    block: BigInt,
    timestamp: BigInt,
    value: BigInt
): TransferTx => {
    const transfer_tag = (type == 'transfer_in')
        ? '-in'
        : (type == 'transfer_out')
            ? '-out'
            : '';
    let tx = new TransferTx(
        id + transfer_tag
    );
    const coinAmount = tokenToDecimal(value, 18, 7);
    const pricePerShare = getPricePerShare(
        contractAddress,
        token,
    );

    tx.contractAddress = contractAddress;
    tx.block = block.toI32();
    tx.timestamp = timestamp.toI32();
    tx.token = token;
    tx.type = type;
    tx.hash = Bytes.fromHexString(id.split('-')[0]);
    tx.userAddress = userAddress;
    tx.fromAddress = fromAddress;
    tx.toAddress = toAddress;
    tx.coinAmount = coinAmount;
    tx.usdAmount = coinAmount.times(pricePerShare);
    tx.save();
    return tx;
}

const setTotals = (
    type: string,
    coin: string,
    userAddress: string,
    usdAmount: BigDecimal
): void => {
    let total = Totals.load(userAddress);

    if (!total) {
        total = new Totals(userAddress);
        total.userAddress = userAddress;
        total.eth_amount_added_gvt = BigDecimal.fromString('0');
        total.eth_amount_added_pwrd = BigDecimal.fromString('0');
        total.eth_amount_added_total = BigDecimal.fromString('0');
        total.eth_amount_removed_gvt = BigDecimal.fromString('0');
        total.eth_amount_removed_pwrd = BigDecimal.fromString('0');
        total.eth_amount_removed_total = BigDecimal.fromString('0');
    }

    if (coin === 'gro') {
        // no nothing for now (required to initialised non-null amounts to 0)
    } else if (type === 'deposit' || type === 'transfer_in') {
        if (coin === 'gvt') {
            total.eth_amount_added_gvt = total.eth_amount_added_gvt.plus(usdAmount);
        } else if (coin === 'pwrd') {
            total.eth_amount_added_pwrd = total.eth_amount_added_pwrd.plus(usdAmount);
        }
        total.eth_amount_added_total = total.eth_amount_added_total.plus(usdAmount);
    } else if (type === 'withdrawal' || type === 'transfer_out') {
        if (coin === 'gvt') {
            total.eth_amount_removed_gvt = total.eth_amount_removed_gvt.plus(usdAmount);
        } else if (coin === 'pwrd') {
            total.eth_amount_removed_pwrd = total.eth_amount_removed_pwrd.plus(usdAmount);
        }
        total.eth_amount_removed_total = total.eth_amount_removed_total.plus(usdAmount);
    }

    total.save();
}

export {
    setTransferTx,
    setApprovalTx,
    setTotals,
}
