import type { PedData } from "./types.ts";

/** Esta publicação é de teste: só a sala fictícia pode ser gravada. */
export const TEST_PUBLICATION = true;

export const TEST_WARNING =
  "Versão de teste. Somente dados fictícios. Não registre nome, nota, frequência nem observação de aluno real.";

export function hasLocalOrigin(data: PedData) {
  return [
    ...data.classes,
    ...data.students,
    ...data.observations,
    ...data.grades,
    ...data.attendance,
    ...data.exams,
    ...data.pendings,
  ].some((row) => row.origin === "local");
}
