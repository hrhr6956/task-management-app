using Microsoft.AspNetCore.Mvc;
using TaskManagementApi.Api.DTOs;
using TaskManagementApi.Api.Services;

namespace TaskManagementApi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase {
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto) {
        var result = await _authService.RegisterAsync(registerDto);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto) {

        var result = await _authService.LoginAsync(loginDto);
        return Ok(result);

    }
}
