import {
    Controller,
    UseGuards, Post, Body,
} from "@nestjs/common";
import { AdminGuard } from '../auth/jwt/jwt.guard';
import { PasspinService } from "@scspace-server/feature/passpin/passpin.service";
import { IPasspin, IPasspinSpace } from "@scspace-depot/types/passpin";


@Controller('passpin')
export class PasspinController {
    constructor(
        private readonly passpinService: PasspinService,
    ) { }

    //need to change guard.. like PasspinGuard or something else

    @Post('change')
    @UseGuards(AdminGuard)
    async changePasspin(
        @Body() body : {
            spaceId : number,
            next ? : string,
        }
    ): Promise<IPasspinSpace> {
        return await this.passpinService.changePin(body.spaceId, body.next ?? null)
    }

    @Post('space')
    @UseGuards(AdminGuard)
    async getCurrentPinSpace(
        @Body() body : {
            spaceId : number,
        }
    ):Promise<IPasspinSpace> {
        return await this.passpinService.getSpacePin(body.spaceId);
    }

    @Post('current')
    @UseGuards(AdminGuard)
    async getCurrentPin(
        @Body() body : {
            spaceId : number,
        }
    ):Promise<IPasspin> {
        const res = await this.passpinService.getSpacePin(body.spaceId);
        return res.currentPin;
    }

    @Post('history')
    @UseGuards(AdminGuard)
    async getHistory(
        @Body() body : {
            spaceId : number,
            limit  : number,
            includeCurrent ? : boolean,
        }
    ): Promise<IPasspin[]> {
        return await this.passpinService.getOlderPins(body.spaceId, body.limit, body.includeCurrent ?? false);
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
