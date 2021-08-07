import { User } from 'src/auth/user.entity';
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
}