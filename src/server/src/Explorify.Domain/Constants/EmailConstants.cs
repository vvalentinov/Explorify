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
}
