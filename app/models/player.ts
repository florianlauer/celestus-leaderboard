export type Player = {
  name: string;
  faction: string;
  alliance: string;
  rdValues: number[];
};

export const getPlayerDisplayName = (player: Player) => {
  return `${player.name} [${player.alliance}]`;
};

const colorsByFaction: Record<string, string> = {
  Alliance: "blue",
  Horde: "red",
  Neutral: "gray",
};
