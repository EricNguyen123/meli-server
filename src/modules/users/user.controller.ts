import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserDto } from 'src/dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get('account')
  @UseGuards(JwtAuthGuard)
  getUser(@Query() { id }: { id: string }): Promise<UserEntity> {
    return this.usersService.findOneByUser(id);
  }

  @Post('update/username')
  @UseGuards(JwtAuthGuard)
  updateUsername(
    @Query() { id }: { id: string },
    @Body('name') name: string,
  ): Promise<UserEntity> {
    return this.usersService.updateName(id, name);
  }

  @Post('update/email')
  @UseGuards(JwtAuthGuard)
  updateEmail(
    @Query() { id }: { id: string },
    @Body('email') email: string,
  ): Promise<UserEntity> {
    return this.usersService.updateEmail(id, email);
  }

  @Post('update/user')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Query() { id }: { id: string },
    @Body() data: UserDto,
  ): Promise<UserEntity> {
    return this.usersService.updateUser(id, data);
  }
}
