import { Injectable } from '@nestjs/common';
import { CreateFormContentDto } from './dto/create-form-content.dto';
import { UpdateFormContentDto } from './dto/update-form-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Questions } from 'src/entities/questions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FormContentService {

  constructor(
    @InjectRepository(Questions) private formContentRepository: Repository<Questions>,
  ) { }
  async findAll() {
    const allFormsContent = await this.formContentRepository.find({
      order: { id: 'ASC' },
    });
    return { "message": "Получены все содержимое опроса", allFormsContent }
  }

  async create(createFormContentDto: CreateFormContentDto) {
    const newFormContent = await this.formContentRepository.save(createFormContentDto)
    return { "message": "Новая форма опроса создана", newFormContent }
  }


  async findOne(id: number) {
    const formContent = await this.formContentRepository.findOne({ where: { id: id } })
    return { "message": `${id} форма опроса найдена`, formContent }
  }

  async update(id: number, updateFormContentDto: UpdateFormContentDto) {
    this.formContentRepository.update(id, updateFormContentDto)
    const { formContent } = (await this.findOne(id))
    return { "message": `Форма опроса №${id} обновлена`, formContent }
  }

  remove(id: number) {
    this.formContentRepository.delete(id)
    return `Форма опроса ${id}`;
  }
}
