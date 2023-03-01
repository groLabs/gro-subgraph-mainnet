import {
    Address,
    BigInt,
} from '@graphprotocol/graph-ts';


export class AirdropClaimEvent {
    id: string
    block: i32
    timestamp: i32
    contractAddress: Address
    userAddress: string
    vest: boolean
    tranche_id: i32
    amount: BigInt

    constructor(
        id: string,
        block: i32,
        timestamp: i32,
        contractAddress: Address,
        userAddress: string,
        vest: boolean,
        tranche_id: i32,
        amount: BigInt,
    ) {
        this.id = id
        this.block = block
        this.timestamp = timestamp
        this.contractAddress = contractAddress
        this.userAddress = userAddress
        this.vest = vest
        this.tranche_id = tranche_id
        this.amount = amount
    }
}
