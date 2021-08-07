import { Injectable } from '@nestjs/common';
import { Queue } from '../queue.entity';
import { QueueDto } from '../dto/queue.dto';

@Injectable()
export class QueueConveter {

  async convert(queueEntity: Queue): Promise<QueueDto> {
    const { owner, ...other } = queueEntity;
    return {
      ...other,
      owner: owner.username,
    };
  }

  async convertAll(queueEntities: Queue[]): Promise<QueueDto[]> {
    const result: QueueDto[] = [];
    for (let i = 0; i < queueEntities.length; i++) {
      const queue = queueEntities[i];
      result.push(this.convert(queue));
    }
    return result;
  }
}
