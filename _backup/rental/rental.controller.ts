import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Query,
    Body,
    ParseIntPipe,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
    Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { RentalService } from './rental.service';
import {
    IRentalUpdate,
    IRentalAll,
    IGoods,
    IGoodsCreate,
    IGoodsUpdate,
    IGoodsAvailabilityCheck,
    IUserRentalStatus,
    IRentalCreateClient,
} from '@scspace-depot/types/rental';
import { IDataResponse, ISuccessResponse } from '@scspace-depot/types/common';
import { ManagerGuard, MemberGuard, AdminGuard } from '../auth/jwt/jwt.guard';
import { IUser } from '@scspace-depot/types/user';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { publicStorage } from '@scspace-server/tools/file/file.storage';

@Controller('rental')
export class RentalController {
    constructor(
        private readonly rentalService: RentalService
    ) { }

    // Rental 관련 엔드포인트들

    // 대여 생성
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createRental(
        @Body() rentalData: IRentalCreateClient,
        @Req() req: Request
    ): Promise<{ success: boolean; data: { id: number } }> {
        const user = req.user as IUser;
        return await this.rentalService.createRental({
            ...rentalData,
            userId: user.id,
        });
    }

    //반납 요청 : 특정 렌탈
    // @Post('returnreq')
    // @UseGuards(ManagerGuard)
    // async returnRequest(
    //     @Body('rentalId') rentalId: number,
    // ): Promise<{
    //     success: boolean,
    //     id: number,
    // }> {
    //     return await this.rentalService.rentalReturnRequest(rentalId);
    // }

    //반납 요청 : 모든 overdue 렌탈
    // @Post('returnreq/all')
    // @UseGuards(AdminGuard)
    // async returnRequestAll(): Promise<{
    //     success: boolean,
    //     id: number,
    // }[]> {
    //     return await this.rentalService.rentalReturnRequestAll()
    // }

    // 모든 대여 목록 조회 (관리자용)
    @Get()
    @UseGuards(ManagerGuard)
    async getRentalList(
        @Query('limit', ParseIntPipe) limit: number = 50,
        @Query('offset', ParseIntPipe) offset: number = 0
    ): Promise<IDataResponse<IRentalAll[]>> {
        return await this.rentalService.getRentalList(limit, offset);
    }

    // 특정 대여 조회
    @Get(':id')
    // @UseGuards(UserGuard)
    @UseGuards(AuthGuard('jwt'))
    async getRentalById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<IRentalAll> {
        return await this.rentalService.getRentalById(id);
    }

    // 사용자별 대여 목록 조회
    @Get('user/:userId')
    // @UseGuards(UserGuard)
    @UseGuards(AuthGuard('jwt'))
    async getUserRentals(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('isActive') isActive?: string
    ): Promise<IRentalAll[]> {
        const params: IUserRentalStatus = {
            userId,
            isActive: isActive ? isActive === 'true' : undefined,
        };
        return await this.rentalService.getUserRentals(params);
    }

    // 내 대여 목록 조회
    @Get('my/list')
    // @UseGuards(MemberGuard)
    @UseGuards(AuthGuard('jwt'))
    async getMyRentals(
        @Req() req: Request,
        @Query('isActive') isActive?: string
    ): Promise<IRentalAll[]> {
        const user = req.user as IUser;
        const params: IUserRentalStatus = {
            userId: user.id,
            isActive: isActive ? isActive === 'true' : undefined,
        };
        return await this.rentalService.getUserRentals(params);
    }

    // 연체된 대여 목록 조회
    // @Get('overdue/list')
    // @UseGuards(ManagerGuard)
    // async getOverdueRentals(): Promise<IRentalAll[]> {
    //     return await this.rentalService.getOverdueRentals();
    // }

    // 대여 정보 수정
    @Put(':id')
    // @UseGuards(MemberGuard)
    @UseGuards(AuthGuard('jwt'))
    async updateRental(
        @Param('id', ParseIntPipe) id: number,
        @Body() updates: IRentalUpdate
    ): Promise<ISuccessResponse> {
        return await this.rentalService.updateRental(id, updates);
    }

    // 물품 반납
    @Put(':id/return')
    // @UseGuards(MemberGuard)
    @UseGuards(AuthGuard('jwt'))
    async returnRental(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ISuccessResponse> {
        return await this.rentalService.returnRental(id);
    }

    // 반납 확인 (관리자용)
    @Put(':id/confirm')
    @UseGuards(ManagerGuard)
    async confirmReturn(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ISuccessResponse> {
        return await this.rentalService.confirmReturn(id);
    }

    // 대여 삭제
    // @Delete(':id')
    // @UseGuards(AdminGuard)
    // async deleteRental(
    //     @Param('id', ParseIntPipe) id: number
    // ): Promise<ISuccessResponse> {
    //     return await this.rentalService.deleteRental(id);
    // }

    // Goods 관련 엔드포인트들

    // 물품 생성
    @Post('goods')
    @UseInterceptors(FileInterceptor('file', {
        storage: publicStorage,
        limits: {
            fieldSize: 10 * 1024 * 1024,
            // fileSize: 10 * 1024 * 1024
        }, // 10MB 파일 크기 제한
    }))
    @UseGuards(ManagerGuard)
    async createGoods(
        @UploadedFile() file: Express.Multer.File,
        @Body() goodsData: Omit<IGoodsCreate, 'imageURI' | "countAll"> & {
            countAll?: string;
        }
    ): Promise<{ success: boolean; data: { id: number } }> {
        const imageURI = `/uploads/${file.filename}`;
        Logger.log(file);

        return await this.rentalService.createGoods({
            ...goodsData,
            imageURI,
            countAll: parseInt(goodsData.countAll, 10)
        });
    }

    // 모든 물품 목록 조회
    @Get('goods/list')
    async getGoodsList(): Promise<IGoods[]> {
        return await this.rentalService.getGoodsList();
    }

    // 특정 물품 조회
    @Get('goods/:id')
    async getGoodsById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<IGoods> {
        return await this.rentalService.getGoodsById(id);
    }

    // 물품 정보 수정
    @Put('goods/:id')
    @UseInterceptors(FileInterceptor('file', { storage: publicStorage, }))
    @UseGuards(ManagerGuard)
    async updateGoods(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() updates: Omit<IGoodsUpdate, "countNow" | "countAll"> & {
            countAll?: string; // string으로 받아서 내부에서 number로 변환
            countNow?: string;
        },
    ): Promise<ISuccessResponse> {
        if (file) {
            const imageURI = `/uploads/${file.filename}`;
            updates.imageURI = imageURI;
        }
        return await this.rentalService.updateGoods(id, {
            ...updates,
            countAll: parseInt(updates.countAll, 10),
            countNow: parseInt(updates.countNow, 10)
        });
    }

    // 물품 삭제
    @Delete('goods/:id')
    @UseGuards(ManagerGuard)
    async deleteGoods(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ISuccessResponse> {
        return await this.rentalService.deleteGoods(id);
    }

    // 물품 가용성 확인
    @Post('goods/check-availability')
    @UseGuards(MemberGuard)
    async checkGoodsAvailability(
        @Body() checkData: IGoodsAvailabilityCheck
    ): Promise<{ available: boolean }> {
        const available = await this.rentalService['rentalPublicService'].checkGoodsAvailability(checkData);
        return { available };
    }
}
