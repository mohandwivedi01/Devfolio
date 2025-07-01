import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Contribution } from 'src/schema/githubSchema/contribution.schema';
import { Github } from 'src/schema/githubSchema/github.schema';
import { Repository } from 'src/schema/githubSchema/repository.schema';
import { Profile } from 'src/schema/profile.schema';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<Profile>,
    @InjectModel(Github.name)
    private readonly githubModel: Model<Github>,
    @InjectModel(Contribution.name)
    private readonly contributionModel: Model<Contribution>,
    @InjectModel(Repository.name)
    private readonly repoModel: Model<Repository>,
  ) {}

  async fetchUserGithubData(): Promise<any> {
    const userName = 'mohandwivedi01';
    const userData = await axios.get(`${process.env.GITHUB_API_URI}/users/${userName}`);

    console.log('*****Data******', userData.data);
    return userData.data;
  }
}
