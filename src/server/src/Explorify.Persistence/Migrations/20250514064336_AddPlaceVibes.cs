using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Explorify.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPlaceVibes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PlaceVibes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaceVibes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlaceVibeAssignments",
                columns: table => new
                {
                    PlaceVibeId = table.Column<int>(type: "int", nullable: false),
                    PlaceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaceVibeAssignments", x => new { x.PlaceId, x.PlaceVibeId });
                    table.ForeignKey(
                        name: "FK_PlaceVibeAssignments_PlaceVibes_PlaceVibeId",
                        column: x => x.PlaceVibeId,
                        principalTable: "PlaceVibes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PlaceVibeAssignments_Places_PlaceId",
                        column: x => x.PlaceId,
                        principalTable: "Places",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlaceVibeAssignments_PlaceVibeId",
                table: "PlaceVibeAssignments",
                column: "PlaceVibeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlaceVibeAssignments");

            migrationBuilder.DropTable(
                name: "PlaceVibes");
        }
    }
}
