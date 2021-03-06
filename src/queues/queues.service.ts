import { Injectable, NotFoundException } from '@nestjs/common';
import { QueuesRepository } from './queues.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from './queue.entity';
import { User } from 'src/user/user.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { QueueConveter } from './converter/queue.converter';
import { QueueDto } from './dto/queue.dto';
import { QueueParticipantDto } from './dto/queue-participant.dto';
import { ParticipantsService } from 'src/participants/participants.service';

@Injectable()
export class QueuesService {

  constructor(
    @InjectRepository(QueuesRepository) private queuesRepository: QueuesRepository,
    private participantsService: ParticipantsService,
    private queueConverter: QueueConveter
  ) { }

  async findQueueById(id: string): Promise<Queue> {
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

  async getQueuesParticipants(queueId: string, page: number): Promise<string[]> {
    return await this.participantsService.findAllParticipantsSortedByVotes(queueId, page);
  }

  async getQueueParticipant(queueId: string, userId: string): Promise<QueueParticipantDto> {
    const participant = await this.participantsService.findParticipantAndUsername(queueId, userId);
    if (!participant) {
      throw new NotFoundException(`user ${userId} is not a participant of queue`);
    }
    const place = await this.getParticipantPlace(queueId, userId);
    const { username, votes } = participant;
    const dto: QueueParticipantDto = {
      username,
      votes,
      place
    }
    return dto;
  }

  async getParticipantPlace(queueId: string, userId: string): Promise<number> {
    const result = await this.participantsService.findParticipantPlace(queueId, userId)
    return Number.parseInt(result.beforeParticipants) + 1;
  }

  async getOwnQueues(user: User): Promise<QueueDto[]> {
    const result = await this.queuesRepository.find({
      relations: ["owner"],
      where: { owner: user },
      order: {
        createdDate: "DESC"
      },
    });
    return this.queueConverter.convertAll(result);
  }

  async getParticipatedQueues(user: User): Promise<QueueDto[]> {
    const queues = await this.queuesRepository.findParticipatedQueues(user);
    return this.queueConverter.convertAll(queues);;
  }

  async createQueue(rq: CreateQueueDto, user: User): Promise<QueueDto> {
    const { description, numberOfWinners, hoursToClose } = rq;
    const createdDate = new Date();
    const closeDate = new Date();
    closeDate.setTime(createdDate.getTime() + (hoursToClose * 60 * 60 * 1000))

    const queue: Queue = await this.queuesRepository.save({
      description,
      number_of_winners: numberOfWinners,
      createdDate: createdDate,
      closeDate: closeDate,
      closed: false,
      owner: user
    });
    return this.queueConverter.convert(queue);
  }

  async joinQueue(queueId: string, user: User): Promise<QueueParticipantDto> {
    const { id, username } = user;
    const queue = await this.findQueueById(queueId);
    const participant = this.participantsService.create({
      queueId: queue.id,
      userId: id,
      joinDate: new Date(),
      votes: 0
    });
    await this.participantsService.save(participant);
    const place = await this.getParticipantPlace(queueId, id);

    const dto: QueueParticipantDto = {
      username: username,
      votes: 0,
      place
    }
    return dto;
  }
}
