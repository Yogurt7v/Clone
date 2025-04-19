import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Form } from "./form.entity";
import { Comments } from "./comments.entity";
import * as bcrypt from "bcryptjs"
import { Role } from "../auth/types/role.enum";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column({ default: "" })
    avatarUrl: string

    @Column({ type: "enum", enum: Role, default: Role.USER })
    role: Role

    @Column()
    password: string

    @Column({ nullable: true })
    hashedRefreshToken: string

    @OneToMany(() => Form, (form) => form.author)
    forms: Form[];

    @OneToMany(() => Comments, (comment) => comment.author, { cascade: true, onDelete: "CASCADE" })
    comments: Comments[];

    @BeforeInsert() // функция которая выполняется перед отправкой пароля в базу. шифруем пароль. храним только зашифрованный!
    async hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }
}