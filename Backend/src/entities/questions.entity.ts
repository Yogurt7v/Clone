import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Form } from "./form.entity";
import { Comments } from "./comments.entity";

@Entity()
export class Questions {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    question: string

    @Column('text', { array: true })
    options: string[]

    @Column('text', { nullable: true })
    type: string

    @ManyToOne(() => Form, (form) => form.questions)
    @JoinColumn({ name: 'formId' })
    form: Form;

    @OneToMany(() => Comments, (comment) => comment.question)
    comments: Comments[];

}