
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
    BigInt,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';


const showError = (
    version: string,
    userAddress: string,
    poolId: i32
): void => {
    const data = `on userAddress: {}, poolId: {}`;
    log.error(
        `getRewardDebt(): try_userInfo reverted for Staker${version} ${data} in /utils/staker.ts`,
        [userAddress, poolId.toString()]
    );
}

export function getRewardDebt(
    contractAddress: Address,
    userAddress: string,
    poolId: i32,
): BigDecimal {
    let currentRewardDebt = NUM.ZERO;
    if (contractAddress == staker1Address) {
        const contract = StakerV1.bind(contractAddress);
        const userInfo = contract.try_userInfo(
            BigInt.fromI32(poolId),
            Address.fromString(userAddress)
        );
        if (userInfo.reverted) {
            showError('V1', userAddress, poolId);
        } else {
            currentRewardDebt = tokenToDecimal(userInfo.value.getRewardDebt(), 18, DECIMALS);
        }
    } else if (contractAddress == staker2Address) {
        const contract = StakerV2.bind(contractAddress);
        const userInfo = contract.try_userInfo(
            BigInt.fromI32(poolId),
            Address.fromString(userAddress)
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
