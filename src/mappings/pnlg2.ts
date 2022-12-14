import {
    LogNewFixedRate,
    LogNewPendingFixedRate,
} from '../../generated/PnLG2/PnLFixedRate';


export function handleLogNewDeposit(event: LogNewFixedRate): void {
    // do something (tbc)
}

export function handleLogNewWithdrawal(event: LogNewPendingFixedRate): void {
    // do something (tbc)
}
