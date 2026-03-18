using TaskManagementApi.Api.DTOs;

namespace TaskManagementApi.Api.Services {

    public interface IAuthService {
        Task<UserResponseDto> RegisterAsync(RegisterDto registerDto);

        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
    }
}
