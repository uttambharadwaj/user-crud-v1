import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    name: string;

    @ApiProperty({ example: 'test@test.com', description: 'Email address of the user' })
    email: string;

    @ApiProperty({ example: 'admin', enum: ['admin', 'user'], description: 'Role of the user, either admin or user' })
    role: string;

    @ApiProperty({ example: true, description: 'Whether the user is active' })
    isActive: boolean;
}