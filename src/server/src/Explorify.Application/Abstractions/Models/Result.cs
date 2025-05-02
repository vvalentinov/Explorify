namespace Explorify.Application.Abstractions.Models;

public class Result
{
    private protected Result(
        bool isSuccess,
        Error error,
        string? successMessage = null)
    {
        if (isSuccess && error != Error.None ||
            isSuccess == false && error == Error.None)
        {
            throw new ArgumentException("Invalid error", nameof(error));
        }

        Error = error;
        IsSuccess = isSuccess;
        SuccessMessage = successMessage ?? string.Empty;
    }

    public bool IsSuccess { get; }

    public bool IsFailure => !IsSuccess;

    public string SuccessMessage { get; }

    public Error Error { get; }

    public static implicit operator Result(Error error)
        => Failure(error);

    public static Result Success(string? successMsg = null)
        => new Result(true, Error.None, successMsg);

    public static Result Failure() => new Result(false, Error.None);

    public static Result Failure(Error error)
        => new Result(false, error, string.Empty);

    public static Result<T> Success<T>(T data, string? successMsg = null)
        => new Result<T>(true, Error.None, data, successMsg);

    public static Result<T> Failure<T>(Error error)
        => new Result<T>(false, error, default!, string.Empty);
}

public class Result<T> : Result
{
    public Result(
        bool isSuccess,
        Error error,
        T data,
        string? successMessage = null)
        : base(isSuccess, error, successMessage)
    {
        Data = data;
    }

    public T Data { get; }

    public static implicit operator Result<T>(Error error)
        => Failure<T>(error);
}
