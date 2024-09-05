const API_BASE_URL = 'https://www.balldontlie.io/api/v1';

export async function getPlayers(page = 1, perPage = 100) {
  const response = await fetch(`${API_BASE_URL}/players?page=${page}&per_page=${perPage}`);
  if (!response.ok) {
    throw new Error('Failed to fetch players');
  }
  return response.json();
}

export async function getPlayerStats(playerId: number, season = 2022) {
  const response = await fetch(`${API_BASE_URL}/season_averages?season=${season}&player_ids[]=${playerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player stats');
  }
  return response.json();
}