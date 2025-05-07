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

  private getTeamOrThrow(id: number): Team {
    const team = this.teamsRepository.findOne(id);
    if (!team) throw new NotFoundException(`Team with id ${id} not found`);
    return team;
  }

  private getUserOrThrow(id: number) {
    try {
      return this.usersService.findOne(id);
    } catch {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private toPartialUser(user: any) {
    if (!user) return undefined;
    return { id: user.id, name: user.name, role: user.role };
  }

  private toTeamsResponseDto(team: Team, request: string): TeamsResponseDto {
    const currentCaptain = team.currentCaptainId
      ? this.toPartialUser(this.usersService.findOne(team.currentCaptainId)) || 'Not Assigned'
      : 'Not Assigned';
    const members = (team.members || [])
      .map(userId => this.toPartialUser(this.usersService.findOne(userId)))
      .filter((u): u is { id: any; name: any; role: any } => Boolean(u));
    if (request === 'addMember' || request === 'removeMember') {
      return {
        teamName: team.name,
        teamId: team.id,
        totalMembers: members.length,
        members,
      }};
    if (request === 'setCaptain') {
      return {
        teamName: team.name,
        teamId: team.id,
        totalMembers: members.length,
        currentCaptain,
      }};
    if (request === 'findAll') {
      return {
        teamName: team.name,
        teamId: team.id,
        teamDescription: team.description,
        isActive: team.isActive,
        totalMembers: members.length,
        currentCaptain,
        createdDate: team.createdDate,
      };
    }
    else {
      return {
        teamName: team.name,
        teamId: team.id,
        teamDescription: team.description,
        isActive: team.isActive,
        totalMembers: members.length,
        currentCaptain,
        createdDate: team.createdDate,
        members,
      };
  }};

  create(createTeamDto: CreateTeamDto) {
    return this.toTeamsResponseDto(this.teamsRepository.create(createTeamDto), 'create');
  }

  findAll({ page = 1, limit = 10, sortBy = 'id', sortOrder = 'asc' }: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}) {
    let teams = this.teamsRepository.findAll();
    // Sorting
    if (sortBy) {
      teams = teams.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    // Pagination
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit);
    const paginated = teams.slice(start, end);
    return {
      data: paginated.map(team => this.toTeamsResponseDto(team, 'findAll')),
      total: teams.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(teams.length / Number(limit)),
    };
  }

  findOne(id: number) {
    return this.toTeamsResponseDto(this.getTeamOrThrow(id), 'findOne');
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    const updatedTeam = this.teamsRepository.update(id, updateTeamDto);
    if (!updatedTeam) throw new NotFoundException(`Team with id ${id} not found`);
    return this.toTeamsResponseDto(updatedTeam, 'update');
  }

  remove(id: number) {
    const deletedTeam = this.teamsRepository.remove(id);
    if (!deletedTeam) throw new NotFoundException(`Team with id ${id} not found`);
    return this.toTeamsResponseDto(deletedTeam, 'remove');
  }

  addMember(teamId: number, userId: number) {
    const team = this.getTeamOrThrow(teamId);
    this.getUserOrThrow(userId);
    team.members = team.members || [];
    if (team.members.includes(userId)) {
      throw new NotFoundException(`User ${userId} is already a member of team ${teamId}`);
    }
    team.members.push(userId);
    this.teamsRepository.update(teamId, { members: team.members });
    return this.toTeamsResponseDto(this.getTeamOrThrow(teamId), 'addMember');
  }

  removeMember(teamId: number, userId: number) {
    const team = this.getTeamOrThrow(teamId);
    this.getUserOrThrow(userId);
    if (!team.members?.length) {
      throw new NotFoundException(`No members in team with id ${teamId}`);
    }
    const idx = team.members.indexOf(userId);
    if (idx === -1) {
      throw new NotFoundException(`User ${userId} is not a member of team ${teamId}`);
    }
    team.members.splice(idx, 1);
    this.teamsRepository.update(teamId, { members: team.members });
    return this.toTeamsResponseDto(this.getTeamOrThrow(teamId), 'removeMember');
  }

  setCaptain(teamId: number, userId: number) {
    const team = this.getTeamOrThrow(teamId);
    if (!team.members?.length) {
      throw new NotFoundException(`No members in team with id ${teamId}`);
    }
    if (!team.members.includes(userId)) {
      throw new NotFoundException(`User with id ${userId} not found in team with id ${teamId}`);
    }
    team.currentCaptainId = userId;
    this.teamsRepository.update(teamId, { currentCaptainId: userId });
    return this.toTeamsResponseDto(this.getTeamOrThrow(teamId), 'setCaptain');
  }

  getMembers(teamId: number) {
    const team = this.getTeamOrThrow(teamId);
    return (team.members || [])
      .map(userId => this.toPartialUser(this.usersService.findOne(userId)))
      .filter((u): u is { id: any; name: any; role: any } => Boolean(u));
  }
}
