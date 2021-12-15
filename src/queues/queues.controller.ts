import { Body, Controller, Get, InternalServerErrorException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { QueueParticipantDto } from './dto/queue-participant.dto';
import { QueueDto } from './dto/queue.dto';
import { GetUser } from 'src/user/get-user.decorator';

@Controller('/api/v1/queues')
export class QueuesController {

  private logger = new Logger("QueuesController");

  constructor(private queueService: QueuesService) { }

  @Get("/owner")
  @UseGuards(AuthGuard())
  getOwnQueues(@GetUser() user: User): Promise<QueueDto[]> {
    this.logger.debug(`Retrieving own queues for user with id = ${user.id}`);
    return this.queueService.getOwnQueues(user);
  }

  @Get("/participated")
  @UseGuards(AuthGuard())
  getParticipatedQueues(@GetUser() user: User): Promise<QueueDto[]> {
    return this.queueService.getParticipatedQueues(user);
  }

  @Get('/:id')
  getQueueById(@Param('id') id: string): Promise<QueueDto> {
    // this.logger.debug(`Retrieving queue by id = ${id}`);
    return this.queueService.getQueueById(id);
  }

  @Get('/:id/participants')
  getQueuesParticipants(@Param('id') id: string, @Query("page") page: number): Promise<string[]> {
    // this.logger.debug(`Retrieving queue by id = ${id}`);
    return this.queueService.getQueuesParticipants(id, page);
  }

  @Get('/:id/participants/current-user')
  @UseGuards(AuthGuard())
  getQueuesParticipantWhenParticipantIsCurrentUser(@Param('id') queueId: string, @GetUser() user: User): Promise<QueueParticipantDto> {
    // this.logger.debug(`Retrieving queue by id = ${id}`);
    return this.queueService.getQueueParticipant(queueId, user.id);
  }

  @Post()
  @UseGuards(AuthGuard())
  createQueue(@Body() rq: CreateQueueDto, @GetUser() user: User): Promise<QueueDto> {
    this.logger.debug(`User ${user.username} is creating a new queue: ${JSON.stringify(rq)}`);
    return this.queueService.createQueue(rq, user);
  }

  @Post("/:id/join")
  @UseGuards(AuthGuard())
  joinQueue(@Param('id') queueId: string, @GetUser() user: User): Promise<QueueParticipantDto> {
    this.logger.debug(`User ${user.username} is joining queue ${queueId}`);
    return this.queueService.joinQueue(queueId, user);
  }

  @Post("/:queueId/vote/:participantId")
  @UseGuards(AuthGuard())
  voteForParticipant(@Param('queueId') queueId: string, @Param('participantId') participantId: string, @GetUser() user: User): Promise<void> {
    this.logger.debug(`User ${user.id} is voting for ${participantId}`);
    return this.queueService.voteForParticipant(queueId, participantId, user);
  }

}
