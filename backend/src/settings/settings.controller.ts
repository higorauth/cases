import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';
import type { UpdateSettingsDto } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':userId')
  async getSettings(@Param('userId') userId: string) {
    return this.settingsService.getSettings(userId);
  }

  @Put(':userId')
  async updateSettings(
    @Param('userId') userId: string,
    @Body() data: UpdateSettingsDto,
  ) {
    return this.settingsService.createOrUpdateSettings(userId, data);
  }
}
