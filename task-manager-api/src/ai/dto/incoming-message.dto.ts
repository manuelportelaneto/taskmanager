import { IsNotEmpty, IsString } from 'class-validator';

export class IncomingMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
