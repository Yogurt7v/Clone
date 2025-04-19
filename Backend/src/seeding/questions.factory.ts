import { Questions } from "../entities/questions.entity";
import { fakerRU as faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";


export const QuestionType = {
    TEXT: "text",
    MULTIPLE: "multiple-choice",
    CHECKBOX: "checkbox",
    TEXTAREA: "textarea"
}

export const QuestionsFactory = setSeederFactory(Questions, () => {
    const question = new Questions();
    const type = faker.helpers.arrayElement([
        QuestionType.TEXT,
        QuestionType.MULTIPLE,
        QuestionType.CHECKBOX,
        QuestionType.TEXTAREA
    ]);

    question.question = faker.lorem.sentence();
    question.type = type;

    if (type !== QuestionType.TEXT && type !== QuestionType.TEXTAREA) {
        const optionsCount = faker.number.int({ min: 2, max: 5 });
        question.options = Array.from({ length: optionsCount }, () =>
            `${faker.lorem.word()}`
        );
    } else {
        question.options = [];
    }

    return question;
})