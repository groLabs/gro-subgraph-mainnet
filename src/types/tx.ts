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
