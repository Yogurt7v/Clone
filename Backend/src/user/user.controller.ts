import { Body, Controller, Delete, Get, Param, Patch, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from '../auth/types/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guards';


@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get("profile/:id")
    getProfile(@Param("id") id: string) {
        return this.userService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Post("profile/:id")
    updateProfile(@Param("id") id: string, @Body() dto: UpdateUserDto) {
        return this.userService.updateProfile(+id, dto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Delete("profile/:id")
    remove(@Param("id") id: string) {
        return this.userService.remove(+id);
    }
}
