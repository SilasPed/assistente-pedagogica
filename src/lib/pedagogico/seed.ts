import { addDays } from "date-fns";
import { isoDate, recentWeekdays } from "@/lib/pedagogico/dates";
import type {
  Attendance,
  AttendanceStatus,
  Category,
  PedData,
  Student,
} from "@/lib/pedagogico/types";

const STATUS: Record<string, AttendanceStatus> = {
  P: "presente",
  F: "falta",
  A: "atraso",
  J: "justificada",
};

const ROLLS: Record<string, string> = {
  alice: "PPPPPPPP",
  bruno: "PPAPPPPP",
  camila: "PFPFPFPF",
  diego: "PPPPPPPP",
  elena: "PPPPPPJP",
  felipe: "PPPFPPPP",
  helena: "PPPPPPPP",
  igor: "PPPPAPPP",
  julia: "PPJPPPPP",
  kaique: "APAPPAPP",
  lara: "PPPPPPPP",
  miguel: "PPFPPFPP",
};

const NOTES: Array<[string, string, number, Category, string]> = [
  [
    "alice",
    "7a",
    -16,
    "evolucao",
    "Passou a explicar o raciocínio em voz alta. Os erros de sinal diminuíram.",
  ],
  [
    "alice",
    "7a",
    -8,
    "participacao",
    "Levantou a mão várias vezes e ajudou o colega da frente sem ser solicitada.",
  ],
  [
    "alice",
    "7a",
    -2,
    "evolucao",
    "Resolveu o problema de equações sem ajuda e explicou o caminho para a dupla.",
  ],
  [
    "bruno",
    "7a",
    -9,
    "comportamento",
    "O grupo dispersou no início. Depois do combinado, trabalhou até o fim da aula.",
  ],
  [
    "camila",
    "7a",
    -18,
    "comportamento",
    "Chegou no segundo tempo. Disse que ajuda a cuidar do irmão de manhã.",
  ],
  [
    "camila",
    "7a",
    -7,
    "dificuldades",
    "Não acompanhou a correção. Ficou em silêncio quando foi chamada.",
  ],
  [
    "camila",
    "7a",
    -1,
    "geral",
    "Faltou de novo. Vale um contato com a família antes da prova.",
  ],
  [
    "diego",
    "7a",
    -15,
    "dificuldades",
    "Travou na passagem da linguagem para a equação. Copiou o quadro, mas não resolveu sozinho.",
  ],
  [
    "diego",
    "7a",
    -6,
    "dificuldades",
    "Confundiu incógnita e coeficiente no exercício 4.",
  ],
  [
    "diego",
    "7a",
    -4,
    "participacao",
    "Pediu para refazer o exercício no intervalo. Tentou, ainda com apoio.",
  ],
  [
    "elena",
    "7a",
    -12,
    "participacao",
    "Apresentou a resolução no quadro com segurança.",
  ],
  [
    "elena",
    "7a",
    -5,
    "evolucao",
    "Organizou o caderno e passou a entregar as tarefas no prazo.",
  ],
  [
    "felipe",
    "7a",
    -14,
    "comportamento",
    "Interrompeu a explicação duas vezes. No fim da aula reconheceu e combinamos um sinal.",
  ],
  [
    "felipe",
    "7a",
    -1,
    "participacao",
    "Participou da correção com respostas curtas e corretas.",
  ],
  [
    "helena",
    "8b",
    -11,
    "evolucao",
    "O relatório de observação do pátio ficou claro, com hipótese e evidência separadas.",
  ],
  [
    "igor",
    "8b",
    -7,
    "participacao",
    "Quase não fala em aula. No papel, respondeu com precisão.",
  ],
  [
    "julia",
    "8b",
    -16,
    "dificuldades",
    "O texto do relatório misturou opinião e dado. Precisa de um modelo na próxima versão.",
  ],
  [
    "julia",
    "8b",
    -4,
    "evolucao",
    "Reescreveu o relatório separando o que observou do que concluiu.",
  ],
  [
    "kaique",
    "8b",
    -6,
    "comportamento",
    "Terceiro atraso da semana. Entrou sem o caderno de ciências.",
  ],
  [
    "lara",
    "8b",
    -8,
    "geral",
    "Entrega constante. Ajudou a organizar o material do grupo sem ser chamada.",
  ],
  [
    "miguel",
    "8b",
    -13,
    "dificuldades",
    "Não concluiu a atividade de cadeias alimentares.",
  ],
  [
    "miguel",
    "8b",
    -3,
    "dificuldades",
    "Disse que não estudou. A nota da última atividade caiu.",
  ],
];

const STUDENTS: Student[] = [
  { id: "alice", classId: "7a", name: "Alice Moreira" },
  { id: "bruno", classId: "7a", name: "Bruno Carvalho" },
  { id: "camila", classId: "7a", name: "Camila Dias" },
  { id: "diego", classId: "7a", name: "Diego Nunes" },
  { id: "elena", classId: "7a", name: "Elena Rocha" },
  { id: "felipe", classId: "7a", name: "Felipe Andrade" },
  { id: "helena", classId: "8b", name: "Helena Martins" },
  { id: "igor", classId: "8b", name: "Igor Pacheco" },
  { id: "julia", classId: "8b", name: "Júlia Ferreira" },
  { id: "kaique", classId: "8b", name: "Kaique Lima" },
  { id: "lara", classId: "8b", name: "Lara Souza" },
  { id: "miguel", classId: "8b", name: "Miguel Torres" },
];

export function createSeed(now: Date): PedData {
  const day = (offset: number) => isoDate(addDays(now, offset));
  const weekdays = recentWeekdays(now, 8);

  const attendance: Attendance[] = [];
  for (const student of STUDENTS) {
    const roll = ROLLS[student.id] ?? "PPPPPPPP";
    weekdays.forEach((date, index) => {
      const code = roll[index] ?? "P";
      attendance.push({
        id: `att-${student.id}-${isoDate(date)}`,
        studentId: student.id,
        classId: student.classId,
        date: isoDate(date),
        status: STATUS[code] ?? "presente",
      });
    });
  }

  const gradeRows: Array<[string, string, number, string, number]> = [
    ["alice", "7a", -28, "Prova de frações", 7.6],
    ["alice", "7a", -4, "Lista de equações", 8.4],
    ["bruno", "7a", -28, "Prova de frações", 7],
    ["bruno", "7a", -4, "Lista de equações", 7.2],
    ["camila", "7a", -28, "Prova de frações", 6.5],
    ["camila", "7a", -4, "Lista de equações", 6],
    ["diego", "7a", -28, "Prova de frações", 5.5],
    ["diego", "7a", -4, "Lista de equações", 4.8],
    ["elena", "7a", -28, "Prova de frações", 7.2],
    ["elena", "7a", -4, "Lista de equações", 8],
    ["felipe", "7a", -28, "Prova de frações", 6.8],
    ["felipe", "7a", -4, "Lista de equações", 7],
    ["helena", "8b", -28, "Prova de células", 9],
    ["helena", "8b", -4, "Relatório do pátio", 9.2],
    ["igor", "8b", -28, "Prova de células", 6.5],
    ["igor", "8b", -4, "Relatório do pátio", 6.4],
    ["julia", "8b", -28, "Prova de células", 6],
    ["julia", "8b", -4, "Relatório do pátio", 7.5],
    ["kaique", "8b", -28, "Prova de células", 7],
    ["kaique", "8b", -4, "Relatório do pátio", 6.6],
    ["lara", "8b", -28, "Prova de células", 8],
    ["lara", "8b", -4, "Relatório do pátio", 8.1],
    ["miguel", "8b", -28, "Prova de células", 7.2],
    ["miguel", "8b", -4, "Relatório do pátio", 5.5],
  ];

  return {
    classes: [
      { id: "7a", name: "7º A", subject: "Matemática" },
      { id: "8b", name: "8º B", subject: "Ciências" },
    ],
    students: STUDENTS,
    observations: NOTES.map(([studentId, classId, offset, category, text], index) => ({
      id: `obs-${index + 1}`,
      studentId,
      classId,
      date: day(offset),
      category,
      text,
      source: "texto" as const,
      createdAt: `${day(offset)}T12:00:00.000Z`,
    })),
    grades: gradeRows.map(([studentId, classId, offset, title, score], index) => ({
      id: `grade-${index + 1}`,
      studentId,
      classId,
      date: day(offset),
      title,
      score,
    })),
    attendance,
    exams: [
      {
        id: "exam-1",
        classId: "8b",
        title: "Entrega do relatório reescrito",
        date: day(3),
        kind: "trabalho",
      },
      {
        id: "exam-2",
        classId: "7a",
        title: "Prova de equações",
        date: day(5),
        kind: "prova",
      },
      {
        id: "exam-3",
        classId: "8b",
        title: "Avaliação de ecossistemas",
        date: day(11),
        kind: "prova",
      },
      {
        id: "exam-4",
        classId: "7a",
        title: "Recuperação paralela",
        date: day(14),
        kind: "recuperacao",
      },
    ],
    pendings: [
      {
        id: "pend-1",
        classId: "8b",
        studentId: null,
        title: "Lançar as notas do relatório de ciências",
        due: day(-2),
        done: false,
      },
      {
        id: "pend-2",
        classId: "7a",
        studentId: "camila",
        title: "Falar com a família da Camila Dias",
        due: day(0),
        done: false,
      },
      {
        id: "pend-3",
        classId: "7a",
        studentId: null,
        title: "Devolver a correção da prova de frações",
        due: day(1),
        done: false,
      },
      {
        id: "pend-4",
        classId: "7a",
        studentId: "diego",
        title: "Separar a lista de recuperação do Diego",
        due: day(6),
        done: false,
      },
      {
        id: "pend-5",
        classId: "8b",
        studentId: "julia",
        title: "Devolver o modelo de relatório para a Júlia",
        due: day(-8),
        done: true,
      },
    ],
  };
}
