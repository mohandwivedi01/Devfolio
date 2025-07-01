import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Contribution, contributionSchema } from 'src/schema/githubSchema/contribution.schema';
import { Github, githubSchema } from 'src/schema/githubSchema/github.schema';
import { Language, languageSchema } from 'src/schema/githubSchema/language.schema';
import { Profile, profileSchema } from 'src/schema/profile.schema';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Repository, repositorySchema } from 'src/schema/githubSchema/repository.schema';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeatureAsync([
      {
        name: Profile.name,
        useFactory: () => {
          return profileSchema;
        },
      },
      {
        name: Contribution.name,
        useFactory: () => {
          return contributionSchema;
        },
      },
      {
        name: Language.name,
        useFactory: () => {
          return languageSchema;
        },
      },
      {
        name: Github.name,
        useFactory: () => {
          return githubSchema;
        },
      },
      {
        name: Repository.name,
        useFactory: () => {
          return repositorySchema;
        },
      },
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class githubProfileModule {}
