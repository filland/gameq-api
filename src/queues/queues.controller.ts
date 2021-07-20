import { Body, Controller, Get, InternalServerErrorException, Param, Post, UseGuards } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Queue } from './queue.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { QueueParticipantDto } from './dto/queue-participant.dto';

@Controller('/api/v1/queues')
export class QueuesController {

  private logger = new Logger("QueuesController");

  constructor(private queueService: QueuesService) { }

  @Get('/:id')
  getQueueById(@Param('id') id: string): Promise<Queue> {
    // this.logger.debug(`Retrieving queue by id = ${id}`);
    return this.queueService.getQueueById(id);
  }

  @Get('/:id/participants')
  getQueuesParticipants(@Param('id') id: string): Promise<string[]> {
    // this.logger.debug(`Retrieving queue by id = ${id}`);
    return this.queueService.getQueuesParticipants(id);
  }


  @Get('/owner')
  getOwnQueues(@GetUser() user: User): Promise<Queue[]> {
    return this.queueService.getOwnQueues(user);
  }

  @Get('/participated')
  getParticipatedQueues(@GetUser() _user: User): Promise<Queue[]> {
    throw new InternalServerErrorException();
  }

  @Post()
  @UseGuards(AuthGuard())
  createQueue(@Body() rq: CreateQueueDto, @GetUser() user: User): Promise<Queue> {
    this.logger.debug(`User ${user.username} is creating a new queue: ${JSON.stringify(rq)}`);
    return this.queueService.createQueue(rq, user);
  }

  @Post("/:id/join")
  @UseGuards(AuthGuard())
  joinQueue(@Param('id') queueId: string, @GetUser() user: User): Promise<void> {
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
