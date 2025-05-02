namespace Explorify.Domain.Constants;

public static class IdentityConstants
{
    public static class ErrorMessages
    {
        public const string LoginFailedError = "Login failed. Try, again!";

        public const string TakenUserNameError = "Looks like username is taken!";

        public const string CouldNotCreateUserError = "Error: Could not create a user!";

        public const string CouldNotAddUserToRoleError = "Error: Could not add user to role!";
    }

    public static class SuccessMessages
    {
        public const string LoginSuccess = "Successfull login!";

        public const string RegisterSuccess = "Successfull register!";
    }
}
