<<<<<<< HEAD
import { UseGuards } from '@nestjs/common';
=======
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AnalysisService } from './analysis.service';
import { MGqlStockAnalysis } from '../../graphql/circular-dependency';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { IJwtPayload } from 'src/auth/auth.types';
<<<<<<< HEAD
import { VerifiedGuard } from 'src/custom/guards/verified/verified.guard';
import { Context } from '@nestjs/graphql';

@UseGuards(VerifiedGuard)
=======

>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
@Resolver()
export class AnalysisResolver {
  public constructor(private readonly analysisService: AnalysisService) {}

  @Query(() => MGqlStockAnalysis)
  public async stockAnalysis(
    @CurrentUser('traderId') user: IJwtPayload,
    @Args('start', { nullable: true }) start?: Date,
    @Args('end', { nullable: true }) end?: Date,
<<<<<<< HEAD
    @Context() context?: any,
  ) {
    return this.analysisService.analyse(user.sub, { start, end }, context?.req);
=======
  ) {
    return this.analysisService.analyse(user.sub, { start, end });
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
  }
}
