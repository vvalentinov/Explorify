using SendGrid;
using SendGrid.Helpers.Mail;
using Explorify.Application.Abstractions.Email;

using Microsoft.Extensions.Configuration;
using Explorify.Application.Abstractions.Models;
using System.Web;

namespace Explorify.Infrastructure.Services;

public class SendGridEmailSender : IEmailSender
{
    private readonly IConfiguration _configuration;

    public SendGridEmailSender(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(
        string from,
        string fromName,
        string to,
        string subject,
        string htmlContent,
        IEnumerable<EmailAttachment>? attachments = null)
    {
        if (string.IsNullOrWhiteSpace(subject) && string.IsNullOrWhiteSpace(htmlContent))
        {
            throw new ArgumentException("Subject and message should be provided.");
        }

        var fromAddress = new EmailAddress(from, fromName);
        var toAddress = new EmailAddress(to);
        var message = MailHelper.CreateSingleEmail(
            fromAddress,
            toAddress,
            subject,
            null,
            htmlContent);

        if (attachments?.Any() == true)
        {
            foreach (var attachment in attachments)
            {
                message.AddAttachment(
                    attachment.FileName,
                    Convert.ToBase64String(attachment.Content),
                    attachment.MimeType);
            }
        }

        try
        {
            var apiKey = _configuration.GetSection("SendGrid")["ApiKey"];
            var client = new SendGridClient(apiKey);
            var response = await client.SendEmailAsync(message);
            Console.WriteLine(response.StatusCode);
            Console.WriteLine(await response.Body.ReadAsStringAsync());
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }


    public async Task<Result> SendEmailChangeConfirmationAsync(
        string userId,
        string email,
        string changeEmailLink)
    {
        var msg = new SendGridMessage
        {
            From = new EmailAddress("noreply@explorify.click", "Explorify"),
            TemplateId = _configuration["SendGridSettings:ConfirmEmailTemplateId"],
            Personalizations = new List<Personalization>
            {
                new Personalization
                {
                    Tos = new List<EmailAddress> { new EmailAddress(email) },
                    TemplateData = new Dictionary<string, object>
                    {
                        { "safeLink", changeEmailLink }
                    }
                }
            }
        };

        var client = new SendGridClient(_configuration["SendGridSettings:ApiKey"]);
        var response = await client.SendEmailAsync(msg);

        return response.IsSuccessStatusCode
            ? Result.Success($"Email sent to: {email}")
            : Result.Failure(new Error("Failed to send confirmation email.", ErrorType.Validation));
    }

    public async Task<Result> SendWelcomeEmailAsync(string email)
    {
        var msg = new SendGridMessage
        {
            From = new EmailAddress("noreply@explorify.click", "Explorify"),
            TemplateId = _configuration["SendGridSettings:WelcomeEmailTemplateId"],
            Personalizations = new List<Personalization>
            {
                new Personalization
                {
                    Tos = new List<EmailAddress> { new EmailAddress(email) }
                }
            }
        };

        var client = new SendGridClient(_configuration["SendGridSettings:ApiKey"]);
        var response = await client.SendEmailAsync(msg);

        return response.IsSuccessStatusCode
            ? Result.Success($"Email sent to: {email}")
            : Result.Failure(new Error("Failed to send welcome email.", ErrorType.Validation));
    }
}
