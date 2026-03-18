namespace TaskManagementApi.Api.DTOs;

public class TaskFilterDto {
    public bool? IsCompleted { get; set; }
    public bool? Expired { get; set; }
    public DateTime? DueDateFrom { get; set; }
    public DateTime? DueDateTo { get; set; }
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
