import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { FormModule } from './form/form.module';
import { FormContentModule } from './form-content/form-content.module';
import { CommentsModule } from './comments/comments.module';
import dbConfig from './config/dbСonfig';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, ConfigModule.forRoot({
    isGlobal: true, // подключает env фаил
    expandVariables: true, //  подключает использование переменных в env файлах
    load: [dbConfig],
  }),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig
    }),
    FormModule,
    FormContentModule,
    CommentsModule,
    AuthModule

  ],// сюда добавлять новые модули
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
