using FluentValidation;
using TaskManagementApi.Api.DTOs;

namespace TaskManagementApi.Api.Validators;

public class CreateTaskDtoValidator : AbstractValidator<CreateTaskDto> {
    public CreateTaskDtoValidator() {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.DueDate)
            .GreaterThan(DateTime.UtcNow).WithMessage("Due date must be in the future")
            .When(x => x.DueDate.HasValue);
    }
}
