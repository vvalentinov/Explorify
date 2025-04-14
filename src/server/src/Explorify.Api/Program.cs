using Explorify.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServices(builder.Configuration);

var app = builder.Build();

app.ConfigureMiddlewarePipeline();

app.Run();
