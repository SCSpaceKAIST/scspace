import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { LotterySeminarService } from "./lottery.seminar.service";
import { AdminGuard, DelegatorGuard, UserGuard } from "@scspace-server/feature/auth/jwt/jwt.guard";
import { ILotteryInfo, ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery/lottery.info.type";
import { ISeminarLottery, ISeminarLotteryCreate } from "@scspace-depot/types/lottery/lottery.seminar.type";
import { ISuccessResponse } from "@scspace-depot/types/common";
import { IReservationMultipleCreateResurt } from "@scspace-depot/types/reservation";
import { AuthGuard } from "@nestjs/passport";

@Controller('lottery/seminar')
export class LotterySeminarController {
  constructor(
    private readonly lotterySeminarService: LotterySeminarService,
  ) { }

  @Get("info")
  async getInfo(): Promise<ILotteryInfo[]> {
    // 모든 추첨 정보 조회 (시간 순 자동 정렬)
    return await this.lotterySeminarService.getAllSeminarLotteryInfo();
  }

  @Get("info/active")
  async getActiveInfo(): Promise<ILotteryInfo[]> {
    // 현재 진행 중인 추첨 정보 조회 (시간 순 정렬)
    return await this.lotterySeminarService.getActiveSeminarLotteryInfo();
  }

  @Get("info/upcoming")
  async getUpcomingInfo(): Promise<ILotteryInfo[]> {
    // 예정된 추첨 정보 조회 (시간 순 정렬)
    return await this.lotterySeminarService.getUpcomingSeminarLotteryInfo();
  }

  @UseGuards(AdminGuard)
  @Post("info")
  async postInfo(
    @Body() lotteryInfo: ILotteryInfoCreate
  ): Promise<ILotteryInfo> {
    // 새 추첨 정보 생성 (시간 겹침 검증 + 자동 정렬)
    return await this.lotterySeminarService.postSeminarLotteryInfo({ lotteryInfo });
  }

  @UseGuards(AdminGuard)
  @Put("info/:id")
  async updateInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLotteryInfo: ILotteryInfoUpdate
  ): Promise<ILotteryInfo> {
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
  ): Promise<ISeminarLottery[]> {
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
  ): Promise<ISeminarLottery[]> {
    // Implementation for fetching seminar lottery by time
    return await this.lotterySeminarService.getSeminarLotteryByTime({
      time,
      spaceId,
      infoId
    });
  }

  @Get("time/drawn")
  async getDrawnSeminarLottery(
    @Query('spaceId') spaceId: number,
    @Query('infoId') infoId: number,
  ): Promise<ISeminarLottery[]> {
    // Implementation for fetching drawn seminar lottery
    return await this.lotterySeminarService.getDrawnSeminarLottery({ spaceId, infoId });
  }

  @Get("time/count")
  async getTimeSlotCounts(
    @Query('spaceId') spaceId: number,
    @Query('infoId') infoId: number
  ): Promise<{ time: number; count: number }[]> {
    // 모든 시간대에 대해 신청한 조직 수 조회
    return await this.lotterySeminarService.getSeminarLotteryTimeSlotCounts({ spaceId, infoId });
  }

  // @UseGuards(DelegatorGuard)
  @UseGuards(AuthGuard("jwt"))
  @Post()
  async postSeminarLottery(
    @Body() lottery: ISeminarLotteryCreate
  ): Promise<ISeminarLottery> {
    // Implementation for posting new seminar lottery
    return await this.lotterySeminarService.postSeminarLottery({ lottery });
  }

  // @UseGuards(DelegatorGuard)
  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async deleteSeminarLottery(
    @Param('id') id: number
  ): Promise<ISuccessResponse> {
    // Implementation for deleting existing seminar lottery
    return {
      success: await this.lotterySeminarService.deleteSeminarLottery(id)
    }
  }

  @UseGuards(AdminGuard)
  @Post('draw')
  async drawInfo(): Promise<ISuccessResponse> {
    // Implementation for drawing seminar lottery
    return {
      success: await this.lotterySeminarService.drawing()
    };
  }

  @UseGuards(AdminGuard)
  @Post("apply")
  async applyInfo(): Promise<IReservationMultipleCreateResurt[]> {
    // Implementation for fetching apply seminar lottery info
    return await this.lotterySeminarService.applySeminarLottery()
  }
}