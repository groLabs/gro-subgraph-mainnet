import {
    Address,
    BigDecimal
} from '@graphprotocol/graph-ts';

// Basic transaction data to be shown in error logs
export class Tx {
    msg: string
    data: string[]
    block: number
    constructor(
        msg: string,
        data: string[],
        block: number,
    ) {
        this.msg = msg
        this.data = data
        this.block = block
    }
}

export class TransferDataFromTx {
    from: Address
    amount: BigDecimal
    token: string
    constructor(
        from: Address,
        amount: BigDecimal,
        token: string,
    ) {
        this.from = from
        this.amount = amount
        this.token = token
    }
}
