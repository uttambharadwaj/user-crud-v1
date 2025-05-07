import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsResponseDto } from './dto/teams-response.dto';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({ description: 'Team creation payload', type: CreateTeamDto })
  @ApiResponse({ status: 201, description: 'Team created successfully', type: TeamsResponseDto })
  async create(@Body() createTeamDto: CreateTeamDto) {
    return await this.teamsService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated and sorted list of teams' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'id', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'asc', description: 'Sort order: asc or desc' })
  @ApiResponse({ status: 200, description: 'Paginated list of teams', type: TeamsResponseDto, isArray: true })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return await this.teamsService.findAll({ page, limit, sortBy, sortOrder });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiParam({ name: 'id', description: 'Team ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Team details', type: TeamsResponseDto })
  async findOne(@Param('id') id: string) {
    return await this.teamsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a team by ID' })
  @ApiParam({ name: 'id', description: 'Team ID', example: 1 })
  @ApiBody({ description: 'Team update payload', type: UpdateTeamDto })
  @ApiResponse({ status: 200, description: 'Team updated', type: TeamsResponseDto })
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return await this.teamsService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team by ID' })
  @ApiParam({ name: 'id', description: 'Team ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Team deleted', type: TeamsResponseDto })
  async remove(@Param('id') id: string) {
    return await this.teamsService.remove(+id);
  }

  @Post(':id/members/:userId')
  @ApiOperation({ summary: 'Add a user to a team' })
  @ApiParam({ name: 'id', description: 'Team ID', example: 1 })
  @ApiParam({ name: 'userId', description: 'User ID', example: 2 })
  @ApiResponse({ status: 201, description: 'User added to team', type: TeamsResponseDto })
  async addMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return await this.teamsService.addMember(+id, +userId);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a user from a team' })
  @ApiParam({ name: 'id', description: 'Team ID', example: 1 })
  @ApiParam({ name: 'userId', description: 'User ID', example: 2 })
  @ApiResponse({ status: 200, description: 'User removed from team', type: TeamsResponseDto })
  async removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return await this.teamsService.removeMember(+id, +userId);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get all members of a team' })
  @ApiParam({ name: 'id', description: 'Team ID', example: 1 })
  @ApiResponse({ status: 200, description: 'List of team members', type: [Object] })
  async getMembers(@Param('id') id: string) {
    return await this.teamsService.getMembers(+id);
  }

  @Post(':id/captain/:userId')
  @ApiOperation({ summary: 'Assign a captain to a team' })
  @ApiParam({ name: 'id', description: 'Team ID', example: 1 })
  @ApiParam({ name: 'userId', description: 'User ID', example: 2 })
  @ApiResponse({ status: 201, description: 'Captain assigned', type: TeamsResponseDto })
  async setCaptain(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return await this.teamsService.setCaptain(+id, +userId);
  }
}
