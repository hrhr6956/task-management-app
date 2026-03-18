using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TaskManagementApi.Api.DTOs;
using TaskManagementApi.Api.Services;

namespace TaskManagementApi.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase {
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService) {
        _taskService = taskService;
    }

    // Helper to get current user ID from token claims
    private Guid GetUserId() {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            throw new UnauthorizedAccessException("Invalid user token");

        return userId;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyTasks([FromQuery] TaskFilterDto filter) {
        var userId = GetUserId();
        var result = await _taskService.GetUserTasksAsync(userId, filter);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTask(Guid id) {
        var userId = GetUserId();
        var task = await _taskService.GetTaskByIdAsync(id, userId);



        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(CreateTaskDto createTaskDto) {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();
        var task = await _taskService.CreateTaskAsync(userId, createTaskDto);
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(Guid id, UpdateTaskDto updateTaskDto) {
        // Note: ModelState is valid even if all fields are null – we allow partial updates.
        // But you might want to ensure at least one field is provided (optional).
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();
        var updatedTask = await _taskService.UpdateTaskAsync(id, userId, updateTaskDto);



        return Ok(updatedTask);
    }

    [HttpDelete("{id}")]
    public async Task DeleteTask(Guid id) {
        var userId = GetUserId();
        await _taskService.DeleteTaskAsync(id, userId);



    }
}
