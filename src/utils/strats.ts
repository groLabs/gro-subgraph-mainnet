import { Strategy } from '../../generated/schema';
import { Strategy as Strat } from '../types/strats';
import { Vyper_contract as vaultAdapter } from '../../generated/VaultAdapter/Vyper_contract';
import {
    Vyper_contract as vault,
    Vyper_contract__strategiesResult
} from '../../generated/Vault/Vyper_contract';
import {
    BigInt,
    Address,
    ethereum,
} from '@graphprotocol/graph-ts';


export const getStrategies = (): Strat[] => {
    const strats = [
        new Strat(
            '0xdea436e15b40e7b707a7002a749f416dfe5b383f', // strategy address
            '0x6a01bc748d71489372bd8fb743b23f63d99aac85', // vault address
            '0x277947d84a2ec370a636683799351acef97fec60', // adapter address
            'Convex XPool DAI primary', // strategy name
            'Convex-FRAX-3CRV',         // strategy display name
            'DAI',          // vault name
            'DAI yVault',   // vault display name
            'dai',          // coin
            'frax',         // metacoin
            'convex',       // protocol
            true,           // active
            0,              // queue id (not applicable for non G^2)
        ),
        new Strat(
            '0x4d5b5376cbcc001bb4f8930208828ab87d121da8', // strategy address
            '0x6a01bc748d71489372bd8fb743b23f63d99aac85', // vault address
            '0x277947d84a2ec370a636683799351acef97fec60', // adapter address
            'Convex XPool DAI secondary',   // strategy name
            'Convex-TUSD-3CRV',             // strategy display name
            'DAI',          // vault name
            'DAI yVault',   // vault display name
            'dai',          // coin
            'tusd',         // metacoin
            'convex',       // protocol
            true,           // active
            0,              // queue id (not applicable for non G^2)
        ),
        new Strat(
            '0x8b335d3e266389ae08a2f22b01d33813d40ed8fd', // strategy address
            '0x03b298d27b0426758cb70c4add6523927bd7cc8e', // vault address
            '0x9b2688da7d80641f6e46a76889ea7f8b59771724', // adapter address
            'Convex XPool USDC primary',    // strategy name
            'Convex-ALUSD-3CRV',            // strategy display name
            'USDC',         // vault name
            'USDC yVault',  // vault display name
            'usdc',         // coin
            'alusd',        // metacoin
            'convex',       // protocol
            true,           // active
            0,              // queue id (not applicable for non G^2)
        ),
        new Strat(
            '0xd370998b2e7941151e7bb9f6e337a12f337d0682', // strategy address
            '0x03b298d27b0426758cb70c4add6523927bd7cc8e', // vault address
            '0x9b2688da7d80641f6e46a76889ea7f8b59771724', // adapter address
            'Convex XPool USDC secondary',  // strategy name
            'Convex-GUSD-3CRV',             // strategy display name
            'USDC',         // vault name
            'USDC yVault',  // vault display name
            'usdc',         // coin
            'gusd',         // metacoin
            'convex',       // protocol
            true,           // active
            0,              // queue id (not applicable for non G^2)
        ),
        new Strat(
            '0xde5a25415c637b52d59ef980b29a5fda8dc3c70b', // strategy address
            '0x9cd696a225d7a3c9ce1ed71f5bdb031234a86d79', // vault address
            '0x6419cb544878e8c4faa5eaf22d59d4a96e5f12fa', // adapter address
            'Convex XPool USDT',        // strategy name
            'Convex-OUSD-3CRV',         // strategy display name
            'USDT',         // vault name
            'USDT yVault',  // vault display name
            'usdt',         // coin
            'ousd',         // metacoin
            'convex',       // protocol
            true,           // active
            0,              // queue id (not applicable for non G^2)
        ),
        // new Strat(
        //     '0x2d13826359803522cce7a4cfa2c1b582303dd0b4',   // strategy
        //     '0xb9d9e972100a1dd01cd441774b45b5821e136043',   // vault
        //     Address.zero().toHexString(),   // g2 no adapter again
        //     'convexFrax',
        //     'Convex-Frax',
        //     '3CRVVault',
        //     '3CRV Vault',
        //     '3CRV',
        //     'Frax',
        //     'convex',
        //     true,
        //     0,
        // ),
        // new Strat(
        //     '0xf5c3953ae4639806fcbcc3196f71dd81b0da4348',   // strategy
        //     '0xb9d9e972100a1dd01cd441774b45b5821e136043',   // vault
        //     Address.zero().toHexString(),   // g2 no adapter again
        //     'convexMim',
        //     'Convex-Mim',
        //     '3CRVVault',
        //     '3CRV Vault',
        //     '3CRV',
        //     'Mim',
        //     'convex',
        //     true,
        //     0,
        // ),
        // new Strat(
        //     '0x3a622db2db50f463df562dc5f341545a64c580fc',   // strategy
        //     '0xb9d9e972100a1dd01cd441774b45b5821e136043',   // vault
        //     Address.zero().toHexString(),   // g2 no adapter again
        //     'convexLusd',
        //     'Convex-Lusd',
        //     '3CRVVault',
        //     '3CRV Vault',
        //     '3CRV',
        //     'Lusd',
        //     'convex',
        //     true,
        //     0,
        // ),
    ];
    return strats;
}

export const getGVaultStrategies = (): Strat[] => {
    const strats = [
        new Strat(
            '0xd1b9af64ed5cdcaeb58955d82fb384b3e558df7b', // strategy address
            '0xae013d9bfa88f54a825831f969cb44ee020872d8', // vault address
            Address.zero().toHexString(), // adapter address (not applicable for G^2)
            'convexFrax',   // strategy name
            'Convex-Frax',  // strategy display name
            '3CRVVault',    // vault name
            '3CRV yVault',  // vault display name
            '3CRV',         // coin
            'Frax',         // metacoin
            'convex',       // protocol
            true,           // active
            1,              // queue id
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
    return Address.zero();
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

//@dev: potential reversion is checked in calling function
export const getTotalAssetsVault = (
    adapterAddress: Address,
): ethereum.CallResult<BigInt> => {
    const contractAdapter = vaultAdapter.bind(adapterAddress);
    const totalAssets = contractAdapter.try_totalAssets();
    return totalAssets;
}

//@dev: potential reversion is checked in calling function
export const getTotalAssetsStrat = (
    vaultAddress: Address,
    strategyAddress: Address,
): ethereum.CallResult<Vyper_contract__strategiesResult> => {
    const contractAdapter = vault.bind(vaultAddress);
    const assets = contractAdapter.try_strategies(strategyAddress);
    return assets;
}

export const getStrategyAddressByQueueId = (queueId: number): Address => {
    const strats = getGVaultStrategies();
    for (let i = 0; i < strats.length; i++) {
        if (strats[i].queueId == queueId) {
            return Address.fromString(strats[i].id);
        }
    }
    return Address.zero();
}
