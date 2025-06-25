import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const profileQueueApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'profile_queue',
      queueOptions: {
        durable: false
      },
    },
  });
  console.log('Starting profile-service microservice...');
  await profileQueueApp.listen();
  console.log('Profile-service microservice is listening...');
}
bootstrap();
