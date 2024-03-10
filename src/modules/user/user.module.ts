import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigService } from '@nestjs/config';
import { RabbitmqService } from '../../services/rabbitmq/rabbitmq.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ConfigService, RabbitmqService],
})
export class UserModule {}
