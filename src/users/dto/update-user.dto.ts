import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({ example: 1 })
    id: number;

    @ApiPropertyOptional({ example: 'John Doe' })
    name?: string | undefined;

    @ApiPropertyOptional({ example: 'test@test.com' })
    email?: string | undefined;

    @ApiPropertyOptional({ example: 'admin', enum: ['admin', 'user'] })
    role?: string | undefined;

    @ApiPropertyOptional({ example: true })
    isActive?: boolean | undefined;
}
