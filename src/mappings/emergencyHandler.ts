import { parseLogEvent } from '../parsers/log';
import { parseCoreEmergencyWithdrawalEvent } from '../parsers/withdrawals';
import { manageEmergencyCoreWithdrawal } from '../managers/emergencyWithdrawal';
import { LogEmergencyWithdrawal } from '../../generated/EmergencyHandlerV3/EmergencyHandler';


export function handleEmergencyWithdrawalV3(event: LogEmergencyWithdrawal): void {
    const ev = parseCoreEmergencyWithdrawalEvent(event);
    const logs = parseLogEvent(event.receipt!.logs);
    manageEmergencyCoreWithdrawal(
        ev,
        logs,
    );
}