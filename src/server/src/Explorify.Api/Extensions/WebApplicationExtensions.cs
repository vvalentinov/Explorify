namespace Explorify.Api.Extensions;

public static class WebApplicationExtensions
{
    public static void ConfigureMiddlewarePipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app
                .UseSwagger()
                .UseSwaggerUI();
        }

        app
            .UseHttpsRedirection()
            .UseAuthentication()
            .UseAuthorization();

        app.MapControllers();
    }
}
