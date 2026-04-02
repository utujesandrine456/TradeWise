import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AnalysisService } from './analysis.service';
import { MGqlStockAnalysis } from '../../graphql/circular-dependency';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { IJwtPayload } from 'src/auth/auth.types';
import { VerifiedGuard } from 'src/custom/guards/verified/verified.guard';
import { Context } from '@nestjs/graphql';

@UseGuards(VerifiedGuard)
@Resolver()
export class AnalysisResolver {
  public constructor(private readonly analysisService: AnalysisService) {}

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
