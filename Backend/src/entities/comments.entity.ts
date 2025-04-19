import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Questions } from "./questions.entity";

@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    id: number;

    // Связь с пользователем, который оставил ответ
    @ManyToOne(() => User, (user) => user.comments)
    author: User;

    // Связь с вопросом, на который дан ответ
    @ManyToOne(() => Questions, (question) => question.comments, {
        nullable: false,
    })
    question: Questions;

    @Column({ type: 'jsonb', nullable: true })
    answer: string | null;

    @Column('text', { array: true, nullable: true })
    selectedOptions?: number[] | null;


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
