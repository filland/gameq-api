import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpUserDto } from './dto/signup-user.dto';

@Controller('/api/v1/auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Post('/signup')
  signUp(@Body() dto: SignUpUserDto): Promise<void> {
    return this.authService.signUp(dto);
  }

  @Post('/signin')
  signIn(@Body() dto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(dto);
  }


}
