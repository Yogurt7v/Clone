import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Questions } from "./questions.entity";
import { User } from "./user.entity";

@Entity()
export class Form {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.forms)
    author: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ default: "" })
    title: string;

    @OneToMany(() => Questions, (questions) => questions.form, { cascade: true, onDelete: "CASCADE" })
    questions: Questions[];
}