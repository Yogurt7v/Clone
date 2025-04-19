import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FormContentService } from './form-content.service';
import { CreateFormContentDto } from './dto/create-form-content.dto';
import { UpdateFormContentDto } from './dto/update-form-content.dto';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Role } from 'src/auth/types/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('modal-content')
export class FormContentController {
  constructor(private readonly formContentService: FormContentService) { }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.formContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formContentService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createFormContentDto: CreateFormContentDto) {
    return this.formContentService.create(createFormContentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateFormContentDto: UpdateFormContentDto) {
    return this.formContentService.update(id, updateFormContentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formContentService.remove(+id);
  }
}
