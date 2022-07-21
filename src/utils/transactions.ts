import {
    Address,
    BigDecimal,
    BigInt,
    Bytes
} from '@graphprotocol/graph-ts';
import {
    CoreTx,
    Totals
} from '../../generated/schema';
import {
    tokenToDecimal,
    getPricePerShare,
} from '../utils/tokens';


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
    const coinAmount = tokenToDecimal(value, 18);
    const pricePerShare = getPricePerShare(
        contractAddress,
        token,
    );
    const transfer_tag = (type == 'transfer_in')
        ? '-in'
        : (type == 'transfer_out')
            ? '-out'
            : '';
    let tx = new CoreTx(
        id + transfer_tag
    );

    tx.userAddress = userAddress;
    tx.contractAddress = contractAddress;
    tx.block = block.toI32();
    tx.timestamp = timestamp.toI32();
    tx.token = token;
    tx.type = type;
    tx.hash = Bytes.fromHexString(id.split('-')[0]);
    tx.coinAmount = coinAmount;
    tx.usdAmount = coinAmount.times(pricePerShare);
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
