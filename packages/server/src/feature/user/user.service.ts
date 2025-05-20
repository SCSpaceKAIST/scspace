import { Injectable } from '@nestjs/common';
import { UserPublicService } from './user.public.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends UserPublicService {
  constructor(userRepository: UserRepository) {
    super(userRepository);
  }
}