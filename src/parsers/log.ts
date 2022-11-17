// @ts-nocheck
import { Log } from '../types/log';


function parseLogEvent<T>(ev: T[]): Log[] {
    let logs = new Array<Log>(0);
    for (let i=0; i<ev.length; i++) {
        const log = new Log(
            ev[i].address,
            ev[i].topics,
            ev[i].data,
            ev[i].blockHash,
            ev[i].blockNumber,
            ev[i].transactionHash,
            ev[i].transactionIndex,
            ev[i].logIndex,
            ev[i].transactionLogIndex,
            ev[i].logType,
            false,
        )
        logs.push(log);
    }
    return logs;
}

export {
    parseLogEvent
}
