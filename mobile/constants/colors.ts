import { ProjectColor } from "@/types/project.types";

export const projectColors: ProjectColor[] = [
  { name: "Calm Blue", hex: "#5B8DEF" },
  { name: "Soft Indigo", hex: "#7C83FD" },
  { name: "Lavender", hex: "#A78BFA" },
  { name: "Orchid", hex: "#C084FC" },
  { name: "Soft Pink", hex: "#F472B6" },
  { name: "Rose", hex: "#FB7185" },
  { name: "Coral", hex: "#F87171" },
  { name: "Peach", hex: "#FB923C" },
  { name: "Amber", hex: "#F59E0B" },
  { name: "Honey", hex: "#EAB308" },
  { name: "Lime", hex: "#84CC16" },
  { name: "Fresh Green", hex: "#22C55E" },
  { name: "Mint", hex: "#34D399" },
  { name: "Seafoam", hex: "#2DD4BF" },
  { name: "Aqua", hex: "#22D3EE" },
  { name: "Sky", hex: "#38BDF8" },
  { name: "Ocean", hex: "#0EA5E9" },
  { name: "Steel Blue", hex: "#64748B" },
  { name: "Slate Violet", hex: "#6D6AF2" },
  { name: "Periwinkle", hex: "#818CF8" },
  { name: "Soft Grape", hex: "#A855F7" },
  { name: "Magenta", hex: "#D946EF" },
  { name: "Watermelon", hex: "#F43F5E" },
  { name: "Apricot", hex: "#F97316" },
  { name: "Gold", hex: "#D97706" },
  { name: "Meadow", hex: "#16A34A" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Teal", hex: "#14B8A6" },
  { name: "Cyan", hex: "#06B6D4" },
  { name: "Royal Blue", hex: "#3B82F6" },
];

export const defaultProjectColor =
  projectColors.find((color) => color.name === "Steel Blue")?.hex ??
  projectColors[0]?.hex;
