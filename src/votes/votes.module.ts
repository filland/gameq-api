import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { VotesRepository } from './votes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VotesRepository]), AuthModule],
  controllers: [],
  providers: []
})
export class VotesModule { }
