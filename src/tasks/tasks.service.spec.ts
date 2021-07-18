import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let tasksRepository: TasksRepository;
  let tasksService: TasksService;

  beforeEach(async () => {
    tasksRepository = new TasksRepository();
    tasksService = new TasksService(tasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks() and returns the result', async () => {

      const result: Task[] = [{
        id: "123",
        title: 'title123',
        description: "desc",
        status: TaskStatus.IN_PROGRESS,
        user: null
      }];
      jest.spyOn(tasksRepository, 'getTasks').mockResolvedValue(result);
      const dto: GetTasksFilterDto = new GetTasksFilterDto();

      expect(tasksService.getTasks(dto, null)).resolves.toEqual(result);
    });
  });

  describe('getTaskById', () => {
    it('getTaskById_happy_path', () => {
      const task: Task = {
        id: "123",
        title: 'title123',
        description: "desc",
        status: TaskStatus.IN_PROGRESS,
        user: null
      };
      const user: User = {
        id: 'user_id_123',
        username: "username123",
        password: "password123",
        tasks: []
      };
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(task);

      expect(tasksService.getTaskById('task_id_123', user)).resolves.toEqual({
        id: "123",
        title: 'title123',
        description: "desc",
        status: TaskStatus.IN_PROGRESS,
        user: null
      });
    });
  });

  describe('getTaskById', () => {
    it('getTaskById_task_not_found', async () => {
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(null);

      expect.assertions(2);

      expect(tasksService.getTaskById('task_id_123', null)).rejects
        .toThrowError("Task with id = task_id_123 not found");
      expect(tasksService.getTaskById('task_id_123', null)).rejects
        .toThrowError(NotFoundException);
    });
  });

});