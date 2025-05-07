import { User } from "src/users/entities/user.entity";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
    @ApiProperty({ example: 'Engineering Team' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'Main engineering team' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    @IsOptional()
    currentCaptainId?: number;
}
