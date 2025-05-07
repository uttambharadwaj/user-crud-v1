import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: 'test@test.com' })
    email: string;

    @ApiProperty({ example: 'admin', enum: ['admin', 'user'] })
    role: string;

    @ApiProperty({ example: true })
    isActive: boolean;
}