using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Admin.GetDashboardInfo;

public record GetDashboardInfoQuery()
    : IQuery<GetDashboardInfoResponseModel>;
