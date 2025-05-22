import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SpacePublicService } from './space.public.service';
import { ISpace } from '@scspace-depot/types/space';
import { AuthGuard } from '@nestjs/passport';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpacePublicService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllSpace(): Promise<ISpace[]> {
    return await this.spaceService.fetchAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findSpaceByID(@Param('id') id: string): Promise<ISpace> {
    return await this.spaceService.fetchById(parseInt(id));
  }
}