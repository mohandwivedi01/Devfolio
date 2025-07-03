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

  async fetchUserGithubData(data: {userName: string}): Promise<any> {
    const { userName } = data;
    const response = await axios.get(`${process.env.GITHUB_API_URI}/users/${userName}`);

    console.log('*****Data******', response.data);
  

    await this.githubModel.create({
      userName: response.data.login,
      name: response.data.name,
      email: response.data.email,
      avatarUrl: response.data.avatar_url,
      bio: response.data.bio,
      location: response.data.location,
      companyName: response.data.company,
      websiteOrBlog: response.data.blog,
      openToWork: response.data.hireable,
      numberOfFollowing: response.data.following,
      numberOfFollowers: response.data.followers,
      joiningDate: new Date(response.data.created_at),
      numberOfStars: 0, // This can be updated later
    })

    return response.data;
  }
}
 