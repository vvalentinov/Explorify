using Azure.Monitor.OpenTelemetry.AspNetCore;
using Explorify.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServices(builder.Configuration);

var connectionString = builder.Configuration["AzureMonitor:ConnectionString"];

builder
    .Services
    .AddOpenTelemetry()
    .UseAzureMonitor(o => o.ConnectionString = connectionString);

var app = builder.Build();

(await app.SeedDatabaseAsync())
    .ConfigureMiddlewarePipeline()
    .MapHubs();

app.Run();
