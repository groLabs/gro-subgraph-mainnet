export class Vault {
    id: string
    adapter: string
    active: boolean
    constructor(
        id: string,
        adapter: string,
        active: boolean,
    ) {
        this.id = id
        this.adapter = adapter
        this.active = active
    }
}

export class Strategy {
    id: string
    vault: string
    adapter: string
    strat_name: string
    strat_display_name: string
    vault_name: string
    vault_display_name: string
    coin: string
    protocol: string
    metacoin: string
    active: boolean
    constructor(
        id: string,
        vault: string,
        adapter: string,
        strat_name: string,
        strat_display_name: string,
        vault_name: string,
        vault_display_name: string,
        coin: string,
        metacoin: string,
        protocol: string,
        active: boolean,
    ) {
        this.id = id
        this.vault = vault
        this.adapter = adapter
        this.strat_name = strat_name
        this.strat_display_name = strat_display_name
        this.vault_name = vault_name
        this.vault_display_name = vault_display_name
        this.coin = coin
        this.metacoin = metacoin
        this.protocol = protocol
        this.active = active
    }
}

export class Vault_Adapter {
    id: string
    active: boolean
    token: string
    constructor(
        id: string,
        active: boolean,
        token: string
    ) {
        this.id = id
        this.active = active
        this.token = token
    }
}
