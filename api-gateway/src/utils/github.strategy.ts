// src/auth/strategies/github.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    const clientID = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const callbackURL = process.env.GITHUB_CALLBACK_URL;
    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing GitHub OAuth environment variables');
    }
    super({
      clientID,
      clientSecret,
      callbackURL, // e.g. http://localhost:3000/auth/github/callback
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // You can save user data to your DB here
    return {
      accessToken,
      profile,
    };
  }
}
