using Explorify.Application.Abstractions.Models;

namespace Explorify.Application.Abstractions.Email;

public interface IEmailSender
{
    Task SendEmailAsync(
            string from,
            string fromName,
            string to,
            string subject,
            string htmlContent,
            IEnumerable<EmailAttachment>? attachments = null);

    Task<Result> SendEmailChangeConfirmationAsync(
        string userId,
        string email,
        string changeEmailLink);

    Task<Result> SendWelcomeEmailAsync(string email);
}
