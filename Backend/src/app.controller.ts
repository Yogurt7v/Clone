import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Form } from './entities/form.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Get()
  // getAllForms(): Form[] | string {
  //   return this.appService.getAllForms();
  // }
}
