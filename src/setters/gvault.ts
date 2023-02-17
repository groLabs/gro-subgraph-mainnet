import { NUM } from '../utils/constants';
import { GVault } from '../../generated/schema';
import { Address } from '@graphprotocol/graph-ts';


export const initGVault = (
    vaultAddress: Address,
): GVault => {
    const id = vaultAddress.toHexString();
    let vault = GVault.load(id);
    if (!vault) {
        vault = new GVault(id);
        vault.release_factor = i32(86400);
        vault.locked_profit = NUM.ZERO;
        vault.locked_profit_timestamp = i32(0);
        vault.save();
    }
    return vault;
}

export const setNewReleaseFactor = (
    vaultAddress: Address,
    value: i32,
): void => {
    let vault = initGVault(vaultAddress);
    vault.release_factor = value;
    vault.save();
}
