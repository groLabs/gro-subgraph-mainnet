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
    name: string
    displayName: string
    active: boolean
    constructor(
        id: string,
        vault: string,
        adapter: string,
        name: string,
        displayName: string,
        active: boolean,
    ) {
        this.id = id
        this.vault = vault
        this.adapter = adapter
        this.name = name
        this.displayName = displayName
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
