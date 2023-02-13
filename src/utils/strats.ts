import { contracts } from '../../addresses';
import { Strategy as Strat } from '../types/strats';
import {
    GVault,
    GVault__strategiesResult,
} from '../../generated/GVault/GVault';
import {
    Address,
    ethereum,
} from '@graphprotocol/graph-ts';
// contracts
const gVaultAddress = Address.fromString(contracts.GVaultAddress);

// Old Gro Protocol strategies (currently not used)
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
    ];
    return strats;
}

export const getGVaultStrategies = (): Strat[] => {
    const strats = [
        new Strat(
            '0x02ba6fa63e094499a03f76bb7f19d191c0f9742a', // strategy address
            '0x4d9c9760ad1597c7c68cc4cde21f9c43e62d82db', // vault address (GVault)
            Address.zero().toHexString(),   // adapter address (not applicable for G^2)
            'Convex FRAX 3CRV primary',     // strategy name
            'Convex-FRAX-3CRV',             // strategy display name
            '3CRV',         // vault name
            '3CRV yVault',  // vault display name
            '3crv',         // coin
            'frax',         // metacoin
            'convex',       // protocol
            true,           // active
            1,              // queue id
        ),
        new Strat(
            '0xaeeed92f98e3362c49b2111388715354bf838c03', // strategy address
            '0x4d9c9760ad1597c7c68cc4cde21f9c43e62d82db', // vault address (GVault)
            Address.zero().toHexString(),   // adapter address (not applicable for G^2)
            'Convex MIM 3CRV primary',      // strategy name
            'Convex-MIM-3CRV',              // strategy display name
            '3CRV',         // vault name
            '3CRV yVault',  // vault display name
            '3crv',         // coin
            'mim',          // metacoin
            'convex',       // protocol
            true,           // active
            2,              // queue id
        ),
    ];
    return strats;
}

export const getTotalAssetsStrat3crv = (
    strategyAddress: Address,
): ethereum.CallResult<GVault__strategiesResult> => {
    const contract = GVault.bind(gVaultAddress);
    const assets = contract.try_strategies(strategyAddress);
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
