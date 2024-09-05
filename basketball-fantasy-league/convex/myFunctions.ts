import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

export const createUser = mutation({
  args: { name: v.string(), email: v.string(), teamName: v.string() },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      teamName: args.teamName,
    });
    await ctx.db.insert("teams", {
      name: args.teamName,
      ownerId: userId,
      players: [],
      totalPoints: 0,
      rank: 0,
    });
    return userId;
  },
});

export const getTeam = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const team = await ctx.db
      .query("teams")
      .filter((q) => q.eq(q.field("ownerId"), args.userId))
      .first();
    if (!team) return null;
    const players = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("teamId"), team._id))
      .collect();
    return { ...team, players };
  },
});

export const addPlayerToTeam = mutation({
  args: { teamId: v.string(), playerName: v.string(), position: v.string() },
  handler: async (ctx, args) => {
    const playerId = await ctx.db.insert("players", {
      name: args.playerName,
      position: args.position,
      stats: { points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0 },
      teamId: args.teamId,
    });
    await ctx.db.patch(args.teamId, {
      players: (players) => [...players, playerId],
    });
    return playerId;
  },
});

export const updatePlayerStats = mutation({
  args: {
    playerId: v.string(),
    stats: v.object({
      points: v.number(),
      rebounds: v.number(),
      assists: v.number(),
      steals: v.number(),
      blocks: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, { stats: args.stats });
    // Update team total points
    const player = await ctx.db.get(args.playerId);
    if (player) {
      const team = await ctx.db.get(player.teamId);
      if (team) {
        const newTotalPoints = team.totalPoints + args.stats.points;
        await ctx.db.patch(team._id, { totalPoints: newTotalPoints });
      }
    }
  },
});