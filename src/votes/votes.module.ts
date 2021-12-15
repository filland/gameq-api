import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { VotesRepository } from './votes.repository';
import { VotesService } from './votes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VotesRepository]),
    AuthModule,
  ],
  exports: [VotesService],
  controllers: [],
  providers: [VotesService]
})
export class VotesModule { }
