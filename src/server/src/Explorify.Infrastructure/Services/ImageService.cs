using System.Collections.Concurrent;

using Explorify.Application.Abstractions.Models;
using Explorify.Application.Abstractions.Interfaces;

using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace Explorify.Infrastructure.Services;

public class ImageService : IImageService
{
    private const int PlaceImageBoxWidth = 700;
    private const int PlaceThumbnailWidth = 300;

    private const int ProfileThumbnailWidth = 150;

    public async Task<IEnumerable<UploadFile>> ProcessPlaceImagesAsync(IEnumerable<UploadFile> files)
    {
        var processedFiles = new ConcurrentBag<UploadFile>();

        var fileList = files.ToList();

        var tasks = fileList
            .Select((file, index) => new { File = file, Index = index })
            .Select(async x =>
        {
            var uploadFile = x.File;
            var index = x.Index;

            try
            {
                using var image = await Image.LoadAsync(uploadFile.Content);

                image.Metadata.ExifProfile = null;

                int width = image.Width;
                int height = image.Height;

                if (width > PlaceImageBoxWidth)
                {
                    width = PlaceImageBoxWidth;
                    height = (int)((double)PlaceImageBoxWidth / image.Width * image.Height);
                }

                image.Mutate(i => i.Resize(new Size(width, height)));

                var mainStream = new MemoryStream();

                await image.SaveAsJpegAsync(mainStream, new JpegEncoder { Quality = 75 });

                mainStream.Position = 0;

                processedFiles.Add(new UploadFile
                {
                    Content = mainStream,
                    FileName = Path.ChangeExtension(uploadFile.FileName, ".jpg"),
                    ContentType = "image/jpeg",
                });

                if (index == 0)
                {
                    var thumb = image.Clone(x =>
                    {
                        int thumbHeight = (int)((double)PlaceThumbnailWidth / image.Width * image.Height);
                        x.Resize(new Size(PlaceThumbnailWidth, thumbHeight));
                    });

                    var thumbStream = new MemoryStream();

                    await thumb.SaveAsJpegAsync(thumbStream, new JpegEncoder { Quality = 75 });

                    thumbStream.Position = 0;

                    processedFiles.Add(new UploadFile
                    {
                        Content = thumbStream,
                        FileName = "thumb_" + Path.ChangeExtension(uploadFile.FileName, ".jpg"),
                        ContentType = "image/jpeg",
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing {uploadFile.FileName}: {ex.Message}");
            }
            finally
            {
                uploadFile.Content.Dispose();
            }
        });

        await Task.WhenAll(tasks);

        return [.. processedFiles];
    }

    public async Task<UploadFile> ProcessProfileImageAsync(UploadFile file)
    {
        var result = new UploadFile();

        try
        {
            using var image = await Image.LoadAsync(file.Content);

            image.Metadata.ExifProfile = null;

            int width = image.Width;
            int height = image.Height;

            if (width > ProfileThumbnailWidth)
            {
                width = ProfileThumbnailWidth;
                height = (int)((double)ProfileThumbnailWidth / image.Width * image.Height);
            }

            image.Mutate(i => i.Resize(new Size(width, height)));

            var mainStream = new MemoryStream();

            await image.SaveAsJpegAsync(mainStream);

            mainStream.Position = 0;

            result.Content = mainStream;
            result.FileName = Path.ChangeExtension(file.FileName, ".jpg");
            result.ContentType = "image/jpeg";
        }
        catch (UnknownImageFormatException)
        {
            Console.WriteLine($"Invalid image file: {file.FileName}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error processing image {file.FileName}: {ex.Message}");
        }

        return result;
    }
}
