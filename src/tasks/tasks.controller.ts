import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

  private logger = new Logger("TasksController");

  constructor(private taskService: TasksService) { }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.debug(`User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    this.logger.debug(`User ${user.username} retrieving task by id = ${id}`);
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createTask(@Body() rq: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    this.logger.debug(`User ${user.username} is creating a new task: ${JSON.stringify(rq)}`);
    return this.taskService.createTask(rq, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(@Param('id') id: string, @Body() taskStatusDto: UpdateTaskStatusDto, @GetUser() user: User): Promise<Task> {
    this.logger.debug(`User ${user.username} is updating status of task ${id} to ${taskStatusDto.status}`);
    const { status } = taskStatusDto;
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    this.logger.debug(`User ${user.username} is deleting task ${id}`);
    return this.taskService.deleteTaskById(id, user);
  }

}
