import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { UsersService } from '../users/users.service';
import { TeamsRepository } from './teams.repository';
import { TeamsResponseDto } from './dto/teams-response.dto';

@Injectable()
export class TeamsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly teamsRepository: TeamsRepository,
  ) {}

  onModuleInit() {
    const initialTeams: CreateTeamDto[] = [
      {
        name: 'Engineering Team',
        description: 'Main engineering team',
        isActive: true,
        currentCaptainId: 1,
      },
      {
        name: 'Design Team',
        description: 'Product design team',
        isActive: true,
        currentCaptainId: 2,
      },
    ];
    this.teamsRepository.seed(initialTeams);
  }

  private toPartialUser(user: any) {
    if (!user) return undefined;
    return {
      id: user.id,
      name: user.name,
      role: user.role,
    };
  }

  private toTeamsResponseDto(team: Team): TeamsResponseDto {

    const currentCaptain = (() => {
      if (!team.currentCaptainId) return 'Not Assigned';
      try {
        return this.toPartialUser(this.usersService.findOne(team.currentCaptainId));
      } catch {
        return 'Not Assigned';
      }
    })();

    const members: any[] = (team.members || []).map(userId => {
      try {
        return this.toPartialUser(this.usersService.findOne(userId));
      } catch {
        return undefined;
      }
    }).filter(Boolean);

    return {
      teamName: team.name,
      teamId: team.id,
      teamDescription: team.description ?? '',
      isActive: team.isActive ?? true,
      totalMembers: members.length,
      currentCaptain,
      createdDate: team.createdDate,
      members,
    };
  }

  create(createTeamDto: CreateTeamDto) {
    const team = this.teamsRepository.create(createTeamDto);
    return this.toTeamsResponseDto(team);
  }

  findAll() {
    return this.teamsRepository.findAll().map(team => this.toTeamsResponseDto(team));
  }

  findOne(id: number) {
    const team = this.teamsRepository.findOne(id);
    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
    return this.toTeamsResponseDto(team);
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    const updatedTeam = this.teamsRepository.update(id, updateTeamDto);
    if (!updatedTeam) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
    return this.toTeamsResponseDto(updatedTeam);
  }

  remove(id: number) {
    const deletedTeam = this.teamsRepository.remove(id);
    if (!deletedTeam) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
    return this.toTeamsResponseDto(deletedTeam);
  }

  addMember(teamId: number, userId: number) {
    const teamEntity = this.teamsRepository.findOne(teamId);
    if (!teamEntity) {
      throw new NotFoundException(`Team with id ${teamId} not found`);
    }
    try {
      this.usersService.findOne(userId);
      if (!teamEntity.members) {
        teamEntity.members = [];
      }
      if (teamEntity.members.includes(userId)) {
        throw new Error(`User ${userId} is already a member of team ${teamId}`);
      }
      teamEntity.members.push(userId);
      this.teamsRepository.update(teamId, { members: teamEntity.members });
      const team = this.teamsRepository.findOne(teamId);
      if (!team) {
        throw new NotFoundException(`Team with id ${teamId} not found`);
      }
      return this.toTeamsResponseDto(team);
    } catch (error) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  }

  removeMember(teamId: number, userId: number) {
    const teamEntity = this.teamsRepository.findOne(teamId);
    if (!teamEntity) {
      throw new NotFoundException(`Team with id ${teamId} not found`);
    }
    try {
      this.usersService.findOne(userId);
      if (!teamEntity.members) {
        throw new NotFoundException(`No members in team with id ${teamId}`);
      }
      const memberIndex = teamEntity.members.indexOf(userId);
      if (memberIndex === -1) {
        throw new NotFoundException(`User ${userId} is not a member of team ${teamId}`);
      }
      teamEntity.members.splice(memberIndex, 1);
      this.teamsRepository.update(teamId, { members: teamEntity.members });
      const team = this.teamsRepository.findOne(teamId);
      if (!team) {
        throw new NotFoundException(`Team with id ${teamId} not found`);
      }
      return this.toTeamsResponseDto(team);
    } catch (error) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  }

  setCaptain(teamId: number, userId: number) {
    const teamEntity = this.teamsRepository.findOne(teamId);
    if (!teamEntity) {
      throw new NotFoundException(`Team with id ${teamId} not found`);
    }
    if (!teamEntity.members) {
      throw new Error(`No members in team with id ${teamId}`);
    }
    const memberIndex = teamEntity.members.indexOf(userId);
    if (memberIndex === -1) {
      throw new Error(`User with id ${userId} not found in team with id ${teamId}`);
    }
    teamEntity.currentCaptainId = userId;
    this.teamsRepository.update(teamId, { currentCaptainId: userId });
    const team = this.teamsRepository.findOne(teamId);
    if (!team) {
      throw new NotFoundException(`Team with id ${teamId} not found`);
    }
    return this.toTeamsResponseDto(team);
  }

  getMembers(teamId: number) {
    const team = this.teamsRepository.findOne(teamId);
    if (!team) {
      throw new NotFoundException(`Team with id ${teamId} not found`);
    }
    return (team.members || []).map(userId => {
      try {
        return this.toPartialUser(this.usersService.findOne(userId));
      } catch {
        return undefined;
      }
    }).filter(Boolean);
  }
}
