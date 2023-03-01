import {
    Address,
    BigInt,
} from '@graphprotocol/graph-ts';


export class AirdropNewDropEvent {
    id: string
    contractAddress: Address
    tranche_id: i32
    merkle_root: string
    amount: BigInt

    constructor(
        id: string,
        contractAddress: Address,
        tranche_id: i32,
        merkle_root: string,
        amount: BigInt,
    ) {
        this.id = id
        this.contractAddress = contractAddress
        this.tranche_id = tranche_id
        this.merkle_root = merkle_root
        this.amount = amount
    }
}
