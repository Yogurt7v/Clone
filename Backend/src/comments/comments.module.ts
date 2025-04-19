import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/entities/comments.entity';
import { User } from 'src/entities/user.entity';
import { Questions } from 'src/entities/questions.entity';
import { Form } from 'src/entities/form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, Form, Questions, User])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule { }
