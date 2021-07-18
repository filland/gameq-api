import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {

  constructor(@InjectRepository(TasksRepository) private tasksRepository: TasksRepository) { }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const result = await this.tasksRepository.findOne({ where: { id, user } });

    if (!result) {
      throw new NotFoundException(`Task with id = ${id} not found`);
    }

    return result;
  }

  async createTask(rq: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = rq;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    return await this.tasksRepository.save(task);
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task: Task = await this.getTaskById(id, user);
    task.status = status;
    return await this.tasksRepository.save(task);
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id = ${id} not found`);
    }
  }

}
