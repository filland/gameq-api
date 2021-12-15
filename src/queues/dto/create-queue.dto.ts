import { IsNumber, IsPositive, Length, Max, Min } from 'class-validator'

export class CreateQueueDto {

  @Length(1, 1000)
  description: string

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(1000)
  numberOfWinners: number

  @IsNumber()
  @IsPositive()
  @Min(1)
  hoursToClose: number
}