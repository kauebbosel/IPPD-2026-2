import { Controller, Get, Post, Put, Patch, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { TasksService } from './tasks.service.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly s: TasksService) {}

  @Get() findAll() { return this.s.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.s.findOne(id); }
  @Post() create(@Body() b: any) { return this.s.create(b); }
  @Put(':id') replace(@Param('id') id: string, @Body() b: any) { return this.s.replace(id, b); }
  @Patch(':id') update(@Param('id') id: string, @Body() b: any) { return this.s.update(id, b); }
  @Delete(':id') @HttpCode(204) remove(@Param('id') id: string) { return this.s.remove(id); }
}