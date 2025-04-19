import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { EntityManager, Repository } from 'typeorm';
import { Comments } from 'src/entities/comments.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Form } from 'src/entities/form.entity';
import { Questions } from 'src/entities/questions.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(Form) private formRepository: Repository<Form>,
    @InjectRepository(Questions) private formContentRepository: Repository<Questions>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Comments) private commentsRepository: Repository<Comments>,
    @InjectEntityManager() private readonly manager: EntityManager
  ) { }

  async createAnswer(createCommentDto: CreateCommentDto) {
    const author = await this.userRepository.findOne({ where: { id: createCommentDto.userId } })
    const question = await this.formContentRepository.findOne({ where: { id: createCommentDto.questionId } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const comment = new Comments();
    comment.answer = createCommentDto.data.answer;
    comment.selectedOptions = createCommentDto.data.selectedOptions as number[];
    comment.question = question;
    comment.author = author!;

    const savedComment = await this.commentsRepository.save(comment);
    const savedCommentWithRelations = await this.commentsRepository.findOne({
      where: { id: savedComment.id },
      relations: ['author', 'question']
    });

    return { message: "Ответ создан", comment: savedCommentWithRelations }

  }

  // findAll() {
  //   return `This action returns all comments`;
  // }

  async findOne(id: number) {
    const res = await this.commentsRepository.findOne({ where: { id: id }, relations: ['author'] });

    if (!res) throw new NotFoundException(`Ответ с таким ${id} не найден`);
    const editedRes = {
      ...res, author: {
        id: res.author.id,
        firstName: res.author.firstName,
        lastName: res.author.lastName,
        avatarUrl: res.author.avatarUrl,
        role: res.author.role,

      }
    }
    return editedRes
  }

  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }

  async remove(commentId: number) {
    await this.manager.delete(Comments, commentId);
    return `Ответ под номером №#${commentId} удалён`;
  }
}
