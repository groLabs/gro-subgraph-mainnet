import { ADDR } from './constants';
import { Strategy } from '../../generated/schema';
import { Strategy as Strat } from '../types/strats';
import { Vyper_contract as vaultAdapter } from '../../generated/VaultAdapter/Vyper_contract';
import { StableConvexXPool as convexStrategy } from '../../generated/ConvexStrategy/StableConvexXPool';
import {
    BigInt,
    Address,
    ethereum,
} from '@graphprotocol/graph-ts';


export const getStrategies = (): Strat[] => {
    const strats = [
        new Strat(
            '0xdea436e15b40e7b707a7002a749f416dfe5b383f',   // strategy
            '0x6a01bc748d71489372bd8fb743b23f63d99aac85',   // vault
            '0x277947d84a2ec370a636683799351acef97fec60',   // adapter
            'Convex XPool DAI primary',
            'Convex-FRAX-3CRV',
            'DAI',
            'DAI yVault',
            'dai',
            true,
        ),
        new Strat(
            '0x4d5b5376cbcc001bb4f8930208828ab87d121da8',   // strategy
            '0x6a01bc748d71489372bd8fb743b23f63d99aac85',   // vault
            '0x277947d84a2ec370a636683799351acef97fec60',   // adapter
            'Convex XPool DAI secondary',
            'Convex-mUSD-3CRV',
            'DAI',
            'DAI yVault',
            'dai',
            true,
        ),
        new Strat(
            '0xd370998b2e7941151e7bb9f6e337a12f337d0682',   // strategy
            '0x03b298d27b0426758cb70c4add6523927bd7cc8e',   // vault
            '0x9b2688da7d80641f6e46a76889ea7f8b59771724',   // adapter
            'Convex XPool USDC primary',
            'Convex-GUSD-3CRV',
            'USDC',
            'USDC yVault',
            'usdc',
            true,
        ),
        new Strat(
            '0x8b335d3e266389ae08a2f22b01d33813d40ed8fd',   // strategy
            '0x03b298d27b0426758cb70c4add6523927bd7cc8e',   // vault
            '0x9b2688da7d80641f6e46a76889ea7f8b59771724',   // adapter
            'Convex XPool USDC secondary',
            'Convex-ALUSD-3CRV',
            'USDC',
            'USDC yVault',
            'usdc',
            true,
        ),
        new Strat(
            '0xde5a25415c637b52d59ef980b29a5fda8dc3c70b',   // strategy
            '0x9cd696a225d7a3c9ce1ed71f5bdb031234a86d79',   // vault
            '0x6419cb544878e8c4faa5eaf22d59d4a96e5f12fa',   // adapter
            'Convex XPool USDT',
            'Convex-TUSD-3CRV',
            'USDT',
            'USDT yVault',
            'usdt',
            true,
        ),
    ];
    return strats;
}

export const getStrategiesByAdapter = (adapterAddress: string): Strategy[] => {
    let result: Strategy[] = [];
    const strats = getStrategies();
    for (let i = 0; i < strats.length; i++) {
        if (strats[i].adapter == adapterAddress) {
            const str = Strategy.load(strats[i].id);
            if (str)
                result.push(str);
        }
    }
    return result;
}

export const getAdapterAddressByStrategy = (strategy: string): Address => {
    const strats = getStrategies();
    for (let i = 0; i < strats.length; i++) {
        if (strats[i].id == strategy) {
            return Address.fromString(strats[i].adapter);
        }
    }
    return ADDR.ZERO;
}

export const getAdaptersByCoin = (coin: string): string[] => {
    let result: string[] = [];
    const strats = getStrategies();
    for (let i = 0; i < strats.length; i++) {
        if (strats[i].coin === coin)
            result.push(strats[i].adapter);
    }
    return result;
}

export const getStratsByCoin = (coin: string): string[] => {
    let result: string[] = [];
    const strats = getStrategies();
    for (let i = 0; i < strats.length; i++) {
        if (strats[i].coin === coin)
            result.push(strats[i].id);
    }
    return result;
}

export const getTotalAssetsVault = (
    adapterAddress: Address,
): ethereum.CallResult<BigInt> => {
    const contractAdapter = vaultAdapter.bind(adapterAddress);
    const totalAssets = contractAdapter.try_totalAssets();
    return totalAssets;
}

export const getTotalAssetsStrat = (
    strategyAddress: Address
): ethereum.CallResult<BigInt> => {
    const contractStrategy = convexStrategy.bind(strategyAddress);
    const totalEstimatedAssets = contractStrategy.try_estimatedTotalAssets();
    return totalEstimatedAssets;
}
