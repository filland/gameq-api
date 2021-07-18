import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.stage.${process.env.STAGE}`,
      validationSchema: configValidationSchema
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // here we use dependency injection to inject configService to get env variables 
      useFactory: async (configService: ConfigService) => {
        return {
          type: "postgres",
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          // the following two params seems to need to be set to false if i want to 
          // create tables using plain sql (meaning do not want to use generation of entities by TypeORM)
          autoLoadEntities: true,
          synchronize: true
        };
      }
    }),
    AuthModule
  ],
  providers: [],
})
export class AppModule { }
