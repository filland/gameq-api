import { Injectable, NotFoundException } from '@nestjs/common';
import { QueuesRepository } from './queues.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from './queue.entity';
import { User } from 'src/auth/user.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { ParticipantsRepository } from 'src/participants/participants.repository';
import { VotesRepository } from 'src/votes/votes.repository';
import { QueueConveter } from './converter/queue.converter';
import { QueueDto } from './dto/queue.dto';
import { QueueParticipantDto } from './dto/queue-participant.dto';

@Injectable()
export class QueuesService {

  constructor(
    @InjectRepository(QueuesRepository) private queuesRepository: QueuesRepository,
    @InjectRepository(ParticipantsRepository) private participantsRepository: ParticipantsRepository,
    @InjectRepository(VotesRepository) private votesRepository: VotesRepository,
    private queueConverter: QueueConveter
  ) { }

  private async findQueueById(id: string): Promise<Queue> {
    const result = await this.queuesRepository.findOne(id, { relations: ["owner"] });
    if (!result) {
      throw new NotFoundException(`Queue with id = ${id} not found`);
    }
    return result;
  }

  async getQueueById(id: string): Promise<QueueDto> {
    const result: Queue = await this.findQueueById(id);
    return this.queueConverter.convert(result);
  }

  async getQueuesParticipants(queueId: string): Promise<string[]> {
    return await this.queuesRepository.findAllParticipantsSortedByVotes(queueId);
  }

  async getQueueParticipant(queueId: string, userId: string): Promise<QueueParticipantDto> {
    const participant = await this.participantsRepository.findParticipantAndUsername(queueId, userId);

    if (!participant) {
      throw new NotFoundException(`user ${userId} is not a participant of queue`);
    }

    const { username } = participant;

    const count = await this.votesRepository.count({
      where: { "queueId": queueId, "participantId": userId }
    });

    const dto: QueueParticipantDto = {
      username: username,
      votes: count
    }

    return dto;
  }

  async getOwnQueues(user: User): Promise<QueueDto[]> {
    return this.queueConverter.convertAll(await user.ownedQueues);
  }

  async createQueue(rq: CreateQueueDto, user: User): Promise<QueueDto> {
    const { description, numberOfWinners, hoursToClose } = rq;
    const createdDate = new Date();
    const closeDate = new Date();
    closeDate.setTime(createdDate.getTime() + (hoursToClose * 60 * 60 * 1000))

    const queue: Queue = await this.queuesRepository.save({
      description,
      number_of_winners: numberOfWinners,
      created_date: createdDate,
      close_date: closeDate,
      closed: false,
      owner: user
    });
    return this.queueConverter.convert(queue);
  }

  async joinQueue(queueId: string, user: User): Promise<QueueParticipantDto> {
    const queue = await this.findQueueById(queueId);
    const participant = this.participantsRepository.create({
      queueId: queue.id,
      userId: user.id
    });
    await this.participantsRepository.save(participant);

    const dto: QueueParticipantDto = {
      username: user.username,
      votes: 0
    }
    return dto;
  }

  async voteForParticipant(queueId: string, participantId: string, user: User) {
    const queue = await this.findQueueById(queueId);
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
