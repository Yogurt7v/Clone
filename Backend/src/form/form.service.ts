import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Form } from 'src/entities/form.entity';
import { DataSource, EntityManager, ILike, In, Like, Not, Repository } from 'typeorm';
import { Questions } from 'src/entities/questions.entity';
import { PaginationDto } from './dto/pagination.dto';
import { User } from 'src/entities/user.entity';
import { SearchParamsDto } from './dto/search-params.dto';
import { Comments } from 'src/entities/comments.entity';

@Injectable()
export class FormService {

  constructor(
    @InjectRepository(Form) private formRepository: Repository<Form>,
    @InjectRepository(Questions) private formContentRepository: Repository<Questions>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Comments) private commentsRepository: Repository<Comments>,
    @InjectEntityManager() private readonly manager: EntityManager,
    private dataSource: DataSource
  ) { }



  async findAllPagination(
    paginationDto: PaginationDto,
    searchParams: SearchParamsDto,
  ) {
    if (!searchParams) {
      const allForms = await this.formRepository.find({
        skip: paginationDto.skip,
        take: paginationDto.limit ?? process.env.DEFAULT_PAGE_SIZE,
        order: {
          createdAt: "ASC",
        },
        relations: ["author"],
      })
      return { "message": "Получены все формы", "AllForms": allForms }
    }

    const allForms = await this.formRepository.find({
      skip: paginationDto.skip,
      take: paginationDto.limit ?? process.env.DEFAULT_PAGE_SIZE,
      order: {
        id: searchParams.searchOrder ?? "ASC",//+
        createdAt: searchParams.createdAt ?? "ASC", //+
      },
      relations: ["author", "questions.comments"],
      where:
      {
        ...((searchParams.searchTitle && searchParams.searchTitle.trim() !== "") ?
          { title: ILike(`%${searchParams.searchTitle}%`) } : {}),
        ...(searchParams.authorId && { author: { id: searchParams.authorId } })
      }
    })
    return { "message": "Получены все формы", "AllForms": allForms }
  }

  async findAll() {
    const allForms = await this.formRepository.find({
      order: { id: 'ASC' }, relations: ["questions"]
    });
    return { "message": "Получены все формы", allForms }
  }

  async findOneById(id: number) {
    const form = await this.formRepository.findOne({
      where: { id: id },
      relations: ["author", "questions", "questions.comments", "questions.comments.author"]
    });
    if (!form) throw new NotFoundException(`Форма с id: ${id} не найдена`);

    const result = {
      ...form, author: {
        id: form.author.id,
        firstName: form.author.firstName,
        lastName: form.author.lastName,
        email: form.author.email,
        avatarUrl: form.author.avatarUrl,
        role: form.author.role,
      }
    };

    return {
      message: `Форма с id: ${id} найдена`,
      SingleForm: result
    };
  }


  async create(createFormDto: CreateFormDto) {
    const newForm = new Form();
    const user = await this.userRepository.findOne({ where: { id: createFormDto.author } })
    newForm.title = createFormDto.title;
    newForm.author = user!;
    newForm.questions = createFormDto.questions.map(questionDto => {
      const question = new Questions();
      question.question = questionDto.question;
      question.options = questionDto.options;
      question.type = questionDto.type;
      return question;
    });
    const res = await this.formRepository.save(newForm);

    return { "message": "Вы создали форму", "Новая форма": res };
  }

  async update(id: number, updateFormDto: UpdateFormDto) {

    return await this.manager.transaction(async transactionalEntityManager => {
      // 1просто обновляем данные формы без вопросов и вариантов
      await transactionalEntityManager.update(
        Form,
        { id: id },
        {
          title: updateFormDto.title,
          author: updateFormDto.author,
          updatedAt: new Date().toISOString()
        }
      );

      const questionsArray = Array.isArray(updateFormDto.questions)
        ? updateFormDto.questions
        : [updateFormDto.questions];

      const existingQuestions = await transactionalEntityManager.find(Questions, {
        where: { form: { id: updateFormDto.id } },
        select: ['id']
      });

      // фильтрация id. чтобы выявить те которые существуют
      const incomingQuestionIds = questionsArray
        .map(q => q.id)
        .filter((id): id is number => id !== undefined);


      // Удаляем вопросы, которых нет
      if (existingQuestions.length > 0) {
        await transactionalEntityManager.delete(Questions, {
          form: { id: updateFormDto.id },
          ...(incomingQuestionIds.length > 0 && {
            id: Not(In(incomingQuestionIds))
          })
        });
      }

      // проход по каждому отдельному запросу
      for (const questionDto of questionsArray) {
        if (questionDto.id) {
          // обновление
          await transactionalEntityManager.update(
            Questions,
            { id: questionDto.id, form: { id: updateFormDto.id } },
            {
              question: questionDto.question,
              options: questionDto.options,
              type: questionDto.type
            }
          );
        } else {
          // новый вопрос
          await transactionalEntityManager.save(Questions, {
            question: questionDto.question,
            options: questionDto.options,
            type: questionDto.type,
            form: { id: updateFormDto.id },
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }

      const res = await transactionalEntityManager.findOne(Form, {
        where: { id: updateFormDto.id },
        relations: ['questions'],
      });
      return { "message": "Форма успешно изменена", "Измененная форма": res };
    });
  }

  async delete(id: number): Promise<void> {
    await this.formRepository.manager.transaction(async (manager: EntityManager) => {

      await manager.createQueryBuilder()
        .delete()
        .from(Comments)
        .where('"questionId" IN (SELECT id FROM questions WHERE "formId" = :id)', { id })
        .execute();


      await manager.delete(Questions, { form: { id } });


      await manager.delete(Form, id);
    });
  }



}
