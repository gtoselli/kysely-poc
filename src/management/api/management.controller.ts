import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ManagementService } from '../management.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';

@Controller('management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Post('concerts')
  public async createConcert(@Body() body: CreateConcertDto) {
    return await this.managementService.createConcert(body.title, body.date, body.description, body.seatingCapacity);
  }

  @Get('concerts')
  public async getConcerts() {
    return await this.managementService.listConcerts();
  }

  @Put('concerts/:concertId')
  public async updateConcert(@Param('concertId') concertId: string, @Body() body: UpdateConcertDto) {
    return await this.managementService.updateConcert(concertId, body);
  }

  @Get('concerts/:concertId')
  public async getConcert(@Param('concertId') concertId: string) {
    return await this.managementService.getConcertById(concertId);
  }
}
