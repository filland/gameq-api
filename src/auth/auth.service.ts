import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class AuthService {

  private USERNAME_ALREADY_EXISTS_CODE = '23505';

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signUp(dto: SignUpUserDto): Promise<void> {
    try {
      const { username, email, password } = dto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.usersService.create({
        username,
        email,
        password: hashedPassword
      });

      await this.usersService.save(user);

    } catch (e) {
      if (e.code === this.USERNAME_ALREADY_EXISTS_CODE) {
        throw new ConflictException(`Username already exists`);
      } else {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(dto: LoginUserDto): Promise<{ accessToken: string }> {
    try {
      const { email, password } = dto;

      const user = await this.usersService.findOneByFields({ email });
      const { username, id } = user;

      if (user && bcrypt.compare(password, user.password)) {
        const payload = {
          username, id
        }
        const accessToken: string = this.jwtService.sign(payload);
        return {
          accessToken
        };
      } else {
        throw new UnauthorizedException('Please, check your credentials');
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
