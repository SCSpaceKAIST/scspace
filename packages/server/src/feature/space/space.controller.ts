import { Controller, Get, Param } from '@nestjs/common';
import { SpacePublicService } from './space.public.service';
import { ISpace } from '@scspace-depot/types/space';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpacePublicService) {}

  @Get('all')
  async findAllSpace(): Promise<ISpace[]> {
    console.log('findAllSpace');
    const res = await this.spaceService.fetchAll();
    console.log('findAllSpace res', res);
    return res;
  }

  @Get(':id')
  async findSpaceByID(@Param('id') id: string): Promise<ISpace> {
    console.log('findSpaceByID', id);
    const res = await this.spaceService.fetchById(parseInt(id));
    console.log('findSpaceByID res', res);
    return res;
  }
}
