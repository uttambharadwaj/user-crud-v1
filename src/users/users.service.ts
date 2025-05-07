import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async onModuleInit() {
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
    await Promise.all(initialUsers.map(user => this.create(user)));
  }

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async findAll({ page = 1, limit = 10, sortBy = 'id', sortOrder = 'asc' }: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}) {
    let users = this.usersRepository.findAll();
    // Sorting
    if (sortBy) {
      users = users.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    // Pagination
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit);
    const paginated = users.slice(start, end);
    return {
      data: paginated,
      total: users.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(users.length / Number(limit)),
    };
  }

  async findOne(id: number) {
    const user = this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = this.usersRepository.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: number) {
    const deletedUser = this.usersRepository.remove(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return deletedUser;
  }
}
