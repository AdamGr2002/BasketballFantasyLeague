import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper function to fetch data from the API
async function fetchFromAPI(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Mutation to import players
export const importPlayers = mutation({
  args: {},
  handler: async (ctx) => {
    const apiUrl = "https://www.balldontlie.io/api/v1/players?per_page=100";
    const data = await fetchFromAPI(apiUrl);

    for (const player of data.data) {
      await ctx.db.insert("players", {
        name: `${player.first_name} ${player.last_name}`,
        position: player.position || "Unknown",
        stats: {
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
        },
        teamId: "", // We'll update this later when we create teams
      });
    }

    return `Imported ${data.data.length} players`;
  },
});

// Mutation to import teams
export const importTeams = mutation({
  args: {},
  handler: async (ctx) => {
    const apiUrl = "https://www.balldontlie.io/api/v1/teams";
    const data = await fetchFromAPI(apiUrl);

    for (const team of data.data) {
      await ctx.db.insert("teams", {
        name: team.full_name,
        ownerId: "", // We'll update this when users claim teams
        players: [],
        totalPoints: 0,
        rank: 0,
      });
    }

    return `Imported ${data.data.length} teams`;
  },
});

// Mutation to import player stats
export const importPlayerStats = mutation({
  args: { season: v.number() },
  handler: async (ctx, args) => {
    const players = await ctx.db.query("players").collect();
    let updatedCount = 0;

    for (const player of players) {
      const apiUrl = `https://www.balldontlie.io/api/v1/season_averages?season=${args.season}&player_ids[]=${player.id}`;
      const data = await fetchFromAPI(apiUrl);

      if (data.data.length > 0) {
        const stats = data.data[0];
        await ctx.db.patch(player._id, {
          stats: {
            points: stats.pts || 0,
            rebounds: stats.reb || 0,
            assists: stats.ast || 0,
            steals: stats.stl || 0,
            blocks: stats.blk || 0,
          },
        });
        updatedCount++;
      }
    }

    return `Updated stats for ${updatedCount} players`;
  },
});