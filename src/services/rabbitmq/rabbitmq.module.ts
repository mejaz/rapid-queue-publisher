import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ConfigService } from '@nestjs/config';

@Module({
  exports: [RabbitmqService],
  providers: [RabbitmqService, ConfigService],
})
export class RabbitmqModule {
}
