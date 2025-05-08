import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiSecurity } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersResponseDto } from './dto/users-response.dto';

@ApiTags('users')
@ApiSecurity('x-api-key')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ description: 'User creation payload', type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UsersResponseDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated and sorted list of users' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'name', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'asc', description: 'Sort order: asc or desc' })
  @ApiResponse({ status: 200, description: 'Paginated list of users', schema: {
    example: {
      data: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          isActive: true,
          createdAt: '2025-05-07T12:00:00.000Z',
          updatedAt: '2025-05-07T12:00:00.000Z'
        }
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1
    }
  } })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return await this.usersService.findAll({ page, limit, sortBy, sortOrder });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User details', type: UsersResponseDto })
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({ description: 'User update payload', type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated', type: UsersResponseDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 204, description: 'User deleted', type: UsersResponseDto })
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
