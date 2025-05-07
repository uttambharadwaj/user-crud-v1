import { User } from '../../users/entities/user.entity';

export class TeamsResponseDto {
    teamName: string;
    teamId: number;
    teamDescription: string;
    isActive: boolean;
    totalMembers: number;
    currentCaptain?: Partial<User> | 'Not Assigned';
    createdDate: Date;
    members: Partial<User>[];
}