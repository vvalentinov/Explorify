namespace Explorify.Application.Place.GetPlace;

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
                ur.Rating AS UserReviewRating,
                ur.Content AS UserReviewContent,
                COALESCE(AVG(CAST(ar.Rating AS FLOAT)), 0) AS AvgRating,
                u.Id AS UserId,
                u.UserName,
                u.ProfileImageUrl AS UserProfileImageUrl,
                c.[Name] AS CountryName,
                CAST(CASE WHEN EXISTS (
                    SELECT 1 FROM FavoritePlaces fp WHERE fp.PlaceId = p.Id AND fp.UserId = @UserId
                ) THEN 1 ELSE 0 END AS BIT) AS IsFavPlace
            FROM Places AS p
            -- This gets the review written by the place's owner
            LEFT JOIN Reviews AS ur ON ur.PlaceId = p.Id AND ur.UserId = p.UserId
            -- This gets all APPROVED reviews for the average
            LEFT JOIN Reviews AS ar ON ar.PlaceId = p.Id AND ar.IsApproved = 1
            JOIN AspNetUsers AS u ON u.Id = p.UserId
            JOIN Countries AS c ON c.Id = p.CountryId
            WHERE p.Id = @PlaceId
            GROUP BY
                p.Id, p.[Name], p.Description, p.SlugifiedName, p.IsApproved, p.IsDeleted, p.Latitude, p.Longitude,
                ur.Rating, ur.Content,
                u.Id, u.UserName, u.ProfileImageUrl,
                c.[Name]
            
            
            SELECT Url FROM PlacePhotos WHERE PlaceId = @PlaceId AND IsDeleted = 0;
            
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
            WHERE PlaceId = (SELECT Id FROM Places WHERE SlugifiedName = @SlugifiedName) AND IsDeleted = 0;

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
            ur.Rating AS UserReviewRating,
            ur.Content AS UserReviewContent,
            COALESCE(AVG(CAST(ar.Rating AS FLOAT)), 0) AS AvgRating,
            u.Id AS UserId,
            u.UserName,
            u.ProfileImageUrl AS UserProfileImageUrl,
            c.[Name] AS CountryName
        FROM Places AS p
        LEFT JOIN Reviews AS ur ON ur.PlaceId = p.Id AND ur.UserId = p.UserId
        LEFT JOIN Reviews AS ar ON ar.PlaceId = p.Id AND ar.IsApproved = 1
        JOIN AspNetUsers AS u ON u.Id = p.UserId
        JOIN Countries AS c ON c.Id = p.CountryId
        WHERE p.Id = @PlaceId
        GROUP BY
            p.Id, p.[Name], p.Description, p.SlugifiedName, p.IsApproved, p.IsDeleted,
            p.Latitude, p.Longitude,
            ur.Rating, ur.Content,
            u.Id, u.UserName, u.ProfileImageUrl,
            c.[Name];

        SELECT Url FROM PlacePhotos WHERE PlaceId = @PlaceId AND IsDeleted = 0;

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
