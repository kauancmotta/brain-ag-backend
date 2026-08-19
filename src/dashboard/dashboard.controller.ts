import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiQuery({
    name: 'year',
    required: false,
    example: '2026',
    description: 'Filters dashboard metrics by crop season year',
  })
  getDashboard(
    @Query() query: DashboardQueryDto,
  ): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboard(query.year);
  }
}
