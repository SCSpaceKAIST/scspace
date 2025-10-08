import {
    Controller,
    UseGuards, Post, Body,
    Get,
    Query,
    ParseIntPipe,
} from "@nestjs/common";
import { AdminGuard, PasspinMasterGuard } from '../auth/jwt/jwt.guard';
import { PasspinService } from "@scspace-server/feature/passpin/passpin.service";
import { IPasspin, IPasspinSpace } from "@scspace-depot/types/passpin";
import { AuthGuard } from "@nestjs/passport";


@Controller('passpin')
export class PasspinController {
    constructor(
        private readonly passpinService: PasspinService,
    ) { }

    @Post('change')
    @UseGuards(PasspinMasterGuard)
    async changePasspin(
        @Body() body: {
            spaceId: number,
            next?: string,
        }
    ): Promise<IPasspinSpace> {
        return await this.passpinService.changePin(body.spaceId, body.next ?? null)
    }

    @Get('space')
    @UseGuards(AuthGuard('jwt'))
    async getCurrentPinSpace(
        @Query('spaceId', ParseIntPipe) spaceId: number,
    ): Promise<IPasspinSpace> {
        return await this.passpinService.getSpacePin(spaceId);
    }

    @Get('current')
    @UseGuards(AuthGuard('jwt'))
    async getCurrentPin(
        @Query('spaceId', ParseIntPipe) spaceId: number,
    ): Promise<IPasspin> {
        const res = await this.passpinService.getSpacePin(spaceId);
        return res.currentPin;
    }

    @Get('history')
    @UseGuards(AuthGuard('jwt'))
    async getHistory(
        @Query('spaceId', ParseIntPipe) spaceId: number,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('includeCurrent') includeCurrent?: boolean,
    ): Promise<IPasspin[]> {
        return await this.passpinService.getOlderPins(spaceId, limit, includeCurrent ?? false);
    }
}


/** OUTDATED
 *  @Get()
 *  @UseGuards(AdminGuard)
 *  async pinId(
 *      @Query('id', ParseIntPipe) id: number,
 *  ) : Promise<IPasspin> {
 *      return await this.passpinService.getPin(id);
 *  }
 *
 *
 * Endpoints
 * GET api/passpin/change
 *   -> change the passpin
 *
 *
 *  @Get('change')
 *  @UseGuards(AdminGuard)
 *  async changePin(
 *      @Query('spaceId', ParseIntPipe) spaceId: number,
 *  ) : Promise<IPasspinChangeResponse> {
 *      return await this.passpinService.changePin(spaceId);
 *  }
 *
 *  @Get('current')
 *  @UseGuards(AdminGuard)
 *  async getPin(
 *      @Query('spaceId', ParseIntPipe) spaceId: number,
 *  ) : Promise<string> {
 *      return await this.passpinService.getCurrentPinString(spaceId)
 *  }
 *
 *
 *  @Get('next')
 *  @UseGuards(AdminGuard)
 *  async getNewpin(
 *      @Query('spaceId', ParseIntPipe) spaceId: number,
 *  ) : Promise<string> {
 *      return await this.passpinService.getNextPinString(spaceId);
 *  }
 *
 *  @Get('space')
 *  @UseGuards(AdminGuard)
 *  async getSpacePin(
 *      @Query('spaceId', ParseIntPipe) spaceId: number,
 *  ) : Promise <IPasspinSpace> {
 *      return await this.passpinService.getSpacePin(spaceId);
 *  }
 */
