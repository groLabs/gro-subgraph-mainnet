import {
    Bytes,
    BigInt,
} from '@graphprotocol/graph-ts';


export class TransferEvent {
    id: Bytes
    block: BigInt
    timestamp: BigInt
    hash: Bytes
    contractAddress: Bytes
    fromAddress: Bytes
    toAddress: Bytes
    value: BigInt

    constructor(
        id: Bytes,
        block: BigInt,
        timestamp: BigInt,
        hash: Bytes,
        contractAddress: Bytes,
        fromAddress: Bytes,
        toAddress: Bytes,
        value: BigInt,
    ) {
        this.id = id
        this.block = block
        this.timestamp = timestamp
        this.hash = hash
        this.contractAddress = contractAddress
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.value = value
    }
}
