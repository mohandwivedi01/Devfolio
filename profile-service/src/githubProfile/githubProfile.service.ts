import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Contribution } from "src/schema/githubSchema/contribution.schema";
import { Github } from "src/schema/githubSchema/github.schema";
import { Repository } from "src/schema/githubSchema/repository.schema";
import { Profile } from "src/schema/profile.schema";

@Injectable()
export class GithubProfileService{
    constructor(
        private readonly profileModel: Model<Profile>,
        private readonly githubModel: Model<Github>,
        private readonly contributionModel: Model<Contribution>,
        private readonly repoModel: Model<Repository>
    ){}


    async fetchUserGithubData(data: any): Promise<any> {
         
    }

}