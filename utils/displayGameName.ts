export function displayGameName(game: { name: string; name_cn?: string | null }) {
  return game.name_cn || game.name
}
