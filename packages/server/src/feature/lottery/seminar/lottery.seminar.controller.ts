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
    // 모든 추첨 정보 조회 (시간 순 자동 정렬)
    return await this.lotterySeminarService.getAllSeminarLotteryInfo();
  }

  @Get("info/active")
  async getActiveInfo(): Promise<MSeminarLotteryInfo[]> {
    // 현재 진행 중인 추첨 정보 조회 (시간 순 정렬)
    return await this.lotterySeminarService.getActiveSeminarLotteryInfo();
  }

  @Get("info/upcoming")
  async getUpcomingInfo(): Promise<MSeminarLotteryInfo[]> {
    // 예정된 추첨 정보 조회 (시간 순 정렬)
    return await this.lotterySeminarService.getUpcomingSeminarLotteryInfo();
  }

  @UseGuards(AdminGuard)
  @Post("info")
  async postInfo(
    @Body() lotteryInfo: ILotteryInfoCreate
  ): Promise<MSeminarLotteryInfo> {
    // 새 추첨 정보 생성 (시간 겹침 검증 + 자동 정렬)
    return await this.lotterySeminarService.postSeminarLotteryInfo({ lotteryInfo });
  }

  @UseGuards(AdminGuard)
  @Put("info/:id")
  async updateInfo(
    @Param('id') id: number,
    @Body() updateLotteryInfo: ILotteryInfoUpdate
  ): Promise<MSeminarLotteryInfo> {
    // 추첨 정보 업데이트 (시간 겹침 검증 + 자동 정렬)
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
    // 추첨 정보 삭제
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