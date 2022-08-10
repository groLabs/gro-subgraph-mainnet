import {
    Address,
    BigInt,
} from '@graphprotocol/graph-ts';


export class WithdrawalEvent {
    id: string
    block: i32
    timestamp: i32
    contractAddress: Address
    type: string
    userAddress: string
    pid: i32
    amount: BigInt

    constructor(
        id: string,
        block: i32,
        timestamp: i32,
        contractAddress: Address,
        type: string,
        userAddress: string,
        pid: i32,
        amount: BigInt,
    ) {
        this.id = id
        this.block = block
        this.timestamp = timestamp
        this.contractAddress = contractAddress
        this.type = type
        this.userAddress = userAddress
        this.pid = pid
        this.amount = amount
    }
}
