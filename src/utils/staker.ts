import { tokenToDecimal } from '../utils/tokens';
import {
    NUM,
    ADDR,
} from '../utils/constants';
import { Address, BigInt, log, BigDecimal } from '@graphprotocol/graph-ts';
import { LpTokenStaker as StakerV1 } from '../../generated/LpTokenStakerV1/LpTokenStaker';
import { LpTokenStaker as StakerV2 } from '../../generated/LpTokenStakerV2/LpTokenStaker';


const showError = (
    version: string,
    userAddress: string,
    poolId: i32
): void => {
    const data = `on userAddress: {}, poolId: {}`;
    log.error(
        `getRewardDebt() reverted in src/utils/staker.ts for StakerV${version} ${data}`,
        [userAddress, poolId.toString()]
    );
}

export function getRewardDebt(
    contractAddress: Address,
    userAddress: string,
    poolId: i32,
): BigDecimal {
    let currentRewardDebt = NUM.ZERO;
    if (contractAddress == ADDR.STAKER_V1) {
        const contract = StakerV1.bind(contractAddress);
        const userInfo = contract.try_userInfo(
            BigInt.fromI32(poolId),
            Address.fromString(userAddress)
        );
        if (userInfo.reverted) {
            showError('1', userAddress, poolId);
        } else {
            currentRewardDebt = tokenToDecimal(userInfo.value.getRewardDebt(), 18, 7);
        }
    } else if (contractAddress == ADDR.STAKER_V2) {
        const contract = StakerV2.bind(contractAddress);
        const userInfo = contract.try_userInfo(
            BigInt.fromI32(poolId),
            Address.fromString(userAddress)
        );
        if (userInfo.reverted) {
            showError('2', userAddress, poolId);
        } else {
            currentRewardDebt = tokenToDecimal(userInfo.value.getRewardDebt(), 18, 7);
        }
    } else {
        log.error(
            'getRewardDebt() reverted in src/utils/staker.ts -> No staker contract found {}',
            [contractAddress.toHexString()]
        );
    }
    return currentRewardDebt;
}
