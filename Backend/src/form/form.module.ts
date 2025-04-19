import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from 'src/entities/form.entity';
import { Questions } from 'src/entities/questions.entity';
import { User } from 'src/entities/user.entity';
import { Comments } from 'src/entities/comments.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Form, Questions, User, Comments])],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule { }

