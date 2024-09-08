import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Redirect,
  Res,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { SpaceService } from './space.service';
@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get('info/:id')
  findSpaceInfobyID(@Param('id') id: number) {
    return this.spaceService.getSpaceIntroByID(id);
  }

  @Get('all')
  findAllSpace() {
    return this.spaceService.getSpaceAll();
  }

  @Get(':id')
  findSpaceByID(@Param('id') id: number) {
    return this.spaceService.getSpaceByID(id);
  }
}
