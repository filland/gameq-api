import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

// this decorator allows to inject user that was found in the JwtStratery into a method's parameter
export const GetUser = createParamDecorator((_data, context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest();
  return request.user;
})