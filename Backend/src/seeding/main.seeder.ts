import { Comments } from "../entities/comments.entity";
import { Questions } from "../entities/questions.entity";
import { Form } from "../entities/form.entity";
import { User } from "../entities/user.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Role } from "../auth/types/role.enum";
import { fakerRU as faker } from "@faker-js/faker";
import * as dotenv from 'dotenv';
dotenv.config();

console.log("Начнём сидирование данных !")

let howManyUsers: number = 45
export class MainSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {

        console.log('⏳ Начало заполнения базы данных...');

        const userFactory = factoryManager.get(User);
        const formFactory = factoryManager.get(Form);
        const questionFactory = factoryManager.get(Questions);
        const commentFactory = factoryManager.get(Comments);

        const anonym = await userFactory.make({
            firstName: 'Anonym',
            lastName: 'User',
            email: 'anonym@anonym.com',
            role: Role.USER,
            password: 'anonym'
        });
        await userFactory.save(anonym);

        console.log("✅ Анонимный пользователь создан ");

        const admin = await userFactory.make({
            firstName: 'Admin',
            lastName: 'System',
            email: process.env.ADMIN_EMAIL || "not-try-email@com.com", 
            role: Role.ADMIN,
            password: process.env.ADMIN_PASSWORD || "not-try-password"
        });
        await userFactory.save(admin);

        console.log("✅ Администратор создан ");

        const users = await userFactory.saveMany(howManyUsers);
        console.log(`✅ Создано ${howManyUsers} пользователей`);

        const formsPromises = users.flatMap(user =>
            Array.from({
                length: Math.floor(Math.random() * 3) + 1
            }).map(async () => {
                const form = await formFactory.make({ author: user });
                return formFactory.save(form);
            })
        );
        const forms = await Promise.all(formsPromises);
        console.log(`✅ Создано ${forms.length} форм`);

        const questionsPromises = forms.flatMap(form =>
            Array.from({
                length: Math.floor(Math.random() * 3) + 1 // 1-3 вопросов
            }).map(async () => {
                const question = await questionFactory.make({ form });
                return questionFactory.save(question);
            })
        );
        const questions = await Promise.all(questionsPromises);
        console.log(`✅ Создано ${questions.length} вопросов`);

        let commentsCount = 0;
        for (const question of questions) {
            const commentsToCreate = Math.floor(Math.random() * 2) + 1;
            const author = users[Math.floor(Math.random() * users.length)];

            for (let i = 0; i < commentsToCreate; i++) {
                if (question.type === "text" || question.type === "textarea") {
                    const comment = await commentFactory.save({
                        question: question,
                        author: author,
                        answer: faker.lorem.sentence()
                    });

                } else {
                    const comment = await commentFactory.make({
                        question: question,
                        author: author,
                        selectedOptions: [0]
                    });
                    await commentFactory.save(comment);
                    commentsCount++;
                }

            }
        }
        console.log(`✅ Создано ${commentsCount} комментариев`);
        console.log('🎉 База данных успешно заполнена!');
    }
}