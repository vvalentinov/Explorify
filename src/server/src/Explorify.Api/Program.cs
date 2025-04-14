using Explorify.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServices(builder.Configuration);

var app = builder.Build();

await app.SeedDatabaseAsync();

app.ConfigureMiddlewarePipeline();

app.Run();
