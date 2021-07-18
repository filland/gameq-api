import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantsRepository } from './participants.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipantsRepository])],
  controllers: [],
  providers: [],
})
export class ParticipantsModule { }
