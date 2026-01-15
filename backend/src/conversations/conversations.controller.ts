import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async createConversation(@Body() data: { userId: string }) {
    return this.conversationsService.createConversation(data.userId);
  }

  @Get(':userId')
  async getConversations(@Param('userId') userId: string) {
    return this.conversationsService.getConversations(userId);
  }

  @Get(':conversationId/detail')
  async getConversation(@Param('conversationId') conversationId: string) {
    return this.conversationsService.getConversation(conversationId);
  }

  @Post(':conversationId/message')
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Body() data: { userId: string; message: string },
  ) {
    return this.conversationsService.sendMessage(
      conversationId,
      data.userId,
      data.message,
    );
  }

  @Delete(':conversationId')
  async deleteConversation(@Param('conversationId') conversationId: string) {
    return this.conversationsService.deleteConversation(conversationId);
  }
}
