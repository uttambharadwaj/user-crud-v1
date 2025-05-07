import { Injectable } from '@nestjs/common';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsRepository {
  private teams: Record<number, Team> = {};
  private nextId = 1;

  seed(initialTeams: CreateTeamDto[]) {
    initialTeams.forEach(team => this.create(team));
  }

  create(createTeamDto: CreateTeamDto): Team {
    const id = this.nextId++;
    const newTeam: Team = {
      id,
      name: createTeamDto.name,
      createdDate: new Date(),
      description: createTeamDto.description,
      isActive: createTeamDto.isActive ?? true,
      currentCaptainId: createTeamDto.currentCaptainId,
      members: [],
    };
    this.teams[id] = newTeam;
    return newTeam;
  }

  findAll(): Team[] {
    return Object.values(this.teams);
  }

  findOne(id: number): Team | undefined {
    return this.teams[id];
  }

  update(id: number, updateTeamDto: UpdateTeamDto): Team | undefined {
    const team = this.teams[id];
    if (!team) return undefined;
    const updatedTeam = { ...team, ...updateTeamDto };
    this.teams[id] = updatedTeam;
    return updatedTeam;
  }

  remove(id: number): Team | undefined {
    const team = this.teams[id];
    if (!team) return undefined;
    delete this.teams[id];
    return team;
  }
}
