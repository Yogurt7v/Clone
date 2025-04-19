import { Form } from "../entities/form.entity"
import { fakerRU as faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension"


export const FormFactory = setSeederFactory(Form, () => {

    const form = new Form();
    form.title = faker.lorem.paragraph();
    form.createdAt = faker.date.past();
    form.updatedAt = faker.date.recent();
    return form;

})