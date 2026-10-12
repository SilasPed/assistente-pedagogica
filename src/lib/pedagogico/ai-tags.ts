export const AI_TAGS = [
  "participacao",
  "aprendizagem",
  "autonomia",
  "frequencia",
  "interacao",
  "atividades",
  "acompanhamento",
] as const;

export const AI_TAG_LABELS: Record<(typeof AI_TAGS)[number], string> = {
  participacao: "Participação",
  aprendizagem: "Aprendizagem",
  autonomia: "Autonomia",
  frequencia: "Frequência",
  interacao: "Interação",
  atividades: "Cumprimento de atividades",
  acompanhamento: "Pontos para acompanhar",
};
