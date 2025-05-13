using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Explorify.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddThumbUrlToPlace : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThumbUrl",
                table: "Places",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Url",
                table: "PlacePhotos",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbUrl",
                table: "Places");

            migrationBuilder.AlterColumn<string>(
                name: "Url",
                table: "PlacePhotos",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);
        }
    }
}
