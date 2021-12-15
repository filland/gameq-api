import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { VotesRepository } from './votes.repository';

@Injectable()
export class VotesService {

  constructor(
    @InjectRepository(VotesRepository) private votesRepository: VotesRepository,
  ) { }

  create(partialEntity: Object): Vote {
    return this.votesRepository.create(partialEntity);
  }

  async save<T>(vote: T): Promise<T> {
    return this.votesRepository.save(vote);
  }

}