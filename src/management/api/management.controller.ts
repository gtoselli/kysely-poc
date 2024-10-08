import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ManagementQueries } from '../management.queries';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { CreateConcertCommand } from '../commands/create-concert.command';
import { ManagementCommandBus } from '../management.command-bus';
import { UpdateConcertCommand } from '../commands/update-concert.command';

@Controller('management')
export class ManagementController {
  constructor(
    private readonly managementQueries: ManagementQueries,
    private readonly managementCommandBus: ManagementCommandBus,
  ) {}

  @Post('concerts')
  public async createConcert(@Body() body: CreateConcertDto) {
    return await this.managementCommandBus.send(new CreateConcertCommand(body));
  }

  @Get('concerts')
  public async getConcerts() {
    return await this.managementQueries.listConcerts();
  }

  @Put('concerts/:concertId')
  public async updateConcert(@Param('concertId') concertId: string, @Body() body: UpdateConcertDto) {
    return await this.managementCommandBus.send(new UpdateConcertCommand({ ...body, id: concertId }));
  }

  @Get('concerts/:concertId')
  public async getConcert(@Param('concertId') concertId: string) {
    return await this.managementQueries.getConcertById(concertId);
  }
}
