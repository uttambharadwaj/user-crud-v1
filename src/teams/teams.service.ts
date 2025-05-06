import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TeamsService {
  constructor(private readonly usersService: UsersService) {}

  private teams: Team[] = [];

  onModuleInit() {
    // Seed initial teams
    const initialTeams: CreateTeamDto[] = [
      {
        name: 'Engineering Team',
        creatorId: 1, // References John Doe
        description: 'Main engineering team',
        isActive: true,
        currentCaptainId: 1
      },
      {
        name: 'Design Team',
        creatorId: 2, // References Jane Smith
        description: 'Product design team',
        isActive: true,
        currentCaptainId: 2
      }
    ];

    initialTeams.forEach(team => {
      const newTeam: Team = {
        name: team.name,
        creatorId: team.creatorId,
        id: this.teams.length + 1,
        createdDate: new Date(),
        description: team.description,
        isActive: team.isActive ?? true,
        currentCaptainId: team.currentCaptainId,
        members: []
      };
      this.teams.push(newTeam);
    });
  }

  create(createTeamDto: CreateTeamDto) {
    const newTeam: Team = {
      name: createTeamDto.name,
      creatorId: createTeamDto.creatorId,
      id: this.teams.length + 1,
      createdDate: new Date(),
      description: createTeamDto.description,
      isActive: createTeamDto.isActive ?? true,
      currentCaptainId: createTeamDto.currentCaptainId,
      members: []
    };
    this.teams.push(newTeam);
    return newTeam;
  }

  findAll() {
    return this.teams.map(team => ({
      id: team.id,
      name: team.name,
      description: team.description,
      currentCaptainId: team.currentCaptainId
    }));
  }

  findOne(id: number) {
    const team = this.teams.find(team => team.id === id);
    if (!team) {
      throw new Error(`Team with id ${id} not found`);
    }
    return team;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    const teamIndex = this.teams.findIndex(team => team.id === id);
    if (teamIndex === -1) {
      throw new Error(`Team with id ${id} not found`);
    }
    
    const updatedTeam = {
      ...this.teams[teamIndex],
      ...updateTeamDto,
    };
    this.teams[teamIndex] = updatedTeam;
    return updatedTeam;
  }

  remove(id: number) {
    const teamIndex = this.teams.findIndex(team => team.id === id);
    if (teamIndex === -1) {
      throw new Error(`Team with id ${id} not found`);
    }
    const deletedTeam = this.teams.splice(teamIndex, 1);
    return deletedTeam[0];
  }

  // Member Management Methods
  // These methods assume that the members are represented by their user IDs

  addMember(teamId: number, userId: number) {
    const team = this.findOne(teamId);
    
    try {
      // Verify user exists
      const user = this.usersService.findOne(userId);
      
      if (!team.members) {
        team.members = [];
      }
      
      // Check if user is already a member
      if (team.members.includes(userId)) {
        throw new Error(`User ${userId} is already a member of team ${teamId}`);
      }
      
      // Add user to team members
      team.members.push(userId);
      return team;
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  }

  removeMember(teamId: number, userId: number) {
    const team = this.findOne(teamId);
    
    try {
      // Verify user exists
      this.usersService.findOne(userId);
      
      if (!team.members) {
        throw new NotFoundException(`No members in team with id ${teamId}`);
      }
      
      const memberIndex = team.members.indexOf(userId);
      if (memberIndex === -1) {
        throw new NotFoundException(`User ${userId} is not a member of team ${teamId}`);
      }
      
      // Remove user from team members
      team.members.splice(memberIndex, 1);
      return team;
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  }

  setCaptain(teamId: number, userId: number) {
    const team = this.findOne(teamId);
    if (!team.members) {
      throw new Error(`No members in team with id ${teamId}`);
    }
    const memberIndex = team.members.indexOf(userId);
    if (memberIndex === -1) {
      throw new Error(`User with id ${userId} not found in team with id ${teamId}`);
    }
    team.currentCaptainId = userId;
    return team;
  }

  getMembers(teamId: number) {
    const team = this.findOne(teamId);
    if (!team.members) {
      return [];
    }
    
    // Return detailed user information for each member
    return Promise.all(
      team.members.map(async (userId) => {
        try {
          return this.usersService.findOne(userId);
        } catch (error) {
          return null;
        }
      })
    ).then(members => members.filter(member => member !== null));
  }
}
