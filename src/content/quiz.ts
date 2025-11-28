import { Language } from './strings'

export type StonePlacement = { x: number; y: number; color: 'B' | 'W' }

export interface QuizMove {
  x: number
  y: number
}

interface LocalizedText {
  en: string
  de: string
}

export interface QuizScenario {
  id: string
  title: LocalizedText
  prompt: LocalizedText
  boardSetup: StonePlacement[]
  toPlay: 'B' | 'W'
  correctMoves: QuizMove[]
  explanation: LocalizedText
  hint?: LocalizedText
  // For counting scenarios: input-based questions
  isInputQuestion?: boolean
  correctBlackScore?: number
  correctWhiteScore?: number
  // For liberty counting: input-based questions
  correctLibertyCount?: number
  // For advanced counting: with komi and prisoners
  isAdvancedCounting?: boolean
  correctBlackPrisoners?: number
  correctWhitePrisoners?: number
  komi?: number
  prisonersGiven?: boolean // If true, prisoners are displayed as given values, not input fields
  // For ladder sequences: bot automatically responds after each user move
  isLadder?: boolean
  botResponses?: Array<{ // Sequence of moves: [user move, bot response, user move, bot response, ...]
    userMove: QuizMove
    botMove: QuizMove
  }>
  // For intelligent bot responses: bot chooses move based on user move
  botResponseFunction?: (userMove: QuizMove, gameState: any) => QuizMove | null
}

export interface QuizLesson {
  id: string
  title: LocalizedText
  lessonPath: string
  scenarios: QuizScenario[]
}

export interface QuizLessonLocalized {
  id: string
  title: string
  lessonPath: string
  scenarios: Array<{
    id: string
    title: string
    prompt: string
    boardSetup: StonePlacement[]
    toPlay: 'B' | 'W'
    correctMoves: QuizMove[]
    explanation: string
    hint?: string
    isInputQuestion?: boolean
    correctBlackScore?: number
    correctWhiteScore?: number
    correctLibertyCount?: number
    isAdvancedCounting?: boolean
    correctBlackPrisoners?: number
    correctWhitePrisoners?: number
    komi?: number
    prisonersGiven?: boolean
    isLadder?: boolean
    botResponses?: Array<{
      userMove: QuizMove
      botMove: QuizMove
    }>
  }>
}

const coordMap = (coord: string): { x: number; y: number } => {
  const col = coord.charCodeAt(0) - 'A'.charCodeAt(0)
  const row = parseInt(coord.slice(1), 10) - 1
  return { x: col, y: row }
}

const stones = (color: 'B' | 'W', coords: string[]): StonePlacement[] =>
  coords.map((coord) => ({ ...coordMap(coord), color }))

const move = (coord: string): QuizMove => coordMap(coord)

const QUIZ_LESSONS: QuizLesson[] = [
  {
    id: 'intro',
    title: {
      en: 'Lesson 0 · Introduction',
      de: 'Lektion 0 · Einführung'
    },
    lessonPath: '/intro',
    scenarios: [
      {
        id: 'intro-open-center',
        title: {
          en: 'Feel the Hoshi',
          de: 'Das Hoshi erspüren'
        },
        prompt: {
          en: 'Place the very first black stone on the central star point (E5) to feel that moves happen on intersections, not inside squares.',
          de: 'Setze den allerersten schwarzen Stein auf den zentralen Sternpunkt (E5), um zu spüren, dass Züge auf Schnittpunkten und nicht in Feldern stattfinden.'
        },
        boardSetup: [],
        toPlay: 'B',
        correctMoves: [move('E5')],
        explanation: {
          en: 'Opening on the central hoshi immediately shows that Go is played on intersections and gives influence everywhere.',
          de: 'Der Zug auf dem zentralen Hoshi macht sofort deutlich, dass Go auf Schnittpunkten gespielt wird und Einfluss in alle Richtungen entsteht.'
        },
        hint: {
          en: 'Look for the bold dot in the middle of the board.',
          de: 'Suche den markanten Punkt in der Brettmitte.'
        }
      },
      {
        id: 'intro-balance-response',
        title: {
          en: 'Answer Symmetrically',
          de: 'Symmetrisch antworten'
        },
        prompt: {
          en: 'White responds to Black’s centre stone. Play on C5 to mirror the spacing and keep the board balanced.',
          de: 'Weiß beantwortet den schwarzen Stein in der Mitte. Spiele auf C5, um den Abstand zu spiegeln und das Brett im Gleichgewicht zu halten.'
        },
        boardSetup: [...stones('B', ['E5'])],
        toPlay: 'W',
        correctMoves: [move('C5')],
        explanation: {
          en: 'A mirrored reply keeps both players developing with equal influence on the upper side.',
          de: 'Die gespiegelte Antwort sorgt dafür, dass beide Spieler mit gleichem Einfluss auf der Oberseite weiterentwickeln.'
        },
        hint: {
          en: 'Stay on the same horizontal line as the centre stone.',
          de: 'Bleibe auf derselben horizontalen Linie wie der Zentralstein.'
        }
      },
      {
        id: 'intro-shape-extension',
        title: {
          en: 'Build a Framework',
          de: 'Ein Framework aufbauen'
        },
        prompt: {
          en: 'Extend Black’s position from the centre toward the right by playing G5. This keeps equal distance to both existing stones.',
          de: 'Erweitere die schwarze Stellung aus der Mitte nach rechts, indem du G5 spielst. Der Abstand zu beiden vorhandenen Steinen bleibt so gleich.'
        },
        boardSetup: [...stones('B', ['E5']), ...stones('W', ['C5'])],
        toPlay: 'B',
        correctMoves: [move('G5')],
        explanation: {
          en: 'The two-space extension from the central stone shows how to grow a framework without over-concentrating.',
          de: 'Die Zweispalt-Erweiterung vom Zentralstein zeigt, wie man ein Framework baut, ohne Steine zu ballen.'
        }
      }
    ]
  },
  {
    id: 'fundamentals',
    title: {
      en: 'Lesson 1 · Fundamentals',
      de: 'Lektion 1 · Grundlagen'
    },
    lessonPath: '/rules',
    scenarios: [
      {
        id: 'fundamentals-liberties-corner',
        title: {
          en: 'Count Liberties - Corner Stone',
          de: 'Freiheiten zählen - Eckstein'
        },
        prompt: {
          en: 'The Black stone at A9 is in the corner. How many liberties does it have? Enter the number of liberties.',
          de: 'Der schwarze Stein auf A9 ist in der Ecke. Wie viele Freiheiten hat er? Gib die Anzahl der Freiheiten ein.'
        },
        boardSetup: [...stones('B', ['A9'])],
        toPlay: 'B',
        correctMoves: [],
        isInputQuestion: true,
        correctLibertyCount: 2,
        explanation: {
          en: 'Corner stones have exactly 2 liberties. The stone at A9 has liberties at A8 (below) and B9 (to the right).',
          de: 'Ecksteine haben genau 2 Freiheiten. Der Stein auf A9 hat Freiheiten bei A8 (unten) und B9 (rechts).'
        },
        hint: {
          en: 'Corner stones touch only 2 adjacent intersections.',
          de: 'Ecksteine berühren nur 2 benachbarte Schnittpunkte.'
        }
      },
      {
        id: 'fundamentals-liberties-edge',
        title: {
          en: 'Count Liberties - Edge Stone',
          de: 'Freiheiten zählen - Randstein'
        },
        prompt: {
          en: 'The Black stone at A5 is on the edge. How many liberties does it have? Enter the number of liberties.',
          de: 'Der schwarze Stein auf A5 ist am Rand. Wie viele Freiheiten hat er? Gib die Anzahl der Freiheiten ein.'
        },
        boardSetup: [...stones('B', ['A5'])],
        toPlay: 'B',
        correctMoves: [],
        isInputQuestion: true,
        correctLibertyCount: 3,
        explanation: {
          en: 'Edge stones have exactly 3 liberties. The stone at A5 has liberties at A6 (above), A4 (below), and B5 (to the right).',
          de: 'Randsteine haben genau 3 Freiheiten. Der Stein auf A5 hat Freiheiten bei A6 (oben), A4 (unten) und B5 (rechts).'
        },
        hint: {
          en: 'Edge stones touch 3 adjacent intersections.',
          de: 'Randsteine berühren 3 benachbarte Schnittpunkte.'
        }
      },
      {
        id: 'fundamentals-liberties-center',
        title: {
          en: 'Count Liberties - Center Stone',
          de: 'Freiheiten zählen - Zentralstein'
        },
        prompt: {
          en: 'The Black stone at D5 is in the center. How many liberties does it have? Enter the number of liberties.',
          de: 'Der schwarze Stein auf D5 ist im Zentrum. Wie viele Freiheiten hat er? Gib die Anzahl der Freiheiten ein.'
        },
        boardSetup: [...stones('B', ['D5'])],
        toPlay: 'B',
        correctMoves: [],
        isInputQuestion: true,
        correctLibertyCount: 4,
        explanation: {
          en: 'Center stones have exactly 4 liberties (maximum possible). The stone at D5 has liberties at D6 (above), D4 (below), C5 (left), and E5 (right).',
          de: 'Zentralsteine haben genau 4 Freiheiten (Maximum). Der Stein auf D5 hat Freiheiten bei D6 (oben), D4 (unten), C5 (links) und E5 (rechts).'
        },
        hint: {
          en: 'Center stones touch 4 adjacent intersections.',
          de: 'Zentralsteine berühren 4 benachbarte Schnittpunkte.'
        }
      },
      {
        id: 'fundamentals-capture-simple',
        title: {
          en: 'Simple Capture',
          de: 'Einfacher Schlag'
        },
        prompt: {
          en: 'White at A9 has only 1 liberty left. Black to play: Capture White by playing on its last liberty.',
          de: 'Weiß auf A9 hat nur noch 1 Freiheit. Schwarz ist am Zug: Schlage Weiß, indem du auf seine letzte Freiheit spielst.'
        },
        boardSetup: [...stones('W', ['A9']), ...stones('B', ['A8'])],
        toPlay: 'B',
        correctMoves: [move('B9')],
        explanation: {
          en: 'Black plays at B9, removing White\'s last liberty. White at A9 now has 0 liberties and is captured.',
          de: 'Schwarz spielt auf B9 und entfernt die letzte Freiheit von Weiß. Weiß auf A9 hat jetzt 0 Freiheiten und wird geschlagen.'
        },
        hint: {
          en: 'Find White\'s only remaining liberty.',
          de: 'Finde die einzige verbleibende Freiheit von Weiß.'
        }
      },
      {
        id: 'fundamentals-capture-surrounded',
        title: {
          en: 'Capture Surrounded Stone',
          de: 'Umschlossenen Stein schlagen'
        },
        prompt: {
          en: 'White at B5 has only 1 liberty left. Black to play: Capture White by filling the last liberty.',
          de: 'Weiß auf B5 hat nur noch 1 Freiheit. Schwarz ist am Zug: Schlage Weiß, indem du die letzte Freiheit füllst.'
        },
        boardSetup: [
          ...stones('W', ['B5']),
          ...stones('B', ['A6', 'B6', 'C6', 'A5', 'A4', 'B4', 'C4'])
        ],
        toPlay: 'B',
        correctMoves: [move('C5')],
        explanation: {
          en: 'Black plays at C5, removing White\'s last liberty. White at B5 now has 0 liberties and is captured.',
          de: 'Schwarz spielt auf C5 und entfernt die letzte Freiheit von Weiß. Weiß auf B5 hat jetzt 0 Freiheiten und wird geschlagen.'
        },
        hint: {
          en: 'White\'s only liberty is at C5.',
          de: 'Die einzige Freiheit von Weiß ist bei C5.'
        }
      },
      {
        id: 'fundamentals-atari-identify',
        title: {
          en: 'Identify Stone in Atari',
          de: 'Stein in Atari identifizieren'
        },
        prompt: {
          en: 'White at B5 is in ATARI (has only 1 liberty). Click on the empty intersection that is White\'s last liberty.',
          de: 'Weiß auf B5 ist in Atari (hat nur noch 1 Freiheit). Klicke auf den leeren Schnittpunkt, der die letzte Freiheit von Weiß ist.'
        },
        boardSetup: [
          ...stones('W', ['B5']),
          ...stones('B', ['A6', 'B6', 'C6', 'A5', 'A4', 'B4'])
        ],
        toPlay: 'B',
        correctMoves: [move('C5')],
        explanation: {
          en: 'White at B5 is in ATARI with only 1 liberty at C5. Black can capture next move by playing at C5.',
          de: 'Weiß auf B5 ist in Atari mit nur noch 1 Freiheit bei C5. Schwarz kann im nächsten Zug schlagen, indem er auf C5 spielt.'
        },
        hint: {
          en: 'Look for the empty intersection adjacent to White at B5.',
          de: 'Suche nach dem leeren Schnittpunkt neben Weiß auf B5.'
        }
      },
      {
        id: 'fundamentals-atari-put',
        title: {
          en: 'Put Opponent in Atari',
          de: 'Gegner in Atari setzen'
        },
        prompt: {
          en: 'White at B5 has 2 liberties. Black to play: Put White in ATARI by playing on one of its liberties.',
          de: 'Weiß auf B5 hat 2 Freiheiten. Schwarz ist am Zug: Setze Weiß in Atari, indem du auf eine seiner Freiheiten spielst.'
        },
        boardSetup: [
          ...stones('W', ['B5']),
          ...stones('B', ['A6', 'B6', 'C6', 'A4', 'B4', 'C4'])
        ],
        toPlay: 'B',
        correctMoves: [move('A5'), move('C5')],
        explanation: {
          en: 'Black plays at A5 (or C5), reducing White\'s liberties from 2 to 1. White is now in ATARI and must respond immediately.',
          de: 'Schwarz spielt auf A5 (oder C5) und reduziert die Freiheiten von Weiß von 2 auf 1. Weiß ist jetzt in Atari und muss sofort reagieren.'
        },
        hint: {
          en: 'Play on either A5 or C5 to reduce White\'s liberties to 1.',
          de: 'Spiele auf A5 oder C5, um die Freiheiten von Weiß auf 1 zu reduzieren.'
        }
      },
      {
        id: 'fundamentals-groups-identify',
        title: {
          en: 'Identify Connected Groups',
          de: 'Verbundene Gruppen identifizieren'
        },
        prompt: {
          en: 'There are Black stones in columns A and C. Click on an empty intersection in column B to show that these are two separate groups.',
          de: 'Es gibt schwarze Steine in den Spalten A und C. Klicke auf einen leeren Schnittpunkt in Spalte B, um zu zeigen, dass dies zwei separate Gruppen sind.'
        },
        boardSetup: [...stones('B', ['A6', 'A5', 'A4', 'C6', 'C5', 'C4'])],
        toPlay: 'B',
        correctMoves: [move('B6'), move('B5'), move('B4')],
        explanation: {
          en: 'There are 2 separate groups: Group 1 (A6, A5, A4) on the left, and Group 2 (C6, C5, C4) on the right. They are separated by the empty B column.',
          de: 'Es gibt 2 separate Gruppen: Gruppe 1 (A6, A5, A4) links und Gruppe 2 (C6, C5, C4) rechts. Sie sind durch die leere B-Spalte getrennt.'
        },
        hint: {
          en: 'Stones only connect horizontally or vertically, not diagonally. The empty B column separates the groups.',
          de: 'Steine verbinden sich nur horizontal oder vertikal, nicht diagonal. Die leere B-Spalte trennt die Gruppen.'
        }
      },
      {
        id: 'fundamentals-groups-liberties',
        title: {
          en: 'Count Group Liberties',
          de: 'Gruppenfreiheiten zählen'
        },
        prompt: {
          en: 'The Black group at B6-C6-D6 is connected horizontally. How many liberties does this group have? Enter the number of liberties.',
          de: 'Die schwarze Gruppe bei B6-C6-D6 ist horizontal verbunden. Wie viele Freiheiten hat diese Gruppe? Gib die Anzahl der Freiheiten ein.'
        },
        boardSetup: [...stones('B', ['B6', 'C6', 'D6'])],
        toPlay: 'B',
        correctMoves: [],
        isInputQuestion: true,
        correctLibertyCount: 8,
        explanation: {
          en: 'The group has 8 liberties: A6 (left), B7-C7-D7 (above), E6 (right), and B5-C5-D5 (below).',
          de: 'Die Gruppe hat 8 Freiheiten: A6 (links), B7-C7-D7 (oben), E6 (rechts) und B5-C5-D5 (unten).'
        },
        hint: {
          en: 'Count all empty intersections adjacent to any stone in the group.',
          de: 'Zähle alle leeren Schnittpunkte, die an einen Stein der Gruppe angrenzen.'
        }
      },
      {
        id: 'fundamentals-suicide',
        title: {
          en: 'Identify Suicide Move',
          de: 'Selbstmordzug identifizieren'
        },
        prompt: {
          en: 'Black cannot play at B5 (it would be suicide). Instead, click on any legal move elsewhere on the board to show you understand that B5 is illegal.',
          de: 'Schwarz kann nicht auf B5 spielen (es wäre Selbstmord). Klicke stattdessen auf einen legalen Zug woanders auf dem Brett, um zu zeigen, dass du verstehst, dass B5 illegal ist.'
        },
        boardSetup: [
          ...stones('W', ['A6', 'B6', 'C6', 'A5', 'C5', 'A4', 'B4', 'C4'])
        ],
        toPlay: 'B',
        correctMoves: [
          move('A1'), move('A2'), move('A3'), move('A7'), move('A8'), move('A9'),
          move('B1'), move('B2'), move('B3'), move('B7'), move('B8'), move('B9'),
          move('C1'), move('C2'), move('C3'), move('C7'), move('C8'), move('C9'),
          move('D1'), move('D2'), move('D3'), move('D4'), move('D5'), move('D6'), move('D7'), move('D8'), move('D9'),
          move('E1'), move('E2'), move('E3'), move('E4'), move('E5'), move('E6'), move('E7'), move('E8'), move('E9'),
          move('F1'), move('F2'), move('F3'), move('F4'), move('F5'), move('F6'), move('F7'), move('F8'), move('F9'),
          move('G1'), move('G2'), move('G3'), move('G4'), move('G5'), move('G6'), move('G7'), move('G8'), move('G9'),
          move('H1'), move('H2'), move('H3'), move('H4'), move('H5'), move('H6'), move('H7'), move('H8'), move('H9'),
          move('I1'), move('I2'), move('I3'), move('I4'), move('I5'), move('I6'), move('I7'), move('I8'), move('I9')
        ],
        explanation: {
          en: 'Correct! Black cannot legally play at B5 because it would be a suicide move - the stone would have 0 liberties and doesn\'t capture any White stones. Any other empty intersection is a legal move.',
          de: 'Richtig! Schwarz kann nicht legal auf B5 spielen, da es ein Selbstmordzug wäre - der Stein hätte 0 Freiheiten und schlägt keine weißen Steine. Jeder andere leere Schnittpunkt ist ein legaler Zug.'
        },
        hint: {
          en: 'Suicide rule: Cannot place stone with 0 liberties UNLESS it captures opponent. B5 has 0 liberties and captures nothing.',
          de: 'Selbstmordregel: Man kann keinen Stein mit 0 Freiheiten setzen, AUSSER man schlägt dabei den Gegner. B5 hat 0 Freiheiten und schlägt nichts.'
        }
      }
    ]
  },
  {
    id: 'counting',
    title: {
      en: 'Lesson 1 · Counting Territory',
      de: 'Lektion 1 · Gebiet zählen'
    },
    lessonPath: '/counting',
    scenarios: [
      {
        id: 'counting-main-game',
        title: {
          en: 'Count the Finished Game',
          de: 'Das fertige Spiel zählen'
        },
        prompt: {
          en: 'This is a finished game. Count the empty intersections surrounded by each color. Enter Black\'s territory points and White\'s territory points.',
          de: 'Dies ist ein fertiges Spiel. Zähle die leeren Schnittpunkte, die von jeder Farbe umschlossen sind. Gib die Gebietspunkte von Schwarz und Weiß ein.'
        },
        boardSetup: [
          // Row A (column 0): A3, A4, A5(W), A6
          ...stones('B', ['A3', 'A4', 'A6']),
          ...stones('W', ['A5']),
          // Row B (column 1): B2, B4, B5(W), B6, B8
          ...stones('B', ['B2', 'B4', 'B6', 'B8']),
          ...stones('W', ['B5']),
          // Row C (column 2): C2, C4, C5(W), C6
          ...stones('B', ['C2', 'C4', 'C6']),
          ...stones('W', ['C5']),
          // Row D (column 3): D1, D2, D3, D4(W), D5(W), D6
          ...stones('B', ['D1', 'D2', 'D3', 'D6']),
          ...stones('W', ['D4', 'D5']),
          // Row E (column 4): E1, E2(W), E3(W), E4(W), E5, E6, E7
          ...stones('B', ['E1', 'E5', 'E6', 'E7']),
          ...stones('W', ['E2', 'E3', 'E4']),
          // Row F (column 5): F1(W), F2(W), F3(W), F4, F5, F6(W), F7, F8, F9
          ...stones('B', ['F4', 'F5', 'F7', 'F8', 'F9']),
          ...stones('W', ['F1', 'F2', 'F3', 'F6']),
          // Row G (column 6): G1(W), G4(W), G5(W), G6(W), G7(W), G8(W), G9
          ...stones('B', ['G9']),
          ...stones('W', ['G1', 'G4', 'G5', 'G6', 'G7', 'G8']),
          // Row H (column 7): H1(W), H3(W), H4(W), H6(W), H7(W), H9(W)
          ...stones('W', ['H1', 'H3', 'H4', 'H6', 'H7', 'H9']),
          // Row I (column 8): I2(W)
          ...stones('W', ['I2'])
        ],
        toPlay: 'B',
        correctMoves: [],
        isInputQuestion: true,
        correctBlackScore: 19,
        correctWhiteScore: 13,
        explanation: {
          en: 'Black controls 19 points of territory (empty intersections surrounded by black stones). White controls 13 points of territory. Black wins by 6 points.',
          de: 'Schwarz kontrolliert 19 Punkte Gebiet (leere Schnittpunkte, umgeben von schwarzen Steinen). Weiß kontrolliert 13 Punkte Gebiet. Schwarz gewinnt mit 6 Punkten Vorsprung.'
        }
      },
      {
        id: 'counting-advanced-game',
        title: {
          en: 'Count the Finished Game (Advanced)',
          de: 'Das fertige Spiel zählen (Erweitert)'
        },
        prompt: {
          en: 'This is a finished game. Count territory. Prisoners are given: Black has 3 prisoners, White has 2 prisoners. Remember komi (5.5). Enter Black\'s territory and White\'s territory.',
          de: 'Dies ist ein fertiges Spiel. Zähle das Gebiet. Gefangene sind vorgegeben: Schwarz hat 3 Gefangene, Weiß hat 2 Gefangene. Denke an Komi (5.5). Gib das Gebiet von Schwarz und das Gebiet von Weiß ein.'
        },
        boardSetup: [
          // Similar to main game but with some captured stones removed
          ...stones('B', ['A3', 'A4', 'A6', 'B2', 'B4', 'B6', 'B8', 'C2', 'C4', 'C6', 'D1', 'D2', 'D3', 'D6', 'E1', 'E5', 'E6', 'E7', 'F4', 'F5', 'F7', 'F8', 'F9', 'G9']),
          ...stones('W', ['A5', 'B5', 'C5', 'D4', 'D5', 'E2', 'E3', 'E4', 'F1', 'F2', 'F3', 'F6', 'G1', 'G4', 'G5', 'G6', 'G7', 'G8', 'H1', 'H3', 'H4', 'H6', 'H7', 'H9', 'I2'])
        ],
        toPlay: 'B',
        correctMoves: [],
        isInputQuestion: true,
        isAdvancedCounting: true,
        correctBlackScore: 19,
        correctWhiteScore: 13,
        correctBlackPrisoners: 3,
        correctWhitePrisoners: 2,
        komi: 5.5,
        prisonersGiven: true,
        explanation: {
          en: 'Black: 19 territory + 3 prisoners = 22 points. White: 13 territory + 2 prisoners + 5.5 komi = 20.5 points. Black wins by 1.5 points.',
          de: 'Schwarz: 19 Gebiet + 3 Gefangene = 22 Punkte. Weiß: 13 Gebiet + 2 Gefangene + 5.5 Komi = 20.5 Punkte. Schwarz gewinnt mit 1.5 Punkten Vorsprung.'
        }
      }
    ]
  },
  {
    id: 'rules',
    title: {
      en: 'Lesson 2 · Liberties & Groups',
      de: 'Lektion 2 · Freiheiten & Gruppen'
    },
    lessonPath: '/rules',
    scenarios: [
      {
        id: 'rules-connect-groups',
        title: {
          en: 'Connect to Share Liberties',
          de: 'Verbinden, um Freiheiten zu teilen'
        },
        prompt: {
          en: 'Black stones on E4 and E6 are split by white probes. Play E5 to connect them into one healthy chain.',
          de: 'Die schwarzen Steine auf E4 und E6 sind durch weiße Schnitte getrennt. Spiele E5, um sie zu einer gesunden Kette zu verbinden.'
        },
        boardSetup: [
          ...stones('B', ['E4', 'E6']),
          ...stones('W', ['D5', 'F5'])
        ],
        toPlay: 'B',
        correctMoves: [move('E5')],
        explanation: {
          en: 'Connection merges liberties from both stones, preventing White from cutting and attacking.',
          de: 'Die Verbindung vereint die Freiheiten beider Steine und verhindert, dass Weiß schneiden und angreifen kann.'
        }
      },
      {
        id: 'rules-save-side',
        title: {
          en: 'Protect the Side Liberty',
          de: 'Die Seitenfreiheit schützen'
        },
        prompt: {
          en: 'A lone black stone on C4 has only one liberty left. Play B4 to extend and stay alive.',
          de: 'Der einzelne schwarze Stein auf C4 hat nur noch eine Freiheit. Spiele B4, um zu erweitern und am Leben zu bleiben.'
        },
        boardSetup: [
          ...stones('B', ['C4']),
          ...stones('W', ['C3', 'D4', 'C5'])
        ],
        toPlay: 'B',
        correctMoves: [move('B4')],
        explanation: {
          en: 'Extending gives the chain two liberties again, escaping the atari threat.',
          de: 'Die Erweiterung verschafft der Kette wieder zwei Freiheiten und entkommt der Atari-Gefahr.'
        }
      },
      {
        id: 'rules-capture-single',
        title: {
          en: 'Count the Last Liberty',
          de: 'Die letzte Freiheit zählen'
        },
        prompt: {
          en: 'White can capture the black stone at E5 by playing on its final liberty. Find the point.',
          de: 'Weiß kann den schwarzen Stein auf E5 schlagen, indem die letzte Freiheit besetzt wird. Finde den Punkt.'
        },
        boardSetup: [
          ...stones('B', ['E5']),
          ...stones('W', ['D5', 'F5', 'E4'])
        ],
        toPlay: 'W',
        correctMoves: [move('E6')],
        explanation: {
          en: 'Filling E6 removes E5’s final liberty, so the stone disappears immediately.',
          de: 'Das Besetzen von E6 nimmt E5 die letzte Freiheit, sodass der Stein sofort vom Brett verschwindet.'
        }
      }
    ]
  },
  {
    id: 'capture',
    title: {
      en: 'Lesson 3 · Capturing',
      de: 'Lektion 3 · Schlagen'
    },
    lessonPath: '/capture',
    scenarios: [
      {
        id: 'capture-single-liberty',
        title: {
          en: 'Finish the Atari',
          de: 'Atari vollenden'
        },
        prompt: {
          en: 'The white stone on D3 is in atari. Play D4 to remove its last liberty and capture it.',
          de: 'Der weiße Stein auf D3 steht in Atari. Spiele D4, um seine letzte Freiheit zu entfernen und ihn zu schlagen.'
        },
        boardSetup: [
          ...stones('W', ['D3']),
          ...stones('B', ['C3', 'D2', 'E3'])
        ],
        toPlay: 'B',
        correctMoves: [move('D4')],
        explanation: {
          en: 'Capturing single stones trains you to spot liberties instantly.',
          de: 'Das Schlagen einzelner Steine schult den Blick für Freiheiten.'
        }
      },
      {
        id: 'capture-two-chain',
        title: {
          en: 'Cut Off the Pair',
          de: 'Das Paar abschneiden'
        },
        prompt: {
          en: 'White’s chain at F5–F6 has only one liberty remaining. Play F7 to remove it.',
          de: 'Die weiße Kette auf F5–F6 hat nur noch eine Freiheit. Spiele F7, um sie zu entfernen.'
        },
        boardSetup: [
          ...stones('W', ['F5', 'F6']),
          ...stones('B', ['E5', 'G5', 'E6', 'G6', 'F4'])
        ],
        toPlay: 'B',
        correctMoves: [move('F7')],
        explanation: {
          en: 'Filling the final liberty of a two-stone chain shows how captures escalate in difficulty.',
          de: 'Das Besetzen der letzten Freiheit einer Zweierkette zeigt, wie Schlagaufgaben schwieriger werden.'
        }
      },
      {
        id: 'capture-l-shape',
        title: {
          en: 'Crush the L-Shape',
          de: 'Die L-Form zerbrechen'
        },
        prompt: {
          en: 'An L-shaped white group relies on E3 to survive. Play there to capture the entire group.',
          de: 'Eine L-förmige weiße Gruppe braucht E3 zum Überleben. Spiele dort, um die ganze Gruppe zu schlagen.'
        },
        boardSetup: [
          ...stones('W', ['E4', 'E5', 'F5']),
          ...stones('B', ['D4', 'F4', 'D5', 'F6', 'E6', 'G5'])
        ],
        toPlay: 'B',
        correctMoves: [move('E3')],
        explanation: {
          en: 'Reading L-shapes teaches you how liberties disappear from unusual angles.',
          de: 'Das Lesen von L-Formen zeigt, wie Freiheiten aus ungewöhnlichen Winkeln verschwinden.'
        }
      }
    ]
  },
  {
    id: 'ko',
    title: {
      en: 'Lesson 4 · Ko Fights',
      de: 'Lektion 4 · Ko-Kämpfe'
    },
    lessonPath: '/ko',
    scenarios: [
      {
        id: 'ko-start',
        title: {
          en: 'Start the Ko',
          de: 'Ko eröffnen'
        },
        prompt: {
          en: 'The white stone at E5 has one liberty on F5. Capture it to begin a ko fight.',
          de: 'Der weiße Stein auf E5 besitzt nur die Freiheit F5. Schlage ihn, um einen Ko-Kampf zu starten.'
        },
        boardSetup: [
          ...stones('B', ['E4', 'D5', 'E6']),
          ...stones('W', ['E5', 'F4', 'G5', 'F6'])
        ],
        toPlay: 'B',
        correctMoves: [move('F5')],
        explanation: {
          en: 'Capturing on F5 removes E5 and creates a ko. According to the ko rule, White cannot immediately recapture at E5 - they must first play a move elsewhere (a ko threat). Only after Black responds to that threat can White recapture the ko. This prevents infinite loops.',
          de: 'Der Zug auf F5 entfernt E5 und erzeugt ein Ko. Nach der Ko-Regel kann Weiß nicht sofort auf E5 zurückschlagen - er muss zuerst einen Zug woanders spielen (eine Ko-Drohung). Erst nachdem Schwarz auf diese Drohung reagiert hat, darf Weiß das Ko zurückschlagen. Dies verhindert endlose Schleifen.'
        }
      }
    ]
  },
  {
    id: 'eyes',
    title: {
      en: 'Lesson 5 · Eyes & Life',
      de: 'Lektion 5 · Augen & Leben'
    },
    lessonPath: '/eyes',
    scenarios: [
      {
        id: 'eyes-avoid-self-capture',
        title: {
          en: 'Ladder',
          de: 'Leiter'
        },
        prompt: {
          en: 'Start the ladder by putting the white group in atari. Play D3 or E3. The bot (White) will try to get 2 liberties and escape, and you must chase it to the end.',
          de: 'Starte die Leiter, indem du die weiße Gruppe in Atari setzt. Spiele D3 oder E3. Der Bot (Weiß) wird versuchen, 2 Freiheiten zu bekommen und zu fliehen, und du musst ihn bis zum Ende verfolgen.'
        },
        boardSetup: [
          ...stones('B', ['C4', 'D5', 'E5', 'F4']),
          ...stones('W', ['D4', 'E4'])
        ],
        toPlay: 'B',
        correctMoves: [move('D3'), move('E3')], // First move: put white in atari (D3 or E3)
        isLadder: true,
        botResponses: [
          { userMove: move('D3'), botMove: move('D2') }, // White tries to escape
          { userMove: move('C3'), botMove: move('C2') }, // White escapes further
          { userMove: move('B2'), botMove: move('B1') }, // White escapes more
          { userMove: move('A1'), botMove: move('A2') }, // White escapes to edge
          { userMove: move('B3'), botMove: move('C1') }, // White tries last escape
          { userMove: move('D1'), botMove: move('E1') }, // White continues
          { userMove: move('F1'), botMove: move('G1') }, // White goes back
          { userMove: move('H1'), botMove: move('I1') }, // White cornered
          { userMove: move('I2'), botMove: move('I3') }, // White at edge
          { userMove: move('H3'), botMove: move('G3') }, // White cornered
          { userMove: move('F3'), botMove: move('E3') }, // White at corner
          { userMove: move('E2'), botMove: move('E1') }, // White captured
        ],
        explanation: {
          en: 'This is a ladder. You put the white stone in atari with D3. White tried to escape by moving D2, C2, B1, A2, C1, E1, G1, I1, I3, G3, E3, E1, but you chased it along the board until it was captured. A ladder is a forcing sequence where the attacker can always capture the escaping stone.',
          de: 'Dies ist eine Leiter. Du hast den weißen Stein mit D3 in Atari gesetzt. Weiß versuchte zu fliehen mit D2, C2, B1, A2, C1, E1, G1, I1, I3, G3, E3, E1, aber du hast ihn entlang des Brettes verfolgt, bis er gefangen wurde. Eine Leiter ist eine forcierte Sequenz, bei der der Angreifer den fliehenden Stein immer fangen kann.'
        }
      },
      {
        id: 'eyes-capture-exception',
        title: {
          en: 'Capture Exception',
          de: 'Schlag-Ausnahme'
        },
        prompt: {
          en: 'Play the best move.',
          de: 'Spiele den besten Zug.'
        },
        boardSetup: [
          ...stones('W', ['E4', 'E5', 'F5']),
          ...stones('B', ['D4', 'D5', 'E6', 'F6', 'G5', 'G4'])
        ],
        toPlay: 'B',
        correctMoves: [move('E3')],
        explanation: {
          en: 'Playing E3 captures the white group even though it seems like self-capture. When a move simultaneously captures the opponent, it is legal. This is the exception to the suicide rule.',
          de: 'Der Zug E3 schlägt die weiße Gruppe, obwohl es wie Selbstschlagen wirkt. Wenn ein Zug gleichzeitig den Gegner schlägt, ist er legal. Dies ist die Ausnahme von der Selbstmordregel.'
        }
      }
    ]
  },
  {
    id: 'shapes',
    title: {
      en: 'Lesson 6 · Shapes',
      de: 'Lektion 6 · Formen'
    },
    lessonPath: '/shapes',
    scenarios: [
      {
        id: 'shapes-bamboo',
        title: {
          en: 'Separate and Connect',
          de: 'Trennen und Verbinden'
        },
        prompt: {
          en: 'Play the best move.',
          de: 'Spiele den besten Zug.'
        },
        boardSetup: [
          ...stones('B', ['C4', 'D6']),
          ...stones('W', ['B4', 'B5', 'E5', 'E6'])
        ],
        toPlay: 'B',
        correctMoves: [move('D5')],
        explanation: {
          en: 'Playing D5 separates the two white groups (B4-B5 and E5-E6) while connecting your own stones C4 and D6. This move puts pressure on both white groups at the edge and strengthens your position. Separating the opponent while connecting your own stones is a fundamental principle.',
          de: 'Der Zug D5 trennt die beiden weißen Gruppen (B4-B5 und E5-E6), während er deine eigenen Steine C4 und D6 verbindet. Dieser Zug setzt beide weißen Gruppen am Rand unter Druck und stärkt deine Stellung. Den Gegner zu trennen, während man die eigenen Steine verbindet, ist ein grundlegendes Prinzip.'
        }
      },
      {
        id: 'shapes-avoid-empty-triangle',
        title: {
          en: 'Avoid Empty Triangle',
          de: 'Leeres Dreieck vermeiden'
        },
        prompt: {
          en: 'Play the best move.',
          de: 'Spiele den besten Zug.'
        },
        boardSetup: [
          ...stones('B', ['C4', 'C5']),
          ...stones('W', ['B4', 'D4', 'B5'])
        ],
        toPlay: 'B',
        correctMoves: [move('D5')],
        explanation: {
          en: 'Playing D5 attacks the isolated white stone at D4, making it weak while strengthening your own position. This move puts pressure on the opponent\'s single stone and forces them to respond. Attacking weak stones while building strength is a key strategic principle.',
          de: 'Der Zug D5 greift den isolierten weißen Stein auf D4 an, macht ihn schwach und stärkt gleichzeitig deine eigene Stellung. Dieser Zug setzt den einzelnen Stein des Gegners unter Druck und zwingt ihn zu reagieren. Schwache Steine anzugreifen, während man selbst Stärke aufbaut, ist ein wichtiges strategisches Prinzip.'
        }
      },
      {
        id: 'shapes-tigers-mouth',
        title: {
          en: "Tiger's Mouth",
          de: 'Tigermaul'
        },
        prompt: {
          en: 'Play the best move.',
          de: 'Spiele den besten Zug.'
        },
        boardSetup: [
          ...stones('B', ['D5', 'F5', 'E6']),
          ...stones('W', ['E5', 'D6'])
        ],
        toPlay: 'B',
        correctMoves: [move('E4')],
        explanation: {
          en: "Playing E4 creates a tiger's mouth shape (D5-E4-F5-E6), which is a strong defensive formation. The tiger's mouth prevents cuts and creates a solid connection. It's one of the fundamental good shapes in Go.",
          de: 'Der Zug E4 erzeugt eine Tigermaul-Form (D5-E4-F5-E6), die eine starke Verteidigungsformation ist. Das Tigermaul verhindert Schnitte und schafft eine solide Verbindung. Es ist eine der grundlegenden guten Formen im Go.'
        }
      }
    ]
  },
  {
    id: 'atari',
    title: {
      en: 'Lesson 7 · Atari Go',
      de: 'Lektion 7 · Atari Go'
    },
    lessonPath: '/atari',
    scenarios: [
      {
        id: 'atari-first-capture',
        title: {
          en: 'First Capture',
          de: 'Erster Schlag'
        },
        prompt: {
          en: 'Play the best move.',
          de: 'Spiele den besten Zug.'
        },
        boardSetup: [
          ...stones('W', ['D4']),
          ...stones('B', ['C4', 'D3', 'E4'])
        ],
        toPlay: 'B',
        correctMoves: [move('D5')],
        explanation: {
          en: 'In Atari Go, the game ends with the first capture. The white stone at D4 is in atari with only one liberty at D5. Playing D5 captures it immediately and wins the game. Recognizing atari situations quickly is crucial in Atari Go.',
          de: 'In Atari Go endet die Partie mit dem ersten Schlag. Der weiße Stein auf D4 ist in Atari mit nur einer Freiheit bei D5. Der Zug D5 schlägt ihn sofort und gewinnt die Partie. Das schnelle Erkennen von Atari-Situationen ist entscheidend in Atari Go.'
        }
      },
      {
        id: 'atari-defend',
        title: {
          en: 'Escape to Safety',
          de: 'Zur Sicherheit flüchten'
        },
        prompt: {
          en: 'Play the best move.',
          de: 'Spiele den besten Zug.'
        },
        boardSetup: [
          ...stones('W', ['D2', 'D4', 'E4']),
          ...stones('B', ['C4', 'D5', 'E5', 'F4'])
        ],
        toPlay: 'W',
        correctMoves: [move('C3')],
        explanation: {
          en: 'Playing C3 creates a tiger\'s mouth shape (C3-D2-D4-C4), which is a strong defensive formation. The tiger\'s mouth allows White to escape to the corner and connect safely. This is a fundamental defensive technique - using the corner and tiger\'s mouth shape to create a safe haven.',
          de: 'Der Zug C3 erzeugt eine Tigermaul-Form (C3-D2-D4-C4), die eine starke Verteidigungsformation ist. Das Tigermaul ermöglicht es Weiß, sich in die Ecke zu retten und sicher zu verbinden. Dies ist eine grundlegende Verteidigungstechnik - die Ecke und die Tigermaul-Form nutzen, um einen sicheren Hafen zu schaffen.'
        }
      }
    ]
  },
  {
    id: 'practice',
    title: {
      en: 'Lesson 8 · Practice Game',
      de: 'Lektion 8 · Praxispartie'
    },
    lessonPath: '/practice',
    scenarios: [
      {
        id: 'practice-hane',
        title: {
          en: 'Strengthen the Wall',
          de: 'Die Mauer stärken'
        },
        prompt: {
          en: 'Play the best move.',
          de: 'Spiele den besten Zug.'
        },
        boardSetup: [
          ...stones('W', ['C4', 'D4']),
          ...stones('B', ['B5', 'D5'])
        ],
        toPlay: 'B',
        correctMoves: [move('C5')],
        explanation: {
          en: 'Playing C5 strengthens the black wall (B5-C5-D5) against White while connecting your stones. This move creates a solid formation that blocks White\'s expansion and establishes a strong position. Building strong walls and connections is essential for controlling territory.',
          de: 'Der Zug C5 stärkt die schwarze Mauer (B5-C5-D5) gegen Weiß und verbindet gleichzeitig deine Steine. Dieser Zug erzeugt eine solide Formation, die die Expansion von Weiß blockiert und eine starke Stellung etabliert. Starke Mauern und Verbindungen zu bauen ist entscheidend für die Kontrolle des Gebiets.'
        }
      }
    ]
  }
]

export function getQuizLessons(lang: Language): QuizLessonLocalized[] {
  return QUIZ_LESSONS.map((lesson) => ({
    id: lesson.id,
    title: lesson.title[lang],
    lessonPath: lesson.lessonPath,
    scenarios: lesson.scenarios.map((scenario) => ({
      id: scenario.id,
      title: scenario.title[lang],
      prompt: scenario.prompt[lang],
      boardSetup: scenario.boardSetup,
      toPlay: scenario.toPlay,
      correctMoves: scenario.correctMoves,
      explanation: scenario.explanation[lang],
      hint: scenario.hint?.[lang],
      isInputQuestion: scenario.isInputQuestion,
      correctBlackScore: scenario.correctBlackScore,
      correctWhiteScore: scenario.correctWhiteScore,
      correctLibertyCount: scenario.correctLibertyCount,
      isAdvancedCounting: scenario.isAdvancedCounting,
      correctBlackPrisoners: scenario.correctBlackPrisoners,
      correctWhitePrisoners: scenario.correctWhitePrisoners,
      komi: scenario.komi,
      prisonersGiven: scenario.prisonersGiven,
      isLadder: scenario.isLadder,
      botResponses: scenario.botResponses
    }))
  }))
}

