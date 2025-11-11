import {
    Controller,
    UseGuards, Post, Body,
    Get,
    Query,
    ParseIntPipe,
    Req,
    Delete,
} from "@nestjs/common";
import { ManagerGuard, PasspinMasterGuard } from '../auth/jwt/jwt.guard';
import { PasspinService } from "@scspace-server/feature/passpin/passpin.service";
import { IPasspin, IPasspinSpace, IPasspinWithSpace } from "@scspace-depot/types/passpin";
import { AuthGuard } from "@nestjs/passport";
import { IUser } from "@scspace-depot/types/user";
import { Request } from "express";
import { UserUtils } from "@scspace-depot/utils/user.utils";


@Controller('passpin')
export class PasspinController {
    constructor(
        private readonly passpinService: PasspinService,
    ) { }

    @Post()
    @UseGuards(PasspinMasterGuard)
    async changePasspin(
        @Body() body: {
            spaceId: number,
            next?: string,
        }
    ): Promise<IPasspinSpace> {
        return await this.passpinService.changePin(body.spaceId, body.next ?? null)
    }

    @Delete()
    @UseGuards(PasspinMasterGuard)
    async deletePasspin(
        @Body('spaceId', ParseIntPipe) spaceId: number,
    ): Promise<void> {
        return await this.passpinService.deleteCurrentPin(spaceId);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getCurrentPin(
        @Req() req: Request,
    ): Promise<IPasspinWithSpace[]> {
        const user = req.user as IUser;
        if (UserUtils.isManager(user.type))
            return await this.passpinService.getActivePins();
        return await this.passpinService.getActivePinsByUser(user.id);
    }

    // @Get('space')
    // @UseGuards(ManagerGuard)
    // async getCurrentPinSpace(
    //     @Query('spaceId', ParseIntPipe) spaceId: number,
    // ): Promise<IPasspinSpace> {
    //     return await this.passpinService.getSpacePin(spaceId);
    // }

    @Get('history')
    @UseGuards(ManagerGuard)
    async getHistory(
        @Query('spaceId', ParseIntPipe) spaceId: number,
        @Query('limit') limit?: number,
        @Query('includeCurrent') includeCurrent?: boolean,
    ): Promise<IPasspin[]> {
        return await this.passpinService.getOlderPins(
            spaceId, limit ?? 10, includeCurrent ?? false
        );
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
