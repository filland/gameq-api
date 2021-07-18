import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  if (process.env.STAGE === 'dev') {
    app.enableCors();
  }
  const port: number = 3000;
  await app.listen(port);
  const logger = new Logger();
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
