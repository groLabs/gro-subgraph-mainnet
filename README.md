
**Gro Subgraph**
================

[Gro Protocol](https://www.gro.xyz/) is a DeFi yield aggregator that makes it easy to earn stablecoin yields with tranching & automation.

This subgraph dynamically tracks the interaction of users with Gro contracts in Ethereum mainnet to provide personal stats on:

*   Deposits, withdrawals, transfers and approvals of GVT, PWRD and GRO tokens
    
*   Deposits, withdrawals and claims from staking contracts
    
*   Net amounts, current balance and net returns
    

Active deployments
------------------

### Hosted service:

*   [Ethereum Prod](https://thegraph.com/hosted-service/subgraph/sjuanati/gro-prod-eth) \[Production → full mainnet data\] <sup>(1)
    
*   [Ethereum Test](https://thegraph.com/hosted-service/subgraph/sjuanati/gro-test-eth) \[Development → sample mainnet data for devs\] <sup>(1)
    
*   [Avalanche Prod](https://thegraph.com/hosted-service/subgraph/sjuanati/gro-prod-avax) \[Production → full mainnet data\]
    
*   [Avalanche Test](https://thegraph.com/hosted-service/subgraph/sjuanati/gro-test-avax) \[Development → sample mainnet data for devs\]
    

(1) to be decommissioned in 2023 Q1

### Decentralised network:

*   Ethereum Prod \[Production → full mainnet data\]
    
*   [Ethereum Test](https://thegraph.com/studio/subgraph/gro-mainnet-test/) \[Development → sample mainnet data only for Gro devs\]
    

Setup
-----

1) Clone the Gro subgraph

```bash
git clone https://github.com/groLabs/gro-subgraph-mainnet.git
```

2) Install dependencies

```bash
yarn install
```

3) Run any of the below commands and [scripts](https://github.com/groLabs/gro-subgraph-mainnet/blob/master/package.json) to generate and deploy subgraphs in TheGraph platform:

```bash
# Ethereum Prod - hosted service
yarn eth-prod-hosted 
# Ethereum Test - hosted service
yarn eth-test-hosted
# Avalanche Prod - hosted service
yarn avax-prod-hosted
# Avalanche Test - hosted service
yarn avax-test-hosted
# Ethereum Prod - decentralised network
yarn eth-prod-studio
# Ethereum Test - decentralised network
yarn eth-test-studio
```

The Avalanche subgraph is located in another [repository](https://github.com/groLabs/gro-subgraph-avalanche) as it contains a different product (Labs) and smart contracts.

Key Entities
------------

**User**

It is the user wallet address that connects with most of the other entities such as totals, transfers or approvals.

**Totals**

Aggregated data net balance as the basis to calculate the user’s current balance and net returns for GVT and PWRD (excluding GRO)

**Price**

Latest token prices for GVT, GRO and WETH, and set to 1 for PWRD.

**Factor**

GVT and PWRD factors. For PWRD, it is used to calculate the current balance and net returns.

**Pool**

Staking pools \[currently out of scope\]

**TransferTx**

Contains the following transactions depending on field `type`:

<table data-layout="wide" data-local-id="9ae48a4d-bebb-437c-8e6f-c6ad0a91293f" class="confluenceTable"><colgroup><col style="width: 189.0px;"><col style="width: 343.0px;"><col style="width: 252.0px;"><col style="width: 176.0px;"></colgroup><tbody><tr><th class="confluenceTh"><p><strong>Type</strong></p></th><th class="confluenceTh"><p><strong>Description</strong></p></th><th class="confluenceTh"><p><strong>Contract</strong></p></th><th class="confluenceTh"><p><strong>Event</strong></p></th></tr><tr><td class="confluenceTd"><p>approval</p></td><td class="confluenceTd"><p>GVT, PWRD &amp; GRO token approvals</p></td><td class="confluenceTd"><p>Gro, Gvt, Pwrd</p></td><td class="confluenceTd"><p><code>Approval</code></p></td></tr><tr><td class="confluenceTd"><p>core_deposit</p></td><td class="confluenceTd"><p>GVT &amp; PWRD deposits into the protocol</p></td><td class="confluenceTd"><p>Deposit handlers</p></td><td class="confluenceTd"><p><code>LogNewDeposit</code></p></td></tr><tr><td class="confluenceTd"><p>core_withdrawal</p></td><td class="confluenceTd"><p>GVT &amp; PWRD withdrawals from the protocol</p></td><td class="confluenceTd"><p>Withdraw handlers</p></td><td class="confluenceTd"><p><code>LogNewWithdrawal</code></p></td></tr><tr><td class="confluenceTd"><p>staker_deposit</p></td><td class="confluenceTd"><p>Deposits into staking contracts <sup>(1)</sup></p></td><td class="confluenceTd"><p>Stakers</p></td><td class="confluenceTd"><p><code>LogDeposit</code></p></td></tr><tr><td class="confluenceTd"><p>staker_withdrawal</p></td><td class="confluenceTd"><p>Withdrawals from staking contracts <sup>(1)</sup></p></td><td class="confluenceTd"><p>Stakers</p></td><td class="confluenceTd"><p><code>LogWithdraw</code></p></td></tr><tr><td class="confluenceTd"><p>transfer_in</p></td><td class="confluenceTd"><p>GVT, PWRD &amp; GRO transfers received</p><p>(excluding from Staker contract)</p></td><td class="confluenceTd"><p>Gro, Gvt, Pwrd</p></td><td class="confluenceTd"><p><code>Transfer</code></p></td></tr><tr><td class="confluenceTd"><p>transfer_out</p></td><td class="confluenceTd"><p>GVT, PWRD &amp; GRO transfers sent</p><p>(excluding to Staker contract)</p></td><td class="confluenceTd"><p>Gro, Gvt, Pwrd</p></td><td class="confluenceTd"><p><code>Transfer</code></p></td></tr><tr><td class="confluenceTd"><p>claim</p></td><td class="confluenceTd"><p>Claim GRO rewards</p></td><td class="confluenceTd"><p>Stakers</p></td><td class="confluenceTd"><p><code>LogClaim</code></p></td></tr><tr><td class="confluenceTd"><p>multiclaim</p></td><td class="confluenceTd"><p>Multi claim GRO rewards</p></td><td class="confluenceTd"><p>Stakers</p></td><td class="confluenceTd"><p><code>LogMultiClaim</code></p></td></tr></tbody></table>

(1) Tokens will depend on the pool

**ApprovalTx**

Contains approval transactions for GVT, PWRD & GRO tokens

**ClaimTx**

Contains GRO claims from staking contracts where poolId indicates which pool/s are the rewards coming from:

<table data-layout="default" data-local-id="8025a982-fd35-4a29-ab55-c3aaebf8a4e0" class="confluenceTable"><colgroup><col style="width: 126.0px;"><col style="width: 283.0px;"><col style="width: 351.0px;"></colgroup><tbody><tr><th class="confluenceTh"><p><strong>Pool ID</strong></p></th><th class="confluenceTh"><p><strong>Tokens allocation</strong></p></th><th class="confluenceTh"><p><strong>Description</strong></p></th></tr><tr><td class="confluenceTd"><p>0</p></td><td class="confluenceTd"><p>100% GRO</p></td><td class="confluenceTd"><p><a class="external-link" href="https://etherscan.io/address/0x3Ec8798B81485A254928B70CDA1cf0A2BB0B74D7" rel="nofollow">Single Staking GRO</a></p></td></tr><tr><td class="confluenceTd"><p>1</p></td><td class="confluenceTd"><p>50 %GRO, 50% GVT</p></td><td class="confluenceTd"><p><a class="external-link" href="https://etherscan.io/address/0x2ac5bC9ddA37601EDb1A5E29699dEB0A5b67E9bB" rel="nofollow">Uniswap V2 GRO - GVT</a></p></td></tr><tr><td class="confluenceTd"><p>2</p></td><td class="confluenceTd"><p>50% GRO, 50% USDC</p></td><td class="confluenceTd"><p><a class="external-link" href="https://etherscan.io/address/0x21C5918CcB42d20A2368bdCA8feDA0399EbfD2f6" rel="nofollow">Uniswap V2 GRO - USDC</a></p></td></tr><tr><td class="confluenceTd"><p>3</p></td><td class="confluenceTd"><p>100% GVT</p></td><td class="confluenceTd"><p><a class="external-link" href="https://etherscan.io/address/0x3ADb04E127b9C0a5D36094125669d4603AC52a0c" rel="nofollow">Single Staking GVT</a></p></td></tr><tr><td class="confluenceTd"><p>4</p></td><td class="confluenceTd"><p>PWRD, USDC, USDT, DAI</p></td><td class="confluenceTd"><p><a class="external-link" href="https://etherscan.io/address/0xbcb91E689114B9Cc865AD7871845C95241Df4105" rel="nofollow">Curve metapool PWRD</a></p></td></tr><tr><td class="confluenceTd"><p>5</p></td><td class="confluenceTd"><p>80% GRO, 20% WETH</p></td><td class="confluenceTd"><p><a class="external-link" href="https://etherscan.io/address/0x702605f43471183158938c1a3e5f5a359d7b31ba" rel="nofollow">Balancer V2 GRO - WETH</a></p></td></tr><tr><td class="confluenceTd"><p>6</p></td><td class="confluenceTd"><p>100% PWRD</p></td><td class="confluenceTd"><p><a class="external-link" href="https://etherscan.io/address/0xf0a93d4994b3d98fb5e3a2f90dbc2d69073cb86b" rel="nofollow">Single Staking PWRD</a></p></td></tr><tr><td class="confluenceTd"><p>-1</p></td><td class="confluenceTd"><p>N/A</p></td><td class="confluenceTd"><p>Missing pool</p></td></tr></tbody></table>

Queries
-------

*   Personal stats
    

```java
{
  users(where: {id: "0x....."}) {
    address: id
    totals {
      amount_added_gvt: value_added_gvt
      amount_added_pwrd: value_added_pwrd
      amount_added_total: value_added_total
      amount_removed_gvt: value_removed_gvt
      amount_removed_pwrd: value_removed_pwrd
      amount_removed_total: value_removed_total
      net_amount_gvt: net_value_gvt
      net_amount_pwrd: net_value_pwrd
      net_amount_total: net_value_total
      # The following fields must be calculated on the front-end side:
      # current_balance_gvt = totals.net_amount_gvt * prices.gvt
      # current_balance_pwrd = totals.net_based_amount_pwrd / factors.pwrd
      # current_balance_total = current_balance_gvt + current_balance_pwrd 
      # net_returns_gvt = current_balance_gvt - totals.net_value_gvt
      # net_returns_pwrd = current_balance_pwrd - totals.net_value_pwrd
      # net_returns_total = current_balance_total - totals.net_value_total
    }
    core_deposits: transfers(where: {type: core_deposit}) {
      block
      timestamp
      hash
      token
      coinAmount
      usdAmount
      factor
    }
    core_withdrawals: transfers(where: {type: core_withdrawal}) {
      block
      timestamp
      hash
      token
      coinAmount
      usdAmount
      factor
    }
    core_transfers_in: transfers(where: {type: transfer_in}) {
      block
      timestamp
      hash
      token
      coinAmount
      usdAmount
      factor
    }
    core_transfers_out: transfers(where: {type: transfer_out}) {
      block
      timestamp
      hash
      token
      coinAmount
      usdAmount
      factor
    }
    core_approvals: approvals(where: {type: approval}) {
      block
      timestamp
      hash
      token
      spenderAddress
      coinAmount
      usdAmount
    }
    staker_deposits: transfers(where: {type: staker_deposit}) {
      block
      timestamp
      hash
      poolId
      coinAmount
    }
    staker_withdrawals: transfers(where: {type: staker_withdrawal}) {
      block
      timestamp
      hash
      poolId
      coinAmount
    }
    staker_claims: claims {
      block
      timestamp
      hash
      vest
      poolId
      amount
    }
  }
}
```

Enjoy it! 😁
