import { Controller, Get, Param } from '@nestjs/common';
import { SpaceService } from './space.service';
import { ISpace } from '@scspace-depot/types/space';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get('all')
  findAllSpace(): Promise<ISpace[]> {
    return this.spaceService.getSpaceAll();
  }

  @Get(':id')
  findSpaceByID(@Param('id') id: string): Promise<ISpace> {
    return this.spaceService.getSpaceByID(parseInt(id));
  }

  // @Get('info/:id')
  // findSpaceInfoByID(@Param('id') id: number) {
  //   return this.spaceService.getSpaceInfoByID(id);
  // }
}
