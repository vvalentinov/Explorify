﻿namespace Explorify.Application.Place.GetPlace;

public static class GetPlaceSqlGenerator
{
    public static string GetPlaceByIdForUser()
    {
        var sql =
            """
            
            SELECT
                p.Id,
                p.[Name],
                p.Description,
                p.SlugifiedName,
                p.IsApproved,
                p.IsDeleted,
                p.Latitude,
                p.Longitude,
                r.Rating AS UserReviewRating,
                r.Content AS UserReviewContent,
                AVG(r.Rating) OVER (PARTITION BY p.Id) AS AvgRating,
                u.Id AS UserId,
                u.UserName,
                u.ProfileImageUrl AS UserProfileImageUrl,
                CAST(CASE WHEN EXISTS (
                    SELECT 1 FROM FavoritePlaces fp WHERE fp.PlaceId = p.Id AND fp.UserId = @UserId
                ) THEN 1 ELSE 0 END AS BIT) AS IsFavPlace
            FROM Places AS p
            JOIN Reviews AS r ON r.PlaceId = p.Id AND r.UserId = p.UserId
            JOIN AspNetUsers AS u ON u.Id = p.UserId
            WHERE p.Id = @PlaceId;
            
            SELECT Url FROM PlacePhotos WHERE PlaceId = @PlaceId;
            
            SELECT
                pv.Id,
                pv.Name
            FROM Places p
            JOIN PlaceVibeAssignments pva ON pva.PlaceId = p.Id
            JOIN PlaceVibes pv ON pva.PlaceVibeId = pv.Id
            WHERE p.Id = @PlaceId;
            
            """;

        return sql;
    }

    public static string GetPlaceBySlugifiedNameForUser()
    {
        return
        """
            -- Main place details with user review and favorite status
            SELECT
                p.Id,
                p.[Name],
                p.Description,
                p.SlugifiedName,
                p.IsApproved,
                p.IsDeleted,
                p.Latitude,
                p.Longitude,
                r.Rating AS UserReviewRating,
                r.Content AS UserReviewContent,
                AVG(r.Rating) OVER (PARTITION BY p.Id) AS AvgRating,
                u.Id AS UserId,
                u.UserName,
                u.ProfileImageUrl AS UserProfileImageUrl,
                CAST(CASE WHEN EXISTS (
                    SELECT 1 FROM FavoritePlaces fp WHERE fp.PlaceId = p.Id AND fp.UserId = @UserId
                ) THEN 1 ELSE 0 END AS BIT) AS IsFavPlace
            FROM Places AS p
            JOIN Reviews AS r ON r.PlaceId = p.Id AND r.UserId = p.UserId
            JOIN AspNetUsers AS u ON u.Id = p.UserId
            WHERE p.SlugifiedName = @SlugifiedName;

            SELECT
                Url
            FROM PlacePhotos
            WHERE PlaceId = (SELECT Id FROM Places WHERE SlugifiedName = @SlugifiedName);

            SELECT
                pv.Id,
                pv.Name
            FROM Places p
            JOIN PlaceVibeAssignments pva ON pva.PlaceId = p.Id
            JOIN PlaceVibes pv ON pva.PlaceVibeId = pv.Id
            WHERE p.SlugifiedName = @SlugifiedName;
    """;
    }

    public static string GetPlaceByIdForAdmin()
    {
        var sql =
            """
            
            SELECT
                p.Id,
                p.[Name],
                p.Description,
                p.SlugifiedName,
                p.IsApproved,
                p.IsDeleted,
                p.Latitude,
                p.Longitude,
                r.Rating AS UserReviewRating,
                r.Content AS UserReviewContent,
                u.Id AS UserId,
                u.UserName,
                u.ProfileImageUrl AS UserProfileImageUrl
            FROM Places AS p
            JOIN Reviews AS r ON r.PlaceId = p.Id AND r.UserId = p.UserId
            JOIN AspNetUsers AS u ON u.Id = p.UserId
            WHERE p.Id = @PlaceId;
            
            SELECT Url FROM PlacePhotos WHERE PlaceId = @PlaceId;
            
            SELECT
                pv.Id,
                pv.Name
            FROM Places p
            JOIN PlaceVibeAssignments pva ON pva.PlaceId = p.Id
            JOIN PlaceVibes pv ON pva.PlaceVibeId = pv.Id
            WHERE p.Id = @PlaceId;
            
            """;

        return sql;
    }
}
