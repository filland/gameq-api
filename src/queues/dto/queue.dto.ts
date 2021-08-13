

export class QueueDto {
  id: string
  description: string
  number_of_winners: number
  close_date: Date
  created_date: Date
  closed: boolean
  owner: string
}