import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalRepository } from './rental.repository';
import { RentalPublicService } from './rental.public.service';
import { RentalController } from './rental.controller';
import { DBModule } from 'src/db/db.module';
import { UserModule } from 'src/feature/user/user.module';

@Module({
    imports: [
        DBModule,
        UserModule,
    ],
    controllers: [RentalController],
    providers: [
        RentalRepository,
        RentalPublicService,
        RentalService,
    ],
    exports: [RentalPublicService],
})
export class RentalModule { }
