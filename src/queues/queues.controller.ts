import { Body, Controller, Get, InternalServerErrorException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { QueueParticipantDto } from './dto/queue-participant.dto';
import { QueueDto } from './dto/queue.dto';

@Controller('/api/v1/queues')
export class QueuesController {

  private logger = new Logger("QueuesController");

  constructor(private queueService: QueuesService) { }

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

  @Get("/:id/participants/:userId/place")
  getParticipantPlace(@Param('id') queueId: string, @Param('userId') userId: string,): Promise<any> {
    return this.queueService.getParticipantPlace(queueId, userId);
  }


  @Get('/owner')
  getOwnQueues(@GetUser() user: User): Promise<QueueDto[]> {
    return this.queueService.getOwnQueues(user);
  }

  @Get('/participated')
  getParticipatedQueues(@GetUser() _user: User): Promise<QueueDto[]> {
    throw new InternalServerErrorException();
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
