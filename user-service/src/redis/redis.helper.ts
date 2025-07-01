import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisHelper {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {
    if (!this.redisClient) {
      this.redisClient = new Redis({
        host: this.configService.get('REDIS_HOST'),
        port: parseInt(this.configService.get('REDIS_PORT') as string) || 6379,
      });
      this.redisClient.on('error', (err) => {
        console.error('Redis connection error: ', err);
      });
    }
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    try {
      await this.redisClient.setex(key, ttl, value);
      console.log(`Value set key: ${key}`);
    } catch (error) {
      console.error('Error setting value in Redis: ', error);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      console.error('Error while getting value from Redis: ', error);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await this.redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Error while deleting value from redis');
      return false;
    }
  }

  async otpValidate(key: string): Promise<{ expired: boolean; ttl: number }> {
    try {
        const ttl = await this.redisClient.ttl(key);

        if (ttl === -2) return { expired: true, ttl: 0 };

        return { expired: ttl <= 180, ttl: ttl - 180 }
    } catch (error) {
        console.error('Error while validating OTP in Redis:', error);
        return { expired: true, ttl: 0 };
    }
  }
}
