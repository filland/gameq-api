import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class SignUpUserDto {

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string

  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'Password is too weak' }
  )
  password: string
}
