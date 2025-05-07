import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
    @ApiPropertyOptional({ type: [Number], example: [1, 2], description: 'Array of user IDs who are members of the team' })
    members?: number[];
    @ApiPropertyOptional({ example: 1, description: 'Unique identifier for the team' })
    id?: number;
}
