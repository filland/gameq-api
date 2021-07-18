import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuctionsRepository } from './auctions.repository';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { ParticipantsRepository } from 'src/participants/participants.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionsRepository, ParticipantsRepository]), AuthModule],
  controllers: [AuctionsController],
  providers: [AuctionsService]
})
export class AuctionsModule { }
