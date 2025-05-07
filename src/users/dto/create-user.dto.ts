import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'test@test.com', description: 'Email address of the user' })
    @IsNotEmpty()
    @IsEmail()
    email: string;


    @ApiProperty({ example: 'admin', enum: ['admin', 'user'], description: 'Role of the user, either admin or user' })
    @IsNotEmpty()
    @IsString()
    role: string;

    @ApiProperty({ example: true, description: 'Whether the user is active' })
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;
}