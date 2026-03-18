using TaskManagementApi.Api.Models;

namespace TaskManagementApi.Api.Repositories;

public interface IUserRepository : IRepository<User> {
    Task<User?> GetByUsernameOrEmailAsync(string usernameOrEmail);
    Task<bool> ExistsAsync(string username, string email);
}
