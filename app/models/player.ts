export type Faction =
  | "melrehns"
  | "thelios"
  | "zetran"
  | "ducaux"
  | "leanths"
  | "amaranths"
  | "rca";

export const factions: Faction[] = [
  "melrehns",
  "thelios",
  "zetran",
  "ducaux",
  "leanths",
  "amaranths",
  "rca",
];

export type Player = {
  name: string;
  faction: Faction;
  alliance: string;
  rdValues: number[];
};

export const getPlayerDisplayName = (player: Player) => {
  return `${player.name} [${player.alliance}]`;
};

export const colorsByFaction: Record<Faction, string> = {
  melrehns: "melrehns",
  thelios: "thelios",
  zetran: "zetran",
  ducaux: "ducaux",
  leanths: "leanths",
  amaranths: "amaranths",
  rca: "rca",
};

// export const colorsByFaction: Record<Faction, string> = {
//   melrehns: "#500289",
//   thelios: "#0047a4",
//   zetran: "#ee0000",
//   ducaux: "#e3ae00",
//   leanths: "#008829",
//   amaranths: "#058ede",
//   rca: "#00ecdc",
// };
