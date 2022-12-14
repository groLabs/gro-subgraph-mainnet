import { setStrategyReported } from '../setters/strats';
import { EmergencyShutdown } from '../../generated/Vault/Vyper_contract';
import { StrategyReported as StrategyReportedDAI, } from '../../generated/VaultDAI/Vyper_contract';
import { StrategyReported as StrategyReportedUSDC, } from '../../generated/VaultUSDC/Vyper_contract';
import { StrategyReported as StrategyReportedUSDT } from '../../generated/VaultUSDT/Vyper_contract';


export function handleStrategyReportedDAI(event: StrategyReportedDAI): void {
    setStrategyReported(
        event.address,
        event.params.strategy,
        event.params.totalDebt,
        event.block.number,
        'dai',
        true,
    );
}

export function handleStrategyReportedUSDC(event: StrategyReportedUSDC): void {
    setStrategyReported(
        event.address,
        event.params.strategy,
        event.params.totalDebt,
        event.block.number,
        'usdc',
        true,
    );
}

export function handleStrategyReportedUSDT(event: StrategyReportedUSDT): void {
    setStrategyReported(
        event.address,
        event.params.strategy,
        event.params.totalDebt,
        event.block.number,
        'usdt',
        true,
    );
}

export function handleEmergencyShutdown (event: EmergencyShutdown): void {
    // do nothing
}
