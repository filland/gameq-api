import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { QueuesRepository } from './queues.repository';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { ParticipantsRepository } from 'src/participants/participants.repository';
import { VotesRepository } from 'src/votes/votes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([QueuesRepository, ParticipantsRepository, VotesRepository]), AuthModule],
  controllers: [QueuesController],
  providers: [QueuesService],
})
export class QueuesModule { }
