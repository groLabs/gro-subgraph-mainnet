import { User } from "../../generated/schema"

const setUser = (userAddress: string): User => {
    let user = User.load(userAddress)
    if (!user) {
      user = new User(userAddress)
      user.save()
    }
    return user
}

export {
    setUser
}
