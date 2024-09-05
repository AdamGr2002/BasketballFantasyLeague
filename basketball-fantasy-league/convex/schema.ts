import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    teamName: v.string(),
  }),
  players: defineTable({
    name: v.string(),
    position: v.string(),
    stats: v.object({
      points: v.number(),
      rebounds: v.number(),
      assists: v.number(),
      steals: v.number(),
      blocks: v.number(),
    }),
    teamId: v.string(),
  }),
  teams: defineTable({
    name: v.string(),
    ownerId: v.string(),
    players: v.array(v.string()),
    totalPoints: v.number(),
    rank: v.number(),
  }),
});