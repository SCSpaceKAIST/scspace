import { Controller, Get, Param } from '@nestjs/common';
import { SpaceService } from './space.service';
import { ISpace } from '@scspace-depot/types/space';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get('all')
  async findAllSpace(): Promise<ISpace[]> {
    console.log('findAllSpace');
    const res = await this.spaceService.getSpaceAll();
    console.log('findAllSpace res', res);
    return res;
  }

  @Get(':id')
  async findSpaceByID(@Param('id') id: string): Promise<ISpace> {
    console.log('findSpaceByID', id);
    const res = await this.spaceService.getSpaceByID(parseInt(id));
    console.log('findSpaceByID res', res);
    return res;
  }

  // @Get('info/:id')
  // findSpaceInfoByID(@Param('id') id: number) {
  //   return this.spaceService.getSpaceInfoByID(id);
  // }
}
