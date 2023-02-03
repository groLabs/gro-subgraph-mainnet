import { tokenToDecimal } from '../utils/tokens';
import { 
    setUtilizationRatio,
    setUtilizationRatioLimit,
} from '../setters/gtranche';
import {
    LogNewTrancheBalance,
    LogNewUtilisationThreshold,
} from '../../generated/GTranche/GTranche';


export function handleNewTrancheBalance(event: LogNewTrancheBalance): void {
    const utilRatio = tokenToDecimal(event.params._utilisation, 4, 4);
    setUtilizationRatio(utilRatio);
}

export function handleLogNewUtilisationThreshold(event: LogNewUtilisationThreshold): void {
    const utilRatioLimit = tokenToDecimal(event.params.newThreshold, 4, 4);
    setUtilizationRatioLimit(utilRatioLimit);
}
