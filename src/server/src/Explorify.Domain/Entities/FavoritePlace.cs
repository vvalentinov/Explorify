﻿using Explorify.Domain.Abstractions.Models;

namespace Explorify.Domain.Entities;

public class FavoritePlace : BaseModel
{
    public Guid PlaceId { get; set; }

    public Place Place { get; set; } = default!;

    public Guid UserId { get; set; }
}
