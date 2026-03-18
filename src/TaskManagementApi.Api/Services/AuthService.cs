using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementApi.Api.Data;
using TaskManagementApi.Api.DTOs;
using TaskManagementApi.Api.Models;
using TaskManagementApi.Api.Services;
namespace TaskManagementApi.Api.Services;

using System.Globalization;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt;
using Microsoft.IdentityModel.Tokens;
using TaskManagementApi.Api.Exceptions;
using TaskManagementApi.Api.Repositories;
using BCrypt.Net;
public class AuthService : IAuthService {
    // private readonly AppDbContext _context;
    // private readonly IConfiguration _configuration;
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly ILogger<TaskService> _logger;


    // public AuthService(AppDbContext context, IConfiguration configuration)
    // {
    //     _context = context;
    //     _configuration = configuration;
    // }

    public AuthService(IUserRepository userRepository, IConfiguration configuration, ILogger<TaskService> logger) {
        _userRepository = userRepository;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<UserResponseDto> RegisterAsync(RegisterDto registerDto) {
        // 1. Check if username or email already exists
        if (await _userRepository.ExistsAsync(registerDto.Username, registerDto.Email)) {
            _logger.LogWarning("Registration attempt with existing username/email: {Username}, {Email}", registerDto.Username, registerDto.Email);
            throw new DuplicateException("Username or email already exists.");
        }
        // 2. Create new user object
        var user = new User {
            Id = Guid.NewGuid(),
            UserName = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = BCrypt.HashPassword(registerDto.Password), // We'll add BCrypt package
            CreatedAt = DateTime.UtcNow
        };

        // 3. Save to database
        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        //Logger
        _logger.LogInformation("User {Username} registered successfully.", user.UserName);


        // 4. Return response DTO
        return new UserResponseDto {
            Id = user.Id,
            Username = user.UserName,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };
    }


    public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto) {
        var user = await _userRepository.GetByUsernameOrEmailAsync(loginDto.UsernameOrEmail);
        if (user == null || !BCrypt.Verify(loginDto.Password, user.PasswordHash)) {
            _logger.LogWarning("Failed login attempt for {UsernameOrEmail}", loginDto.UsernameOrEmail);
            throw new UnauthorizedAccessException("Invalid credentials");
        }
        // 2. Verify password
        bool isPasswordValid = BCrypt.Verify(loginDto.Password, user.PasswordHash);
        if (!isPasswordValid)
            throw new UnauthorizedAccessException("Invalid credentials");

        // 3. Generate JWT token
        var token = GenerateJwtToken(user);

        // 4. Return response
        var expiresInMinutes = Convert.ToDouble(_configuration["Jwt:ExpiresInMinutes"], CultureInfo.InvariantCulture);
        return new LoginResponseDto {
            Token = token,
            Expiration = DateTime.UtcNow.AddMinutes(expiresInMinutes),
            User = new UserResponseDto {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            }
        };
    }

    private string GenerateJwtToken(User user) {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
{
    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Add this
    new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
    new Claim(JwtRegisteredClaimNames.Email, user.Email),
    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
};


        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpiresInMinutes"])),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
