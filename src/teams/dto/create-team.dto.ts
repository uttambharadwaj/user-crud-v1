import { User } from "src/users/entities/user.entity";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
    @ApiProperty({ example: 'Engineering Team', description: 'Name of the team' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'Main engineering team', description: 'Description of the team' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: true, description: 'Whether the team is active' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ example: 1, description: 'User ID of the current captain' })
    @IsNumber()
    @IsOptional()
    currentCaptainId?: number;
}
