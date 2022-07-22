import {
    Address,
    BigInt
} from '@graphprotocol/graph-ts';

export class ApprovalEvent {
    id: string
    block: BigInt
    timestamp: BigInt
    contractAddress: Address
    ownerAddress: string
    spenderAddress: Address
    value: BigInt

    constructor(
        id: string,
        block: BigInt,
        timestamp: BigInt,
        contractAddress: Address,
        ownerAddress: string,
        spenderAddress: Address,
        value: BigInt
    ) {
        this.id = id
        this.block = block
        this.timestamp = timestamp
        this.contractAddress = contractAddress
        this.ownerAddress = ownerAddress
        this.spenderAddress = spenderAddress
        this.value = value
    }
}

export class TransferEvent {
    id: string
    block: BigInt
    timestamp: BigInt
    contractAddress: Address
    fromAddress: Address
    toAddress: Address
    value: BigInt

    constructor(
        id: string,
        block: BigInt,
        timestamp: BigInt,
        contractAddress: Address,
        fromAddress: Address,
        toAddress: Address,
        value: BigInt,
    ) {
        this.id = id
        this.block = block
        this.timestamp = timestamp
        this.contractAddress = contractAddress
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.value = value
    }
}
