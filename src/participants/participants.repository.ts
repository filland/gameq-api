import { User } from 'src/auth/user.entity';
import { Vote } from 'src/votes/vote.entity';
import { EntityRepository, getManager, Repository } from 'typeorm';
import { Participant } from './participant.entity';

@EntityRepository(Participant)
export class ParticipantsRepository extends Repository<Participant> {

  async findParticipantAndUsername(queueId: string, userId: string): Promise<any> {

    const user = getManager().createQueryBuilder()
      .select("u.id", "id")
      .addSelect("u.username", "username")
      .from(User, "u")
      .where("u.id = :userId", { userId });

    const participantAndUsername = getManager().createQueryBuilder()
      .from(Participant, "p")
      .innerJoin("(" + user.getQuery() + ")", "u", "p.\"userId\" = u.\"id\"")
      .where("p.\"queueId\" = :queueId AND p.\"userId\" = :userId", { queueId, userId })
      .setParameters(user.getParameters())
      .getRawOne();

    return participantAndUsername;
  }

  async findAllParticipantsSortedByVotes(queueId: string, page: number) {

    const PARTICIPANTS_ON_PAGE = 50;
    const pagesToSkip = page > 0 ? PARTICIPANTS_ON_PAGE * (page - 1) : 0;

    const participants = getManager().createQueryBuilder()
      .select("u.username", "username")
      .addSelect("u.\"id\"", "userId")
      .addSelect("p.\"votes\"", "votes")
      .from(Participant, "p")
      .innerJoinAndSelect(User, "u", "p.userId = u.id")
      .skip(pagesToSkip)
      .take(PARTICIPANTS_ON_PAGE)
      .orderBy("p.\"votes\"", "DESC")
      .where("p.queueId = :queueId", { queueId })
      .getRawMany();

    return participants;
  }

  async findParticipantPlace(queueId: string, userId: string): Promise<any> {

    const participant = getManager().createQueryBuilder()
      .select("p.votes", "votes")
      .from(Participant, "p")
      .where("p.userId = :userId ", { userId })
      .andWhere("p.queueId = :queueId", { queueId })

    const result = getManager().createQueryBuilder()
      .select("count(p.userId)", "beforeParticipants")
      .from(Participant, "p")
      .where("p.votes > (" + participant.getQuery() + ")")
      .setParameters(participant.getParameters())
      .andWhere("p.queueId = :queueId", { queueId })
      .getRawOne();

    return result;
  }
}