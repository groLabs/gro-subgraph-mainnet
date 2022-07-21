import { Address, BigInt } from '@graphprotocol/graph-ts';

export class ApprovalEvent {
    id: string
    contractAddress: Address
    ownerAddress: string
    spenderAddress: Address
    block: BigInt
    timestamp: BigInt
    value: BigInt

    constructor(
        id: string,
        contractAddress: Address,
        ownerAddress: string,
        spenderAddress: Address,
        block: BigInt,
        timestamp: BigInt,
        value: BigInt
    ) {
        this.id = id
        this.contractAddress = contractAddress
        this.ownerAddress = ownerAddress
        this.spenderAddress = spenderAddress
        this.block = block
        this.timestamp = timestamp
        this.value = value
    }
}

export class TransferEvent {
    id: string
    contractAddress: Address
    fromAddress: Address
    toAddress: Address
    block: BigInt
    timestamp: BigInt
    value: BigInt

    constructor(
        id: string,
        contractAddress: Address,
        fromAddress: Address,
        toAddress: Address,
        block: BigInt,
        timestamp: BigInt,
        value: BigInt,
    ) {
        this.id = id
        this.contractAddress = contractAddress
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.block = block
        this.timestamp = timestamp
        this.value = value
    }
}
