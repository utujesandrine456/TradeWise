import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { AnalysisService } from './analysis.service';
import { MGqlStockAnalysis } from 'src/graphql/circular-dependency';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { IJwtPayload } from 'src/auth/auth.types';
import { UseGuards } from '@nestjs/common';
import { VerifiedGuard } from 'src/custom/guards/verified/verified.guard';

@UseGuards(VerifiedGuard)
@Resolver()
export class AnalysisResolver {
  public constructor(private readonly analysisService: AnalysisService) { }

  @Query(() => MGqlStockAnalysis)
  public async stockAnalysis(
    @CurrentUser('traderId') user: IJwtPayload,
    @Args('start', { nullable: true }) start?: Date,
    @Args('end', { nullable: true }) end?: Date,
    @Context() context?: any,
  ) {
    return this.analysisService.analyse(user.sub, { start, end }, context?.req);
  }
}
