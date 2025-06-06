using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Explorify.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddBadgesAndUserBadges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Badges",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Badges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserBadges",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BadgeId = table.Column<int>(type: "int", nullable: false),
                    EarnedOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBadges", x => new { x.UserId, x.BadgeId });
                    table.ForeignKey(
                        name: "FK_UserBadges_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserBadges_Badges_BadgeId",
                        column: x => x.BadgeId,
                        principalTable: "Badges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserBadges_BadgeId",
                table: "UserBadges",
                column: "BadgeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserBadges");

            migrationBuilder.DropTable(
                name: "Badges");
        }
    }
}
