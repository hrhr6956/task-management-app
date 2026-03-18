using System.Net;
using System.Text.Json;
using TaskManagementApi.Api.DTOs;
using TaskManagementApi.Api.Exceptions;

namespace TaskManagementApi.Api.Middleware;

public class ExceptionHandlingMiddleware {
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IWebHostEnvironment _env;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IWebHostEnvironment env) {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context) {
        try {
            await _next(context);
        }
        catch (Exception ex) {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception) {
        _logger.LogError(exception, "An unhandled exception occurred.");

        var response = context.Response;
        response.ContentType = "application/json";

        var errorResponse = new ErrorResponse {
            // Default to 500 if not specified
            StatusCode = (int)HttpStatusCode.InternalServerError,
            Message = "An error occurred while processing your request."
        };

        // custom based on exception type
        switch (exception) {
            case NotFoundException notFound:
                errorResponse.StatusCode = (int)HttpStatusCode.NotFound;
                errorResponse.Message = notFound.Message;
                break;

            case DuplicateException duplicate:
                errorResponse.StatusCode = (int)HttpStatusCode.Conflict;
                errorResponse.Message = duplicate.Message;
                break;

            case UnauthorizedException unauthorized:
                errorResponse.StatusCode = (int)HttpStatusCode.Unauthorized;
                errorResponse.Message = "You are not authorized.";
                break;

            case ValidationException validationEx: // If using FluentValidation, you might handle differently
                errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse.Message = "Validation failed.";
                errorResponse.Details = validationEx.Message;
                break;

            default:
                if (_env.IsDevelopment()) {
                    errorResponse.Details = exception.ToString(); // Stack trace
                }
                break;
        }

        response.StatusCode = errorResponse.StatusCode;

        var json = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await response.WriteAsync(json);
    }
}
