import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueuesModule } from 'src/queues/queues.module';
import { VotesModule } from 'src/votes/votes.module';
import { ParticipantsRepository } from './participants.repository';
import { ParticipantsService } from './participants.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParticipantsRepository]),
    forwardRef(() => QueuesModule),
    VotesModule
  ],
  exports: [ParticipantsService],
  controllers: [],
  providers: [ParticipantsService],
})
export class ParticipantsModule { }
