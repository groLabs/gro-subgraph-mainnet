import {
    Bytes,
    BigInt,
} from '@graphprotocol/graph-ts';


export class ClaimEvent {
    id: Bytes
    block: i32
    timestamp: i32
    hash: Bytes
    contractAddress: Bytes
    type: string
    userAddress: Bytes
    vest: boolean
    pid: i32[]
    amount: BigInt

    constructor(
        id: Bytes,
        block: i32,
        timestamp: i32,
        hash: Bytes,
        contractAddress: Bytes,
        type: string,
        userAddress: Bytes,
        vest: boolean,
        pid: i32[],
        amount: BigInt,
    ) {
        this.id = id
        this.block = block
        this.timestamp = timestamp
        this.hash = hash
        this.contractAddress = contractAddress
        this.type = type
        this.userAddress = userAddress
        this.vest = vest
        this.pid = pid
        this.amount = amount
    }
}
