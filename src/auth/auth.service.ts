import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByName(username);
    if (!bcrypt.compare(user?.password, pass)) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      username: user.id,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async createUser(username: string, pass: string): Promise<any> {
    await this.usersService.createUser(username, pass);
  }
}