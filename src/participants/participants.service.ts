import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueuesService } from 'src/queues/queues.service';
import { User } from 'src/user/user.entity';
import { VotesService } from 'src/votes/votes.service';
import { Connection, UpdateResult } from 'typeorm';
import { Participant } from './participant.entity';
import { ParticipantsRepository } from './participants.repository';

@Injectable()
export class ParticipantsService {

  constructor(
    private connection: Connection,
    @InjectRepository(ParticipantsRepository) private participantsRepository: ParticipantsRepository,
    @Inject(forwardRef(() => QueuesService)) private queuesService: QueuesService,
    private votesService: VotesService,
  ) { }

  async findOneByFields(params: Object): Promise<Participant> {
    return this.participantsRepository.findOne(params);
  }

  async findParticipantAndUsername(queueId: string, userId: string): Promise<any> {
    return this.participantsRepository.findParticipantAndUsername(queueId, userId);
  }

  async findAllParticipantsSortedByVotes(queueId: string, page: number) {
    return this.participantsRepository.findAllParticipantsSortedByVotes(queueId, page);
  }

  async findParticipantPlace(queueId: string, userId: string): Promise<any> {
    return this.participantsRepository.findParticipantPlace(queueId, userId);
  }

  create(partialEntity: Object): Participant {
    return this.participantsRepository.create(partialEntity);
  }

  async save<T>(participant: T): Promise<T> {
    return this.participantsRepository.save(participant);
  }

  update(criteria: any, partialEntity: any): Promise<UpdateResult> {
    return this.participantsRepository.update(criteria, partialEntity);
  }

  async voteForParticipant(queueId: string, userId: string, user: User) {
    const queue = await this.queuesService.findQueueById(queueId);
    const participant = await this.findOneByFields({ where: { queueId, userId } });

    const vote = this.votesService.create({
      queueId: queue.id,
      participantId: participant.userId,
      voterId: user.id,
      votes: 1
    });

    await this.update(
      { queueId: participant.queueId, userId: participant.userId },
      { votes: participant.votes + 1 }
    );

    await this.votesService.save(vote);
  }
}