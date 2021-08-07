import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from './dto/signup-user.dto';

@Injectable()
export class AuthService {

  private USERNAME_ALREADY_EXISTS_CODE = '23505';

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) { }

  // this method is called signUp and not createUser because we are thinking about
  // the business logic and from the end user perspective this method 
  // is signing them up
  async signUp(dto: SignUpUserDto): Promise<void> {
    try {
      const { username, email, password } = dto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        username,
        email,
        password: hashedPassword
      });

      await this.userRepository.save(user);

    } catch (e) {
      if (e.code === this.USERNAME_ALREADY_EXISTS_CODE) {
        throw new ConflictException(`Username already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(dto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = dto;

    const user = await this.userRepository.findOne({ email });
    const { username } = user;

    if (user && bcrypt.compare(password, user.password)) {
      const payload = {
        username
      }
      const accessToken: string = this.jwtService.sign(payload);
      return {
        accessToken
      };
    } else {
      throw new UnauthorizedException('Please, check your credentials');
    }
  }

}
