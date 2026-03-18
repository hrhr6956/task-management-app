using Microsoft.EntityFrameworkCore;
using TaskManagementApi.Api.Data;
using TaskManagementApi.Api.Models;

namespace TaskManagementApi.Api.Repositories;

public class UserRepository : Repository<User>, IUserRepository {
    public UserRepository(AppDbContext context) : base(context) {
    }

    public async Task<User?> GetByUsernameOrEmailAsync(string usernameOrEmail) {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.UserName == usernameOrEmail || u.Email == usernameOrEmail);
    }

    public async Task<bool> ExistsAsync(string username, string email) {
        return await _dbSet.AnyAsync(u => u.UserName == username || u.Email == email);
    }
}
