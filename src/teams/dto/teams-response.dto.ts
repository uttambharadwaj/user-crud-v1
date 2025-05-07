import { User } from '../../users/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TeamsResponseDto {
    @ApiProperty({ example: 'Engineering Team', description: 'Name of the team' })
    teamName: string;

    @ApiProperty({ example: 1, description: 'Unique identifier for the team' })
    teamId: number;

    @ApiPropertyOptional({ example: 'Main engineering team', description: 'Description of the team' })
    teamDescription?: string;

    @ApiPropertyOptional({ example: true, description: 'Whether the team is active' })
    isActive?: boolean;

    @ApiProperty({ example: 5, description: 'Total number of members in the team' })
    totalMembers: number;

    @ApiPropertyOptional({ description: 'Current captain of the team (partial user object) or Not Assigned', example: { id: 1, name: 'John Doe', role: 'admin' } })
    currentCaptain?: Partial<User> | 'Not Assigned';

    @ApiPropertyOptional({ example: '2024-05-07T12:00:00.000Z', description: 'Date when the team was created' })
    createdDate?: Date;

    @ApiPropertyOptional({ type: [Object], description: 'List of team members (partial user objects)', example: [{ id: 1, name: 'John Doe', role: 'admin' }] })
    members?: Partial<User>[];
}