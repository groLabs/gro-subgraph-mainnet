import {
    Bytes,
    BigInt,
} from '@graphprotocol/graph-ts';

export class ApprovalEvent {
    id: Bytes
    block: BigInt
    timestamp: BigInt
    hash: Bytes
    contractAddress: Bytes
    ownerAddress: Bytes
    spenderAddress: Bytes
    value: BigInt

    constructor(
        id: Bytes,
        block: BigInt,
        timestamp: BigInt,
        hash: Bytes,
        contractAddress: Bytes,
        ownerAddress: Bytes,
        spenderAddress: Bytes,
        value: BigInt
    ) {
        this.id = id
        this.block = block
        this.timestamp = timestamp
        this.hash = hash
        this.contractAddress = contractAddress
        this.ownerAddress = ownerAddress
        this.spenderAddress = spenderAddress
        this.value = value
    }
}
