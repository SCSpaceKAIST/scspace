import {
    Controller,
    Get,
    Query,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/jwt/jwt.guard';
import { PasspinService } from "@scspace-server/feature/passpin/passpin.service";
import { IPasspinChangeResponse, IPasspinSpace } from "@scspace-depot/types/passpin";


@Controller('passpin')
export class PasspinController {
    constructor(
        private readonly passpinService: PasspinService,
    ) { }


    @Get('changepin')
    @UseGuards(AdminGuard)
    async changePin(
        @Query('spaceId', ParseIntPipe) spaceId: number,
    ) : Promise<IPasspinChangeResponse> {
        return await this.passpinService.changePin(spaceId);
    }

    @Get('current')
    @UseGuards(AdminGuard)
    async getPin(
        @Query('spaceId', ParseIntPipe) spaceId: number,
    ) : Promise<string> {
        return await this.passpinService.getCurrentPinNumber(spaceId)
    }
    
    
    @Get('next')
    @UseGuards(AdminGuard)
    async getNewpin(
        @Query('spaceId', ParseIntPipe) spaceId: number,
    ) : Promise<string> {
        return await this.passpinService.getNextPinNumber(spaceId);
    }

    @Get('space')
    @UseGuards(AdminGuard)
    async getSpacePin(
        @Query('spaceId', ParseIntPipe) spaceId: number,
    ) : Promise <IPasspinSpace> {
        return await this.passpinService.getSpacePin(spaceId);
    }
}
