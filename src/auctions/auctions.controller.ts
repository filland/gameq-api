import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Auction } from './auction.entity';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Controller('/api/v1/auctions')
@UseGuards(AuthGuard())
export class AuctionsController {

  private logger = new Logger("AuctionsController");

  constructor(private auctionService: AuctionsService) { }

  @Get('/:id')
  getAuctionById(@Param('id') id: string): Promise<Auction> {
    // this.logger.debug(`Retrieving auction by id = ${id}`);
    return this.auctionService.getAuctionById(id);
  }

  @Get('/owner')
  getOwnAuctions(@GetUser() user: User): Promise<Auction[]> {
    return this.auctionService.getOwnAuctions(user);
  }

  @Get('/participated')
  getParticipatedAuctions(@GetUser() _user: User): Promise<Auction[]> {
    throw new InternalServerErrorException();
  }

  @Post()
  createAuction(@Body() rq: CreateAuctionDto, @GetUser() user: User): Promise<Auction> {
    this.logger.debug(`User ${user.username} is creating a new auction: ${JSON.stringify(rq)}`);
    return this.auctionService.createAuction(rq, user);
  }

  @Post("/:id/join")
  joinAuction(@Param('id') auctionId: string, @GetUser() user: User) {
    this.logger.debug(`User ${user.username} is joining auction ${auctionId}`);
    this.auctionService.joinAuction(auctionId, user);
  }

}
