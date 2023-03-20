// SPDX-License-Identifier: AGPLv3

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

// gro protocol - ethereum subgraph: https://github.com/groLabs/gro-subgraph-mainnet

/// @notice
///     - Initialises entity <Totals> and updates their amount and value fields
///     - This entity is used to provide aggregated personal stats to the front-end

import { Totals } from '../../generated/schema';
import {
    NUM,
    TOKEN as Token,
    TX_TYPE as TxType,
} from '../utils/constants';
import {
    Bytes,
    BigDecimal,
} from '@graphprotocol/graph-ts';


/// @notice Initialises entity <Totals> with default 0 values
/// @param userAddress the user address
/// @param save stores the entity if true; doesn't store it otherwise
/// @dev total object from entity <Totals>
export const initTotals = (
    userAddress: Bytes,
    save: boolean,
): Totals => {
    let total = Totals.load(userAddress);
    if (!total) {
        total = new Totals(userAddress);
        total.user_address = userAddress;
        total.amount_added_gvt = NUM.ZERO;
        total.amount_added_pwrd = NUM.ZERO;
        total.amount_removed_gvt = NUM.ZERO;
        total.amount_removed_pwrd = NUM.ZERO;
        total.amount_added_gro = NUM.ZERO;
        total.amount_removed_gro = NUM.ZERO;
        total.amount_total_gro = NUM.ZERO;
        total.amount_vest_team_gro = NUM.ZERO;
        total.amount_claim_team_gro = NUM.ZERO;
        total.value_added_gvt = NUM.ZERO;
        total.value_added_pwrd = NUM.ZERO;
        total.value_added_total = NUM.ZERO;
        total.value_removed_gvt = NUM.ZERO;
        total.value_removed_pwrd = NUM.ZERO;
        total.value_removed_total = NUM.ZERO;
        total.net_value_gvt = NUM.ZERO;
        total.net_value_pwrd = NUM.ZERO;
        total.net_value_total = NUM.ZERO;
        total.net_amount_gvt = NUM.ZERO;
        total.net_based_amount_pwrd = NUM.ZERO;
        if (save)
            total.save();
    }
    return total;
}

/// @notice Updates the gro, gvt or pwrd amount and values in entity <Totals>
/// @dev Triggered by the following contract events:
///     - <LogDeposit> & <LogWithdrawal> from GRouter
///     - <LogNewDeposit> from DepositHandler
///     - <LogNewWithdrawal> from WithdrawHandler
///     - <LogEmergencyWithdrawal> from EmergencyHandler
///     - <Transfer> from Gro, Gvt & Pwrd (excluding staker transfers)
/// @param type the transaction type (core_deposit, core_withdrawal,
///             transfer_in & transfer_out)
/// @param coin the coin type (gro, gvt, pwrd)
/// @param userAddress the user address
/// @param coinAmount the coin amount
/// @param usdAmount the coin value (in USD)
/// @param factor the gvt or pwrd factor
export const setTotals = (
    type: string,
    coin: string,
    userAddress: Bytes,
    coinAmount: BigDecimal,
    usdAmount: BigDecimal,
    factor: BigDecimal,
): void => {
    let total = initTotals(userAddress, false);

    const isInbound = type === TxType.CORE_DEPOSIT || type === TxType.TRANSFER_IN;
    const coinAmountSigned = isInbound
        ? coinAmount
        : coinAmount.times(NUM.MINUS_ONE);
    const usdAmountSigned = isInbound
        ? usdAmount
        : usdAmount.times(NUM.MINUS_ONE);

    if (coin === Token.GRO) {
        if (isInbound) {
            total.amount_added_gro = total.amount_added_gro.plus(coinAmount);
        } else {
            total.amount_removed_gro = total.amount_removed_gro.plus(coinAmount);
        }
        total.amount_total_gro = total.amount_total_gro.plus(coinAmountSigned);
    } else if (coin === Token.GVT) {
        if (isInbound) {
            total.amount_added_gvt = total.amount_added_gvt.plus(coinAmount);
            total.value_added_gvt = total.value_added_gvt.plus(usdAmount);
        } else {
            total.amount_removed_gvt = total.amount_removed_gvt.plus(coinAmount);
            total.value_removed_gvt = total.value_removed_gvt.plus(usdAmount);
        }
        total.net_amount_gvt = total.net_amount_gvt.plus(coinAmountSigned);
        total.net_value_gvt = total.net_value_gvt.plus(usdAmountSigned);
    } else if (coin === Token.PWRD) {
        const basedAmountPwrdSigned = coinAmountSigned.times(factor);
        if (isInbound) {
            total.amount_added_pwrd = total.amount_added_pwrd.plus(coinAmount);
            total.value_added_pwrd = total.value_added_pwrd.plus(usdAmount);
        } else {
            total.amount_removed_pwrd = total.amount_removed_pwrd.plus(coinAmount);
            total.value_removed_pwrd = total.value_removed_pwrd.plus(usdAmount);
        }
        total.net_based_amount_pwrd = total.net_based_amount_pwrd.plus(basedAmountPwrdSigned);
        total.net_value_pwrd = total.net_value_pwrd.plus(usdAmountSigned);
    }
    if (coin === Token.GVT || coin === Token.PWRD) {
        total.net_value_total = total.net_value_total.plus(usdAmountSigned);
        if (isInbound) {
            total.value_added_total = total.value_added_total.plus(usdAmount);
        } else {
            total.value_removed_total = total.value_removed_total.plus(usdAmount);
        }
    }
    total.save();
}
