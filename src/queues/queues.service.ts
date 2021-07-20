import { Injectable, NotFoundException } from '@nestjs/common';
import { QueuesRepository } from './queues.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from './queue.entity';
import { User } from 'src/auth/user.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { ParticipantsRepository } from 'src/participants/participants.repository';
import { VotesRepository } from 'src/votes/votes.repository';
import { QueueParticipantDto } from './dto/queue-participant.dto';

@Injectable()
export class QueuesService {

  constructor(
    @InjectRepository(QueuesRepository) private queuesRepository: QueuesRepository,
    @InjectRepository(ParticipantsRepository) private participantsRepository: ParticipantsRepository,
    @InjectRepository(VotesRepository) private votesRepository: VotesRepository) { }

  async getQueueById(id: string): Promise<Queue> {
    const result = await this.queuesRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`Queue with id = ${id} not found`);
    }
    return result;
  }

  async getQueuesParticipants(queueId: string): Promise<string[]> {
    return await this.queuesRepository.findAllParticipantsSortedByVotes(queueId);
  }

  async getOwnQueues(user: User): Promise<Queue[]> {
    return await user.ownedQueues;
  }

  async createQueue(rq: CreateQueueDto, user: User): Promise<Queue> {
    const { description, numberOfWinners, hoursToClose } = rq;
    const createdDate = new Date();
    const closeDate = new Date();
    closeDate.setTime(createdDate.getTime() + (hoursToClose * 60 * 60 * 1000))

    const queue = this.queuesRepository.create({
      description,
      number_of_winners: numberOfWinners,
      created_date: createdDate,
      close_date: closeDate,
      closed: false,
      owner: user
    });
    return await this.queuesRepository.save(queue);
  }

  async joinQueue(queueId: string, user: User) {
    const queue = await this.getQueueById(queueId);
    const participant = this.participantsRepository.create({
      queueId: queue.id,
      userId: user.id
    });
    await this.participantsRepository.save(participant);
  }

  async voteForParticipant(queueId: string, participantId: string, user: User) {
    const queue = await this.getQueueById(queueId);
    const participant = await this.participantsRepository.findOne({ where: { userId: participantId } });

    const vote = this.votesRepository.create({
      queueId: queue.id,
      participantId: participant.userId,
      voterId: user.id,
      votes: 1
    });

    await this.votesRepository.save(vote);
  }
}
