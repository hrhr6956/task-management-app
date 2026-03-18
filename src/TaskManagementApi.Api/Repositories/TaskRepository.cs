using Microsoft.EntityFrameworkCore;
using TaskManagementApi.Api.Data;
using TaskManagementApi.Api.Models;

namespace TaskManagementApi.Api.Repositories;

public class TaskRepository : Repository<TaskItem>, ITaskRepository {
    public TaskRepository(AppDbContext context) : base(context) {
    }

    public async Task<IEnumerable<TaskItem>> GetUserTasksAsync(Guid userId) {
        return await _dbSet.Where(t => t.UserId == userId).ToListAsync();
    }

    public async Task<TaskItem?> GetUserTaskByIdAsync(Guid taskId, Guid userId) {
        return await _dbSet.FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
    }
    public IQueryable<TaskItem> GetUserTasksQueryable(Guid userId) {
        return _dbSet.Where(t => t.UserId == userId);
    }
}
