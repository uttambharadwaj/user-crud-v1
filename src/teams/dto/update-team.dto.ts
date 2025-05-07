import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
    @ApiPropertyOptional({ type: [Number] })
    members?: number[];
    @ApiPropertyOptional({ example: 1 })
    id?: number;
}
