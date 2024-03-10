import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { RabbitmqService } from '../../services/rabbitmq/rabbitmq.service';

@Injectable()
export class UserService {
  constructor(
    private readonly rabbitmqService: RabbitmqService,
  ) {
  }

  async create(createUserDto: CreateUserDto) {
    try {
      console.log('--createUserDto--', createUserDto);

      await this.rabbitmqService.pushToEmailQueue(createUserDto.email);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }

}
