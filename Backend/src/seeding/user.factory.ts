import { User } from "../entities/user.entity";
import { fakerRU as faker } from "@faker-js/faker";
import { Role } from "../auth/types/role.enum";
import { setSeederFactory } from "typeorm-extension";

export const UserFactory = setSeederFactory(User, async () => {
    const user = new User()
    user.firstName = faker.person.firstName()
    user.lastName = faker.person.lastName()
    user.email = faker.internet.email()
    user.avatarUrl = faker.image.avatar()
    user.role = Role.USER
    user.password = faker.internet.password()

    return user
})