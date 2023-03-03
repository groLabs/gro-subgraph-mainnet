import { getGroToken } from '../utils/tokens';
import { parseLogEvent } from '../parsers/log';
import { manageCoreDeposit } from '../managers/deposit';
import { parseCoreDepositEvent } from '../parsers/deposit';
import { LogNewDeposit as  LogNewDepositV1} from '../../generated/DepositHandlerV1/DepositHandler';
import { LogNewDeposit as LogNewDepositV2 } from '../../generated/DepositHandlerV2/DepositHandler';
import { LogNewDeposit as LogNewDepositV3 } from '../../generated/DepositHandlerV3/DepositHandler';


// @dev: totalSupply can't be deduced from deposits only, as there are other transactions that
//       mint GVT or PWRD not related to deposits
//       e.g.: 0x2f38030991c7e657afe3f69fad665474a234886c560e04bf488ebed1fa846363

export function handleDepositV1(event: LogNewDepositV1): void {
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
    const ev = parseCoreDepositEvent(event);
    const logs = parseLogEvent(event.receipt!.logs);
    const token = getGroToken(event.params.pwrd);
    manageCoreDeposit(
        ev,
        logs,
        token
    );
}

