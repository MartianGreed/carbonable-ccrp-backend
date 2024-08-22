import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password of the user',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The company of the user',
  })
  @IsString()
  companyId: string;
}
