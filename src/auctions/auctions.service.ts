import { Injectable, NotFoundException } from '@nestjs/common';
import { AuctionsRepository } from './auctions.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from './auction.entity';
import { User } from 'src/auth/user.entity';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Injectable()
export class AuctionsService {

  constructor(@InjectRepository(AuctionsRepository) private auctionsRepository: AuctionsRepository) { }

  async getAuctionById(id: string): Promise<Auction> {

    const result = await this.auctionsRepository.findOne({ where: { id } });

    if (!result) {
      throw new NotFoundException(`Auction with id = ${id} not found`);
    }

    return result;
  }

  async getOwnAuctions(user: User): Promise<Auction[]> {
    return await user.ownedAuctions;
  }

  async createAuction(rq: CreateAuctionDto, user: User): Promise<Auction> {

    const { description, numberOfWinners, hoursToClose } = rq;

    const createdDate = new Date();
    const closeDate = new Date();
    closeDate.setTime(createdDate.getTime() + (hoursToClose * 60 * 60 * 1000))

    const auction = this.auctionsRepository.create({
      description,
      number_of_winners: numberOfWinners,
      created_date: createdDate,
      close_date: closeDate,
      closed: false,
      owner: user
    });

    return await this.auctionsRepository.save(auction);
  }

  async joinAuction(auctionId: string, user: User) {

  }
}
