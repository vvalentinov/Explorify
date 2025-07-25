﻿using Explorify.Application.Abstractions.Interfaces.Messaging;

namespace Explorify.Application.Reviews.GetReviews.ForPlace;

public record GetReviewsForPlaceQuery(
    Guid CurrentUserId,
    PlaceReviewsRequestDto Model) : IQuery<ReviewsListResponseModel>;
