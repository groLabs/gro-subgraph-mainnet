import { CoreTx, Totals } from '../../generated/schema'
import { tokenToDecimal } from '../utils/tokens'
import { Address, BigDecimal, BigInt, Bytes } from '@graphprotocol/graph-ts'

const setCoreTx = (
    id: string,
    type: string,
    token: string,
    userAddress: string,
    contractAddress: Address,
    spenderAddress: Bytes,
    block: BigInt,
    timestamp: BigInt,
    value: BigInt
): CoreTx => {
    const transfer_tag = (type == 'transfer_in')
        ? '_in'
        : (type == 'transfer_out')
            ? '_out'
            : '';
    let tx = new CoreTx(
        id + transfer_tag
    );

    const coinAmount = tokenToDecimal(value, 18);

    tx.userAddress = userAddress;
    tx.contractAddress = contractAddress;
    tx.block = block.toI32();
    tx.timestamp = timestamp.toI32();
    tx.token = token;
    tx.type = type;
    tx.coinAmount = coinAmount;
    tx.usdAmount = coinAmount;
    tx.spenderAddress = spenderAddress;
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

    if (type === 'deposit' || type === 'transfer_in') {
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
    setCoreTx,
    setTotals,
}
