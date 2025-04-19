import { PartialType } from '@nestjs/mapped-types';
import { CreateFormContentDto } from './create-form-content.dto';

export class UpdateFormContentDto extends PartialType(CreateFormContentDto) {}
