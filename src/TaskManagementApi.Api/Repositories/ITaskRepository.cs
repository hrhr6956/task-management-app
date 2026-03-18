using TaskManagementApi.Api.Models;

namespace TaskManagementApi.Api.Repositories;

public interface ITaskRepository : IRepository<TaskItem> {
    IQueryable<TaskItem> GetUserTasksQueryable(Guid userId);
    Task<IEnumerable<TaskItem>> GetUserTasksAsync(Guid userId);
    Task<TaskItem?> GetUserTaskByIdAsync(Guid taskId, Guid userId);
}
