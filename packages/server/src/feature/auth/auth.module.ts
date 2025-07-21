import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DelegatorGuard, ManagerGuard, MemberGuard, UserGuard } from './jwt/jwt.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/feature/user/user.module';
import { OrganizationModule } from '../organization/organization.module';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  providers: [AuthService, JwtStrategy, ManagerGuard, UserGuard, DelegatorGuard, MemberGuard],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule, UserModule, OrganizationModule, ReservationModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_KEY'),
        signOptions: { expiresIn: '1y' },
      }),
    }),
    UserModule,
    OrganizationModule,
    ReservationModule,
  ],
  controllers: [AuthController],
  exports: [ManagerGuard, UserGuard, DelegatorGuard, MemberGuard],
})
export class AuthModule { }
