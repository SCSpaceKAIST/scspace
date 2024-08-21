import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DBModule } from 'src/db/db.module';

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1y' },
    }),
    DBModule,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
