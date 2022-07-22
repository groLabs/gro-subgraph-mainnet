import { User } from "../../generated/schema"

export const setUser = (userAddress: string): User => {
    let user = User.load(userAddress)
    if (!user) {
      user = new User(userAddress)
      user.save()
    }
    return user
}
