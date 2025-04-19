import { Module } from '@nestjs/common';
import { FormContentService } from './form-content.service';
import { FormContentController } from './form-content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questions } from 'src/entities/questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questions])],
  controllers: [FormContentController],
  providers: [FormContentService],
})
export class FormContentModule { }
