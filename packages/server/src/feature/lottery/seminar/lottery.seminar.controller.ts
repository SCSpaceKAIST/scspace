import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { LotterySeminarService } from "./lottery.seminar.service";
import { MSeminarLotteryInfo } from "./lottery.seminar.info.model";
import { AdminGuard, DelegatorGuard } from "@scspace-server/feature/auth/jwt/jwt.guard";
import { ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery/lottery.info.type";
import { MSeminarLottery } from "./lottery.seminar.model";
import { ISeminarLotteryCreate, ISeminarLotteryUpdate } from "@scspace-depot/types/lottery/lottery.seminar.type";
import { ISuccessResponse } from "@scspace-depot/types/common";

@Controller('lottery/seminar')
export class LotterySeminarController {
  constructor(
    private readonly lotterySeminarService: LotterySeminarService,
  ) { }

  @Get("info")
  async getInfo(): Promise<MSeminarLotteryInfo[]> {
    // Implementation for fetching lottery seminar info
    return await this.lotterySeminarService.getAllSeminarLotteryInfo();
  }

  @UseGuards(AdminGuard)
  @Post("info")
  async postInfo(
    @Body() lotteryInfo: ILotteryInfoCreate
  ): Promise<MSeminarLotteryInfo> {
    // Implementation for posting new lottery seminar info
    return await this.lotterySeminarService.postSeminarLotteryInfo({ lotteryInfo });
  }

  @UseGuards(AdminGuard)
  @Put("info/:id")
  async updateInfo(
    @Param('id') id: number,
    @Body() updateLotteryInfo: ILotteryInfoUpdate
  ): Promise<MSeminarLotteryInfo> {
    // Implementation for updating existing lottery seminar info
    return await this.lotterySeminarService.updateSeminarLotteryInfo({
      id,
      updateLotteryInfo
    });
  }

  @UseGuards(AdminGuard)
  @Delete("info/:id")
  async deleteInfo(
    @Param('id') id: number
  ): Promise<ISuccessResponse> {
    // Implementation for deleting existing lottery seminar info
    return {
      success: await this.lotterySeminarService.deleteSeminarLotteryInfo(id)
    };
  }

  @Get()
  async getSeminarLotteryByOrganization(
    @Query('organizationId') organizationId: number,
    @Query('spaceId') spaceId: number,
    @Query('infoId') infoId: number
  ): Promise<MSeminarLottery[]> {
    // Implementation for fetching seminar lottery by organization
    return await this.lotterySeminarService.getSeminarLotteryByOrganization({
      organizationId,
      spaceId,
      infoId
    });
  }

  @Get("time")
  async getSeminarLotteryByTime(
    @Query('time') time: number,
    @Query('spaceId') spaceId: number,
    @Query('infoId') infoId: number
  ): Promise<MSeminarLottery[]> {
    // Implementation for fetching seminar lottery by time
    return await this.lotterySeminarService.getSeminarLotteryByTime({
      time,
      spaceId,
      infoId
    });
  }

  @UseGuards(DelegatorGuard)
  @Post()
  async postSeminarLottery(
    @Body() lottery: ISeminarLotteryCreate
  ): Promise<MSeminarLottery> {
    // Implementation for posting new seminar lottery
    return await this.lotterySeminarService.postSeminarLottery({ lottery });
  }

  @UseGuards(DelegatorGuard)
  @Put(":id")
  async updateSeminarLottery(
    @Param('id') id: number,
    @Body() updateLottery: ISeminarLotteryUpdate
  ): Promise<MSeminarLottery> {
    // Implementation for updating existing seminar lottery
    return await this.lotterySeminarService.updateSeminarLottery({
      id,
      updateLottery
    });
  }

  @UseGuards(DelegatorGuard)
  @Delete(":id")
  async deleteSeminarLottery(
    @Param('id') id: number
  ): Promise<ISuccessResponse> {
    // Implementation for deleting existing seminar lottery
    return {
      success: await this.lotterySeminarService.deleteSeminarLottery(id)
    }
  }
}