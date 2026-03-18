using TaskManagementApi.Api.DTOs;

namespace TaskManagementApi.Api.Services;

public interface ITaskService {
    Task<PagedResult<TaskResponseDto>> GetUserTasksAsync(Guid userId, TaskFilterDto filter);
    Task<TaskResponseDto?> GetTaskByIdAsync(Guid taskId, Guid userId);
    Task<TaskResponseDto> CreateTaskAsync(Guid userId, CreateTaskDto createTaskDto);
    Task<TaskResponseDto> UpdateTaskAsync(Guid taskId, Guid userId, UpdateTaskDto updateTaskDto);
    Task DeleteTaskAsync(Guid taskId, Guid userId);
}
