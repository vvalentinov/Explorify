namespace Explorify.Domain.Constants;

public static class EmailConstants
{
    public static string GetEmailConfirmBody(string username, string safeLink)
    {
        return @$"
                <div style=""font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#333;"">
                    <p>Hi {username}</p>

                    <p>
                        <a href=""{safeLink}"" 
                           style=""background-color:#007bff;color:#fff;padding:10px 20px;text-decoration:none;
                                  font-weight:bold;border-radius:5px;display:inline-block;"">
                            Confirm Email
                        </a>
                    </p>

                    <p>If the button doesn’t work for you, copy and paste the following URL into your browser:
                        <br />
                        <a href=""{safeLink}"" style=""color:#007bff;text-decoration:none;"">{safeLink}</a>
                    </p>

                    <p>If you did not sign up for this account, please ignore this email.</p>

                    <p>Thanks,<br />
                    Explorify Team</p>
                </div>";
    }

    public static string GetEmailChangeBody(string safeLink)
    {
        return @$"
                <div style=""font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#333;"">

                    <p>
                        <a href=""{safeLink}"" 
                           style=""background-color:#007bff;color:#fff;padding:10px 20px;text-decoration:none;
                                  font-weight:bold;border-radius:5px;display:inline-block;"">
                            Confirm Change Email
                        </a>
                    </p>

                    <p>If the button doesn’t work for you, copy and paste the following URL into your browser:
                        <br />
                        <a href=""{safeLink}"" style=""color:#007bff;text-decoration:none;"">{safeLink}</a>
                    </p>

                    <p>If you did not sign up for this account, please ignore this email.</p>

                    <p>Thanks,<br />
                    Explorify Team</p>
                </div>";
    }

    public static string GetPasswordResetBody(string userName, string safeLink)
    {
        return $@"
            <div style=""font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #333; line-height: 1.5; padding: 20px;"">
                <h2 style=""color: #007bff; text-align: center;"">Password Reset Request</h2>
                <p style=""margin-bottom: 20px;"">Hi {userName},</p>
                
                <p>We received a request to reset your password for your <strong>Explorify</strong> account. If you made this request,  please   click the button below to reset your password:</p>
                
                <div style=""text-align: center; margin: 20px 0;"">
                    <a href=""{safeLink}"" 
                       style=""background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; font-weight: bold; border-    radius:     5px; display: inline-block;"">
                        Reset Password
                    </a>
                </div>
                
                <p>If the button above doesn’t work, copy and paste the following URL into your browser:</p>
                <p style=""background-color: #f8f9fa; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"">
                    <a href=""{safeLink}"" style=""color: #007bff; text-decoration: none;"">{safeLink}</a>
                </p>
                
                <p>If you did not request to reset your password, please ignore this email or contact support if you have concerns.</p>
                
                <p style=""margin-top: 30px;"">Thank you,<br />The Explorify Team</p>
            </div>";
    }
}
