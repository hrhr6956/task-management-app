using Microsoft.AspNetCore.Mvc;
using TaskManagementApi.Api.DTOs;
using TaskManagementApi.Api.Models;
using TaskManagementApi.Api.Repositories;
using Microsoft.EntityFrameworkCore;
using TaskManagementApi.Api.Exceptions;

namespace TaskManagementApi.Api.Services;


public class TaskService : ITaskService {
    private readonly ITaskRepository _taskRepository;
    private readonly ILogger<TaskService> _logger;
    public TaskService(ITaskRepository taskRepository, ILogger<TaskService> logger) {
        _taskRepository = taskRepository;
        _logger = logger;
    }

    public async Task<PagedResult<TaskResponseDto>> GetUserTasksAsync(Guid userId, TaskFilterDto filter) {
        var query = _taskRepository.GetUserTasksQueryable(userId);

        //temp log for debugging
        // _logger.LogInformation("Expired filter value: {Expired}", filter.Expired);
        // _logger.LogInformation("Total tasks before filter: {Count}", await query.CountAsync());

        // Apply filtering
        if (filter.IsCompleted.HasValue) {
            query = query.Where(t => t.IsCompleted == filter.IsCompleted.Value);
        }

        if (filter.DueDateFrom.HasValue) {
            query = query.Where(t => t.DueDate >= filter.DueDateFrom.Value);
        }

        if (filter.DueDateTo.HasValue) {
            query = query.Where(t => t.DueDate <= filter.DueDateTo.Value);
        }
        if (filter.Expired == true) {
            var now = DateTime.UtcNow;
            query = query.Where(t => t.DueDate < now && !t.IsCompleted);
            // _logger.LogInformation("After expired filter, tasks count: {Count}", await query.CountAsync());
        }
        // Apply sorting
        query = (filter.SortBy?.ToLower()) switch {
            "duedate" => filter.SortOrder?.ToLower() == "desc"
                ? query.OrderByDescending(t => t.DueDate)
                : query.OrderBy(t => t.DueDate),
            "createdat" => filter.SortOrder?.ToLower() == "desc"
                ? query.OrderByDescending(t => t.CreatedAt)
                : query.OrderBy(t => t.CreatedAt),
            _ => query.OrderBy(t => t.DueDate) // default sort
        };

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(t => new TaskResponseDto {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                DueDate = t.DueDate,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                UserId = t.UserId
            })
            .ToListAsync();

        return new PagedResult<TaskResponseDto> {
            Items = items,
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize
        };
    }
    public async Task<TaskResponseDto?> GetTaskByIdAsync(Guid taskId, Guid userId) {
        var task = await _taskRepository.GetUserTaskByIdAsync(taskId, userId);
        if (task == null) throw new NotFoundException($"Task with ID {taskId} not found.");

        return new TaskResponseDto {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            UserId = task.UserId
        };
    }

    public async Task<TaskResponseDto> CreateTaskAsync(Guid userId, CreateTaskDto createTaskDto) {
        var task = new TaskItem {
            Id = Guid.NewGuid(),
            Title = createTaskDto.Title,
            Description = createTaskDto.Description,
            DueDate = createTaskDto.DueDate,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            UserId = userId
        };

        await _taskRepository.AddAsync(task);
        await _taskRepository.SaveChangesAsync();

        // _logger.LogInformation("User {UserId} created a new task with ID {TaskId}.", userId, task.Id);

        return MapToDto(task);
    }

    public async Task<TaskResponseDto> UpdateTaskAsync(Guid taskId, Guid userId, UpdateTaskDto updateTaskDto) {
        var task = await _taskRepository.GetUserTaskByIdAsync(taskId, userId);
        if (task == null) {
            _logger.LogWarning("Update failed: Task with ID {TaskId} for user {UserId} not found.", taskId, userId);
            throw new NotFoundException($"Task with ID {taskId} not found.");
        }

        // Update only provided fields
        if (updateTaskDto.Title != null)
            task.Title = updateTaskDto.Title;
        if (updateTaskDto.Description != null)
            task.Description = updateTaskDto.Description;
        if (updateTaskDto.IsCompleted.HasValue)
            task.IsCompleted = updateTaskDto.IsCompleted.Value;
        if (updateTaskDto.DueDate != null)
            task.DueDate = updateTaskDto.DueDate;

        task.UpdatedAt = DateTime.UtcNow;

        _taskRepository.Update(task);
        await _taskRepository.SaveChangesAsync();

        // _logger.LogInformation("User {UserId} updated task {TaskId}.", userId, taskId);

        return MapToDto(task);
    }

    public async Task DeleteTaskAsync(Guid taskId, Guid userId) {
        var task = await _taskRepository.GetUserTaskByIdAsync(taskId, userId);
        if (task == null) {
            _logger.LogWarning("Delete failed: Task with ID {TaskId} for user {UserId} not found.", taskId, userId);
            throw new NotFoundException($"Task with ID {taskId} not found.");
        }

        _taskRepository.Delete(task);
        await _taskRepository.SaveChangesAsync();

        // _logger.LogInformation("User {UserId} deleted task {TaskId}.", userId, taskId);
    }


    //HELPER METHOD TO AVOID CODE DUPLICATION
    private TaskResponseDto MapToDto(TaskItem task) {
        return new TaskResponseDto {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            UserId = task.UserId
        };
    }
}
