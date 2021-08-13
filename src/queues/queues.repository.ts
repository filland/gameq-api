import { User } from 'src/auth/user.entity';
import { Participant } from 'src/participants/participant.entity';
import { EntityRepository, getManager, Repository } from 'typeorm';
import { Queue } from './queue.entity';

@EntityRepository(Queue)
export class QueuesRepository extends Repository<Queue> {

  async findParticipatedQueues(user: User): Promise<Queue[]> {

    const participatedQueuesIds = getManager().createQueryBuilder()
      .select("p.queueId", "queueId")
      .from(Participant, "p")
      .distinct(true)
      .where("p.userId= :userId", { userId: user.id });

    const queues = getManager().createQueryBuilder()
      .select("q")
      .from(Queue, "q")
      .innerJoinAndSelect("q.owner", "user", "user.id = :userId", { userId: user.id })
      .innerJoin("(" + participatedQueuesIds.getQuery() + ")", "qid", "q.id = qid.\"queueId\"")
      .setParameters(participatedQueuesIds.getParameters())
      .getMany();

    return queues;
  }

}