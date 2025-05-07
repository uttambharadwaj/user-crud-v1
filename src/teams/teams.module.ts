import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { UsersModule } from '../users/users.module';
import { TeamsRepository } from './teams.repository';

@Module({
  imports: [UsersModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
})
export class TeamsModule {}
