﻿using Explorify.Domain.Abstractions.Contracts;

namespace Explorify.Domain.Abstractions.Models;

public abstract class BaseEntity : IAuditInfo
{
    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }
}

public abstract class BaseEntity<TKey> : BaseEntity
{
    public TKey Id { get; set; } = default!;
}
