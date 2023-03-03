import {
    Bytes,
    BigInt,
} from '@graphprotocol/graph-ts';


export class AirdropNewDropEvent {
    id: Bytes
    contractAddress: Bytes
    tranche_id: i32
    merkle_root: Bytes
    amount: BigInt

    constructor(
        id: Bytes,
        contractAddress: Bytes,
        tranche_id: i32,
        merkle_root: Bytes,
        amount: BigInt,
    ) {
        this.id = id
        this.contractAddress = contractAddress
        this.tranche_id = tranche_id
        this.merkle_root = merkle_root
        this.amount = amount
    }
}
