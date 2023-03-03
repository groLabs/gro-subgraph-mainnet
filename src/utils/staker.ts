
import { tokenToDecimal } from '../utils/tokens';
import { LpTokenStaker as StakerV1 } from '../../generated/LpTokenStakerV1/LpTokenStaker';
import { LpTokenStaker as StakerV2 } from '../../generated/LpTokenStakerV2/LpTokenStaker';
import {
    NUM,
    DECIMALS,
} from '../utils/constants';
import {
    staker1Address,
    staker2Address,
} from '../utils/contracts';
import {
    log,
    Bytes,
    BigInt,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';


const showError = (
    version: string,
    userAddress: Bytes,
    poolId: i32
): void => {
    const data = `on userAddress: {}, poolId: {}`;
    log.error(
        `getRewardDebt(): try_userInfo reverted for Staker${version} ${data} in /utils/staker.ts`,
        [userAddress.toHexString(), poolId.toString()]
    );
}

// TODO: review Address conversions
export function getRewardDebt(
    contractAddress: Bytes,
    userAddress: Bytes,
    poolId: i32,
): BigDecimal {
    let currentRewardDebt = NUM.ZERO;
    if (Address.fromBytes(contractAddress) == staker1Address) {
        const contract = StakerV1.bind(Address.fromBytes(contractAddress));
        const userInfo = contract.try_userInfo(
            BigInt.fromI32(poolId),
            Address.fromBytes(userAddress)
        );
        if (userInfo.reverted) {
            showError('V1', userAddress, poolId);
        } else {
            currentRewardDebt = tokenToDecimal(userInfo.value.getRewardDebt(), 18, DECIMALS);
        }
    } else if (Address.fromBytes(contractAddress) == staker2Address) {
        const contract = StakerV2.bind(Address.fromBytes(contractAddress));
        const userInfo = contract.try_userInfo(
            BigInt.fromI32(poolId),
            Address.fromBytes(userAddress)
        );
        if (userInfo.reverted) {
            showError('V2', userAddress, poolId);
        } else {
            currentRewardDebt = tokenToDecimal(userInfo.value.getRewardDebt(), 18, DECIMALS);
        }
    } else {
        log.error(
            'getRewardDebt(): no staker contract found {} in /utils/staker.ts',
            [contractAddress.toHexString()]
        );
    }
    return currentRewardDebt;
}
