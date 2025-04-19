import { setSeederFactory } from "typeorm-extension"
import { fakerRU as faker } from "@faker-js/faker";
import { Comments } from "../entities/comments.entity"

export const CommentFactory = setSeederFactory(Comments, () => {

    const comment = new Comments();

    comment.createdAt = faker.date.past();
    comment.updatedAt = faker.date.between({
        from: comment.createdAt,
        to: new Date()
    });
    return comment;
});