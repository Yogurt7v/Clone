import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SearchParamsDto } from './dto/search-params.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/types/role.enum';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) { }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.formService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post("/pagination")
  findAllPagination(
    @Query() paginationDto: PaginationDto,
    @Body() searchParams: SearchParamsDto
  ) {
    return this.formService.findAllPagination(
      paginationDto,
      searchParams
    );
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formService.findOneById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createFormDto: CreateFormDto) {
    return this.formService.create(createFormDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.update(+id, updateFormDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formService.delete(+id);
  }
}
