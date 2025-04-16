namespace Explorify.Application.Abstractions.Models;

public sealed record Error(
    string Description,
    ErrorType Type)
{
    public static readonly Error None = new Error(string.Empty, ErrorType.Failure);
}

public enum ErrorType
{
    Failure = 0,
    NotFound = 1,
    Validation = 2,
    Conflict = 3,
}
