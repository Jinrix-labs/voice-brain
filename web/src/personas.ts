export type PersonaId = "anime" | "emo" | "gremlin" | "archivist";

export interface Persona {
  id: PersonaId;
  name: string;
  description: string;
}

export const PERSONAS: Persona[] = [
  {
    id: "anime",
    name: "Soft Anime",
    description: "Gentle, encouraging, a little cutesy.",
  },
  {
    id: "emo",
    name: "Emo Nag",
    description: "Blunt, sarcastic, but secretly cares.",
  },
  {
    id: "gremlin",
    name: "Chaos Gremlin",
    description: "Unhinged and playful, loves calling you out.",
  },
  {
    id: "archivist",
    name: "Calm Archivist",
    description: "Chill, thoughtful, second-brain energy.",
  },
];

