import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function importData() {
  console.log("Importing players...");
  const playersResult = await client.mutation(api.importData.importPlayers);
  console.log(playersResult);

  console.log("Importing teams...");
  const teamsResult = await client.mutation(api.importData.importTeams);
  console.log(teamsResult);

  console.log("Importing player stats...");
  const statsResult = await client.mutation(api.importData.importPlayerStats, { season: 2022 });
  console.log(statsResult);

  console.log("Data import complete!");
}

importData().catch(console.error);