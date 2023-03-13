import { NUM } from '../utils/constants';
import { GVault } from '../../generated/schema';
import {
    Bytes,
    BigInt,
    BigDecimal,
} from '@graphprotocol/graph-ts';


export const initGVault = (
    vaultAddress: Bytes,
): GVault => {
    let vault = GVault.load(vaultAddress);
    if (!vault) {
        vault = new GVault(vaultAddress);
        vault.release_factor = i32(86400);
        vault.locked_profit = NUM.ZERO;
        vault.locked_profit_timestamp = i32(0);
        vault.save();
    }
    return vault;
}

export const setNewReleaseFactor = (
    vaultAddress: Bytes,
    value: i32,
): void => {
    let vault = initGVault(vaultAddress);
    vault.release_factor = value;
    vault.save();
}

// @dev: triggered by GVault->`LogStrategyHarvestReport`
export const setGVaultLockedProfit = (
    vaultAddress: Bytes,
    lockedProfit: BigDecimal,
    block: BigInt,
): void => {
    let vault = initGVault(vaultAddress);
    vault.locked_profit = lockedProfit;
    vault.locked_profit_timestamp = block.toI32();
    vault.save();
}
