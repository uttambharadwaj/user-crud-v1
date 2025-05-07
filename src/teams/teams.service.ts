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

  async onModuleInit() {
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
    await Promise.all(initialTeams.map(team => this.create(team)));
  }

  private async getTeamOrThrow(id: number): Promise<Team> {
    const team = this.teamsRepository.findOne(id);
    if (!team) throw new NotFoundException(`Team with id ${id} not found`);
    return team;
  }

  private async getUserOrThrow(id: number) {
    try {
      return await this.usersService.findOne(id);
    } catch {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private toPartialUser(user: any) {
    if (!user) return undefined;
    return { id: user.id, name: user.name, role: user.role };
  }

  private async toTeamsResponseDto(team: Team, request: string): Promise<TeamsResponseDto> {
    const currentCaptain = team.currentCaptainId
      ? this.toPartialUser(await this.usersService.findOne(team.currentCaptainId)) || 'Not Assigned'
      : 'Not Assigned';
    const members = (team.members || [])
      ? await Promise.all(
          team.members.map(async userId => this.toPartialUser(await this.usersService.findOne(userId)))
        )
      : [];
    const filteredMembers = members.filter((u): u is { id: any; name: any; role: any } => Boolean(u));
    if (request === 'addMember' || request === 'removeMember') {
      return {
        teamName: team.name,
        teamId: team.id,
        totalMembers: filteredMembers.length,
        members: filteredMembers,
      };
    }
    if (request === 'setCaptain') {
      return {
        teamName: team.name,
        teamId: team.id,
        totalMembers: filteredMembers.length,
        currentCaptain,
      };
    }
    if (request === 'findAll') {
      return {
        teamName: team.name,
        teamId: team.id,
        teamDescription: team.description,
        isActive: team.isActive,
        totalMembers: filteredMembers.length,
        currentCaptain,
        createdDate: team.createdDate,
      };
    } else {
      return {
        teamName: team.name,
        teamId: team.id,
        teamDescription: team.description,
        isActive: team.isActive,
        totalMembers: filteredMembers.length,
        currentCaptain,
        createdDate: team.createdDate,
        members: filteredMembers,
      };
    }
  }

  async create(createTeamDto: CreateTeamDto) {
    return await this.toTeamsResponseDto(await this.teamsRepository.create(createTeamDto), 'create');
  }

  async findAll({ page = 1, limit = 10, sortBy = 'id', sortOrder = 'asc' }: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}) {
    let teams = this.teamsRepository.findAll();
    if (sortBy) {
      teams = teams.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit);
    const paginated = teams.slice(start, end);
    return {
      data: await Promise.all(paginated.map(team => this.toTeamsResponseDto(team, 'findAll'))),
      total: teams.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(teams.length / Number(limit)),
    };
  }

  async findOne(id: number) {
    return await this.toTeamsResponseDto(await this.getTeamOrThrow(id), 'findOne');
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const updatedTeam = this.teamsRepository.update(id, updateTeamDto);
    if (!updatedTeam) throw new NotFoundException(`Team with id ${id} not found`);
    return await this.toTeamsResponseDto(updatedTeam, 'update');
  }

  async remove(id: number) {
    const deletedTeam = this.teamsRepository.remove(id);
    if (!deletedTeam) throw new NotFoundException(`Team with id ${id} not found`);
    return await this.toTeamsResponseDto(deletedTeam, 'remove');
  }

  async addMember(teamId: number, userId: number) {
    const team = await this.getTeamOrThrow(teamId);
    await this.getUserOrThrow(userId);
    team.members = team.members || [];
    if (team.members.includes(userId)) {
      throw new NotFoundException(`User ${userId} is already a member of team ${teamId}`);
    }
    team.members.push(userId);
    this.teamsRepository.update(teamId, { members: team.members });
    return await this.toTeamsResponseDto(await this.getTeamOrThrow(teamId), 'addMember');
  }

  async removeMember(teamId: number, userId: number) {
    const team = await this.getTeamOrThrow(teamId);
    await this.getUserOrThrow(userId);
    if (!team.members?.length) {
      throw new NotFoundException(`No members in team with id ${teamId}`);
    }
    const idx = team.members.indexOf(userId);
    if (idx === -1) {
      throw new NotFoundException(`User ${userId} is not a member of team ${teamId}`);
    }
    team.members.splice(idx, 1);
    this.teamsRepository.update(teamId, { members: team.members });
    return await this.toTeamsResponseDto(await this.getTeamOrThrow(teamId), 'removeMember');
  }

  async setCaptain(teamId: number, userId: number) {
    const team = await this.getTeamOrThrow(teamId);
    if (!team.members?.length) {
      throw new NotFoundException(`No members in team with id ${teamId}`);
    }
    if (!team.members.includes(userId)) {
      throw new NotFoundException(`User with id ${userId} not found in team with id ${teamId}`);
    }
    team.currentCaptainId = userId;
    this.teamsRepository.update(teamId, { currentCaptainId: userId });
    return await this.toTeamsResponseDto(await this.getTeamOrThrow(teamId), 'setCaptain');
  }

  async getMembers(teamId: number) {
    const team = await this.getTeamOrThrow(teamId);
    const members = await Promise.all(
      (team.members || []).map(async userId => this.toPartialUser(await this.usersService.findOne(userId)))
    );
    return members.filter((u): u is { id: any; name: any; role: any } => Boolean(u));
  }
}
