import {
    Bytes,
    BigInt,
} from '@graphprotocol/graph-ts';


export class AirdropClaimEvent {
    id: Bytes
    block: i32
    timestamp: i32
    hash: Bytes
    contractAddress: Bytes
    userAddress: Bytes
    vest: boolean
    tranche_id: i32
    amount: BigInt

    constructor(
        id: Bytes,
        block: i32,
        timestamp: i32,
        hash: Bytes,
        contractAddress: Bytes,
        userAddress: Bytes,
        vest: boolean,
        tranche_id: i32,
        amount: BigInt,
    ) {
        this.id = id
        this.block = block
        this.timestamp = timestamp
        this.hash = hash
        this.contractAddress = contractAddress
        this.userAddress = userAddress
        this.vest = vest
        this.tranche_id = tranche_id
        this.amount = amount
    }
}
