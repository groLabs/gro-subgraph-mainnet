import { DECIMALS } from '../utils/constants';
import { tokenToDecimal } from '../utils/tokens';
import { updateTeamVesting } from '../setters/vestingTeam';
import {
    LogClaimed,
    LogNewVest,
    LogStoppedVesting,
} from '../../generated/GROTeamVesting/GROTeamVesting';


export function handleClaimed(event: LogClaimed): void {
    updateTeamVesting(
        event.params.contributor.toHexString(),
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        false,
    );
}

export function handleNewVest(event: LogNewVest): void {
    updateTeamVesting(
        event.params.contributor.toHexString(),
        tokenToDecimal(event.params.amount, 18, DECIMALS),
        true,
    );
}

export function StoppedVesting(event: LogStoppedVesting): void {
    //TODO: tbc
    // updateTeamVesting(
    //     event.params.contributor.toHexString(),
    //     tokenToDecimal(event.params.unlocked, 18, DECIMALS),
    //     true,
    // );
}