import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';


@Injectable()
export class UserService {
    //здесь идёт обращение к функциям самой базы данных
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async findAll() {
        return await this.userRepository.find();
    }

    async findOne(id: number) {
        const res = await this.userRepository.findOne({
            where: {
                id
            },
            select: ["id", "firstName", "lastName", "avatarUrl", "hashedRefreshToken", "role"]
        });
        if (!res) throw new NotFoundException(`Пользователь с таким ${id} не найден`);
        return res;
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email: email } });
    }


    async create(dto: CreateUserDto) {
        const findUser = await this.userRepository.findOne({ where: { email: dto.email } });
        if (findUser) return { user: null, message: "Пользователь с таким email существует" }
        const user = await this.userRepository.create(dto) //такой порядок именно из-за шифрования, проще было сразу сохранить
        await this.userRepository.save(user);
        return { message: "Пользователь создан", user }
    }

    async updateProfile(id: number, dto: UpdateUserDto) {
        // Если avatarUrl равен null, устанавливаем пустую строку
        const updateData = {
            ...dto,
            avatarUrl: dto.avatarUrl === null ? "" : dto.avatarUrl
        };
        
        await this.userRepository.update({ id: id }, updateData);
        const user = await this.findOne(id);
        return { message: "Пользователь изменён", user }
    }

    async remove(id: number) {

        this.userRepository.delete({ id })
        return { message: `Пользователь ${id} удалён` }
    }

    async updateHashedReferenceToken(userId: number, referenceToken: string) {
        return await this.userRepository.update({ id: userId }, { hashedRefreshToken: referenceToken })
    }

    async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
        return await this.userRepository.update({ id: userId }, { hashedRefreshToken });
    }
}