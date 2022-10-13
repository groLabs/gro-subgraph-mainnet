import {
    LogClaimed,
    LogNewVest,
    LogStoppedVesting,
} from '../../generated/GROTeamVesting/GROTeamVesting';
import { tokenToDecimal } from '../utils/tokens';
import { updateTeamVesting } from '../setters/vestingTeam';


export function handleClaimed(event: LogClaimed): void {
    updateTeamVesting(
        event.params.contributor.toHexString(),
        tokenToDecimal(event.params.amount, 18, 7),
        false,
    );
}

export function handleNewVest(event: LogNewVest): void {
    updateTeamVesting(
        event.params.contributor.toHexString(),
        tokenToDecimal(event.params.amount, 18, 7),
        true,
    );
}

export function StoppedVesting(event: LogStoppedVesting): void {
    //TODO: tbc
    // updateTeamVesting(
    //     event.params.contributor.toHexString(),
    //     tokenToDecimal(event.params.unlocked, 18, 7),
    //     true,
    // );
}