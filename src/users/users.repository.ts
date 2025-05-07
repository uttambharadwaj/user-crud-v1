import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  private users: Record<number, User> = {};
  private nextId = 1;

  seed(initialUsers: CreateUserDto[]) {
    initialUsers.forEach(user => this.create(user));
  }

  create(createUserDto: CreateUserDto): User {
    const id = this.nextId++;
    const newUser: User = {
      id,
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users[id] = newUser;
    return newUser;
  }

  findAll(): User[] {
    return Object.values(this.users);
  }

  findOne(id: number): User | undefined {
    return this.users[id];
  }

  update(id: number, updateUserDto: UpdateUserDto): User | undefined {
    const user = this.users[id];
    if (!user) return undefined;
    const updatedUser = { ...user, ...updateUserDto, updatedAt: new Date() };
    this.users[id] = updatedUser;
    return updatedUser;
  }

  remove(id: number): User | undefined {
    const user = this.users[id];
    if (!user) return undefined;
    delete this.users[id];
    return user;
  }
}
