import { User } from 'src/auth/user.entity';
import { Vote } from 'src/votes/vote.entity';
import { EntityRepository, getManager, Repository } from 'typeorm';
import { Queue } from './queue.entity';

@EntityRepository(Queue)
export class QueuesRepository extends Repository<Queue> {

  async findAllParticipantsSortedByVotes(queueId: string) {

    const votes = getManager().createQueryBuilder()
      .select("v.participantId", "participantId")
      .addSelect("count(v.voterId)", "votes")
      .from(Vote, "v")
      .where("v.queueId = :queueId", { queueId })
      .groupBy("v.participantId");

    const result = await getManager().createQueryBuilder()
      .select("u.username", "username")
      .addSelect("v.\"participantId\"", "participantId")
      .addSelect("v.\"votes\"", "votes")
      .from(User, "u")
      .innerJoin("(" + votes.getQuery() + ")", "v", "u.id = v.\"participantId\"")
      .setParameters(votes.getParameters())
      .orderBy("v.\"votes\"", "DESC")
      .getRawMany();

    return result;
  }
}