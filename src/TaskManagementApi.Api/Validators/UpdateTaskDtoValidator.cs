using FluentValidation;
using TaskManagementApi.Api.DTOs;

namespace TaskManagementApi.Api.Validators;

public class UpdateTaskDtoValidator : AbstractValidator<UpdateTaskDto> {
    public UpdateTaskDtoValidator() {
        RuleFor(x => x.Title)
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters")
            .When(x => x.Title != null);

        RuleFor(x => x.DueDate)
            .GreaterThan(DateTime.UtcNow).WithMessage("Due date must be in the future")
            .When(x => x.DueDate.HasValue);

        // Optional: ensure at least one field is provided
        RuleFor(x => x)
            .Must(x => x.Title != null || x.Description != null || x.IsCompleted.HasValue || x.DueDate.HasValue)
            .WithMessage("At least one field must be provided for update");
    }
}
