using System.ComponentModel.DataAnnotations;

namespace TaskManagementApi.Api.Models;

public class User {
    public Guid Id { get; set; }

    [Required]
    public string UserName { get; set; } = string.Empty;

    [EmailAddress]
    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();

}
