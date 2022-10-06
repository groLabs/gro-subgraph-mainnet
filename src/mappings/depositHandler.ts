import { LogNewDeposit as  LogNewDepositV1} from '../../generated/DepositHandlerV1/DepositHandler';
import { LogNewDeposit as LogNewDepositV2 } from '../../generated/DepositHandlerV2/DepositHandler';
import { LogNewDeposit as LogNewDepositV3 } from '../../generated/DepositHandlerV3/DepositHandler';
import { parseCoreDepositEvent } from '../parsers/deposit';
import { manageCoreDeposit } from '../managers/deposit';
import { getGroToken } from '../utils/tokens';
import { parseLogEvent } from '../parsers/log';


export function handleDepositV1(event: LogNewDepositV1): void {
    //setLatestPrice('groDAI_e_vault_v1_0');
    const ev = parseCoreDepositEvent(event);
    const logs = parseLogEvent(event.receipt!.logs);
    const token = getGroToken(event.params.pwrd);
    manageCoreDeposit(
        ev,
        logs,
        token
    );
}

export function handleDepositV2(event: LogNewDepositV2): void {
    //setLatestPrice('groUSDC_e_vault_v1_0');
    const ev = parseCoreDepositEvent(event);
    const logs = parseLogEvent(event.receipt!.logs);
    const token = getGroToken(event.params.pwrd);
    manageCoreDeposit(
        ev,
        logs,
        token
    );
}

export function handleDepositV3(event: LogNewDepositV3): void {
    //setLatestPrice('groUSDT_e_vault_v1_0');
    const ev = parseCoreDepositEvent(event);
    const logs = parseLogEvent(event.receipt!.logs);
    const token = getGroToken(event.params.pwrd);
    manageCoreDeposit(
        ev,
        logs,
        token
    );
}

