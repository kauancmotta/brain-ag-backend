import { IsOptional, IsString, Matches } from 'class-validator';

export class DashboardQueryDto {
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}$/, {
    message: 'year must contain exactly 4 digits',
  })
  year?: string;
}