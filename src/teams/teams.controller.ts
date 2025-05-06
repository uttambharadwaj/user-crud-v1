import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }

  @Post(':id/members/:userId')
  addMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.teamsService.addMember(+id, +userId);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.teamsService.removeMember(+id, +userId);
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.teamsService.getMembers(+id);
  }

  @Post(':id/captain/:userId')
  setCaptain(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.teamsService.setCaptain(+id, +userId);
  }
}
