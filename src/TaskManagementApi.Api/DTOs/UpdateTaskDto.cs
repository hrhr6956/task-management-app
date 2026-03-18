using System.ComponentModel.DataAnnotations;

namespace TaskManagementApi.Api.DTOs;

public class UpdateTaskDto {
    [MaxLength(200)]
    public string? Title { get; set; }

    public string? Description { get; set; }

    public bool? IsCompleted { get; set; }

    public DateTime? DueDate { get; set; }
}
