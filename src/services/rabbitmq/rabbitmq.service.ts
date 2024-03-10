import { Injectable, OnModuleInit } from '@nestjs/common';
import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { ConfigService } from '@nestjs/config';

// NestJS docs: https://docs.nestjs.com/fundamentals/lifecycle-events#usage
// ... to register a method to be called during module initialization on a particular class
// (e.g., Controller, Provider or Module), implement the OnModuleInit interface by supplying
// an onModuleInit() method ...

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;
  private readonly emailQueue: string;
  private readonly mqServerUrl: string;
  private readonly exchange: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.mqServerUrl = this.configService.get<string>('MESSAGE_QUEUE_URL');
    this.emailQueue = this.configService.get('MESSAGE_QUEUE_EMAIL');
    this.exchange = this.configService.get<string>('MESSAGE_QUEUE_EXCHANGE');
  }

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {

      this.connection = amqp.connect([this.mqServerUrl]);
      this.channel = this.connection.createChannel({
        setup: (channel: ConfirmChannel) => {
          return this.setupQueue(channel);
        },
      });

      console.log("*** CONNECTED TO RABBITMQ SERVER ***")

    } catch (err) {
      console.error('Error connecting to RabbitMQ:', err);
    }
  }

  private async setupQueue(channel: ConfirmChannel) {
    try {


      if (!this.exchange || !this.emailQueue) {
        console.error('Exchange or Queue missing in env.');
        return;
      }

      // Declare queues
      await channel.assertQueue(this.emailQueue, { durable: true });

      // Declare exchange
      await channel.assertExchange(this.exchange, 'direct', { durable: true });

      // bind queues to the exchange with routing keys
      await channel.bindQueue(this.emailQueue, this.exchange, this.emailQueue);

      console.log('*** Queue is ready to accept messages ***');
    } catch (err) {
      console.error('Error occurred setting up the queue: ', err);
    }
  }

  async pushToEmailQueue(text: string) {
    await this.pushToQueue(this.emailQueue, text)
  }

  async pushToQueue(queue: string, text: string) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      await this.channel.sendToQueue(queue, text, { persistent: true });
      console.log("-- message pushed to queue --")
    } catch (err) {
      console.error("--error pushing message to queue--", err);
    }
  }
}
