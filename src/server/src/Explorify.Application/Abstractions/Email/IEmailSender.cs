﻿namespace Explorify.Application.Abstractions.Email;

public interface IEmailSender
{
    Task SendEmailAsync(
            string from,
            string fromName,
            string to,
            string subject,
            string htmlContent,
            IEnumerable<EmailAttachment>? attachments = null);
}
