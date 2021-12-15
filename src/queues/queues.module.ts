import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { QueuesRepository } from './queues.repository';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { QueueConveter } from './converter/queue.converter';
import { ParticipantsModule } from 'src/participants/participants.module';
import { VotesModule } from 'src/votes/votes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QueuesRepository]),
    AuthModule,
    ParticipantsModule,
    VotesModule,
  ],
  exports: [QueuesService],
  controllers: [QueuesController],
  providers: [QueuesService, QueueConveter],
})
export class QueuesModule { }
