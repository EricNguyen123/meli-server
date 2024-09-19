import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserDto } from 'src/dto/user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: UserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  async updateUser(id: string, data: UserDto): Promise<UserEntity> {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException('User not found');

    user.name = data.name;
    user.email = data.email;
    user.roles = data.roles;
    user.isActive = data.isActive;
    return await this.usersRepository.save(user);
  }

  async updateName(id: string, newName: string): Promise<UserEntity> {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException('User not found');

    user.name = newName;
    return await this.usersRepository.save(user);
  }

  async updateEmail(id: string, newEmail: string): Promise<UserEntity> {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException('User not found');

    user.email = newEmail;
    return await this.usersRepository.save(user);
  }

  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return { status: 404, message: 'Match failed' };
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);

    return await this.usersRepository.save(user);
  }

  async findAllWithPagination(
    paginationDto: PaginationDto,
  ): Promise<UserEntity[]> {
    const { offset, limit } = paginationDto;

    return await this.usersRepository.find({
      skip: offset,
      take: limit,
      select: ['id', 'name', 'email', 'roles', 'isActive'],
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find({
      select: ['id', 'name', 'email', 'roles', 'isActive'],
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { email } });

    return user;
  }

  async findOneByUser(id: string): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOneOrFail({ where: { id } });
      delete user.password;
      delete user.createdDate;

      return user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findOneById(id: string): Promise<UserEntity> {
    try {
      return await this.usersRepository.findOneOrFail({ where: { id } });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
