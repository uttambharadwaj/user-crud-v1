import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({ example: 1, description: 'Unique identifier for the user' })
    id: number;

    @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the user' })
    name?: string | undefined;

    @ApiPropertyOptional({ example: 'test@test.com', description: 'Email address of the user' })
    email?: string | undefined;

    @ApiPropertyOptional({ example: 'admin', enum: ['admin', 'user'], description: 'Role of the user, either admin or user' })
    role?: string | undefined;

    @ApiPropertyOptional({ example: true, description: 'Whether the user is active' })
    isActive?: boolean | undefined;
}
