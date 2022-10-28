import { StrategyReported as StrategyReportedDAI, } from '../../generated/VaultDAI/Vyper_contract';
import { StrategyReported as StrategyReportedUSDC, } from '../../generated/VaultUSDC/Vyper_contract';
import { StrategyReported as StrategyReportedUSDT } from '../../generated/VaultUSDT/Vyper_contract';
import {
    setStrategyReportedDAI,
    setStrategyReportedUSDC,
    setStrategyReportedUSDT,
} from '../setters/strats';


export function handleStrategyReportedDAI(event: StrategyReportedDAI): void {
    setStrategyReportedDAI(
        event.address,
        event.params.strategy,
        event.params.totalDebt,
        event.block.number,
    );
}

export function handleStrategyReportedUSDC(event: StrategyReportedUSDC): void {
    setStrategyReportedUSDC(
        event.address,
        event.params.strategy,
        event.params.totalDebt,
        event.block.number,
    );
}

export function handleStrategyReportedUSDT(event: StrategyReportedUSDT): void {
    setStrategyReportedUSDT(
        event.address,
        event.params.strategy,
        event.params.totalDebt,
        event.block.number,
    );
}
