import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  onModuleInit() {
    const initialUsers: CreateUserDto[] = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        isActive: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        isActive: true
      },
    ];
    this.usersRepository.seed(initialUsers);
  }

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  findOne(id: number) {
    const user = this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = this.usersRepository.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  remove(id: number) {
    const deletedUser = this.usersRepository.remove(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return deletedUser;
  }
}
