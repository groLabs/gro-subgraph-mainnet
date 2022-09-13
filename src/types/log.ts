import {
    Bytes,
    BigInt,
    Address,
} from '@graphprotocol/graph-ts';

// perhaps not needed if we can use ethereum.Log[] as parameter type
export class Log {
    address: Address
    topics: Bytes[]
    data: Bytes
    blockHash: Bytes
    blockNumber: Bytes
    transactionHash: Bytes
    transactionIndex: BigInt
    logIndex: BigInt
    transactionLogIndex: BigInt
    logType: string
    removed: bool

    constructor(
        address: Address,
        topics: Bytes[],
        data: Bytes,
        blockHash: Bytes,
        blockNumber: Bytes,
        transactionHash: Bytes,
        transactionIndex: BigInt,
        logIndex: BigInt,
        transactionLogIndex: BigInt,
        logType: string,
        removed: bool,

    ) {
        this.address = address;
        this.topics = topics;
        this.data = data;
        this.blockHash = blockHash;
        this.blockNumber = blockNumber;
        this.transactionHash = transactionHash;
        this.transactionIndex = transactionIndex;
        this.logIndex = logIndex;
        this.transactionLogIndex = transactionLogIndex;
        this.logType = logType;
        this.removed = removed;

    }
}
