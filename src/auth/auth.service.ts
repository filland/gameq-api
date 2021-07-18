import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) { }

  // this method is called signUp and not createUser because we are thinking about
  // the business logic and from the end user perspective this method 
  // is signing them up
  async signUp(dto: AuthCredentialsDto): Promise<void> {
    try {
      const { username, password } = dto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        username,
        password: hashedPassword
      });

      await this.userRepository.save(user);

    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(`Username already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = dto;

    const user = await this.userRepository.findOne({ username });

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
