export type Language = 'en' | 'de'

const LESSONS_EN = {
  intro: {
    title: "Introduction to Go",
    what: "Go is a strategic board game where two players take turns placing stones on a 9×9 grid. The goal is to control more territory than your opponent by surrounding empty spaces with your stones.",
    why: "Go teaches strategic thinking, patience, and pattern recognition. It's considered one of the most intellectually challenging games ever created, with simple rules but infinite complexity."
  },
  counting: {
    title: "Counting Territory & Winning",
    what: "At the end of the game, empty intersections surrounded only by your color are your territory. The player with more territory wins. This is the ultimate goal of Go - not just capturing stones, but controlling more space.",
    why: "Go is about territory, not just fighting. Understanding how games end and who wins helps you see the bigger picture. Every move should contribute to securing more territory than your opponent."
  },
  rules: {
    title: "Placing Stones & Liberties",
    what: "Stones go on the intersections. A stone's breathing spaces—its liberties—are the empty points up, down, left, and right. Connected stones share liberties.",
    why: "Tracking liberties tells you which groups are safe and which are in danger. If a group runs out of liberties, it's captured and removed."
  },
  capture: {
    title: "Capturing Groups",
    what: "After you play, remove any adjacent enemy groups with no liberties. If none are removed and your new group has no liberties, the move is illegal (self-capture).",
    why: "Capturing turns local control into territory and weakens your opponent's influence. Learning to spot atari (one liberty left) is the quickest path to early progress."
  },
  ko: {
    title: "The Ko Rule",
    what: "A move that recreates the previous full-board position is forbidden.",
    why: "Ko prevents endless recapture loops. The correct response is to play a threat elsewhere and return later if your opponent answers."
  },
  eyes: {
    title: "Eyes & Life",
    what: "An eye is an empty point fully surrounded by your stones. A group with two separate eyes cannot be captured.",
    why: "Two eyes convert fragile stones into a living base. Don't fill your own eyes unless it wins something significant."
  },
  shapes: {
    title: "Good Shape vs. Bad Shape",
    what: "Certain local patterns are efficient. Examples: Bamboo Joint (good connection), Tiger's Mouth (strong shape), Diagonal/Keima (flexible extension). Avoid the Empty Triangle (slow, clumpy) unless it captures.",
    why: "Good shape gives strong connections and efficient liberties. Bad shape wastes moves or becomes heavy and attackable."
  }
} as const;

const LESSONS_DE = {
  intro: {
    title: "Einführung in Go",
    what: "Go ist ein strategisches Brettspiel, bei dem zwei Spieler abwechselnd Steine auf einem 9×9 Gitter platzieren. Das Ziel ist es, mehr Gebiet als dein Gegner zu kontrollieren, indem du leere Räume mit deinen Steinen umgibst.",
    why: "Go lehrt strategisches Denken, Geduld und Mustererkennung. Es gilt als eines der intellektuell herausforderndsten Spiele, die je geschaffen wurden, mit einfachen Regeln aber unendlicher Komplexität."
  },
  counting: {
    title: "Gebiet zählen & Gewinnen",
    what: "Am Ende des Spiels sind leere Schnittpunkte, die nur von deiner Farbe umgeben sind, dein Gebiet. Der Spieler mit mehr Gebiet gewinnt. Das ist das ultimative Ziel von Go - nicht nur Steine schlagen, sondern mehr Raum kontrollieren.",
    why: "Go geht um Gebiet, nicht nur um Kämpfe. Das Verstehen, wie Spiele enden und wer gewinnt, hilft dir, das große Bild zu sehen. Jeder Zug sollte dazu beitragen, mehr Gebiet als dein Gegner zu sichern."
  },
  rules: {
    title: "Steine platzieren & Freiheiten",
    what: "Steine werden auf die Schnittpunkte gesetzt. Die Atemräume eines Steins—seine Freiheiten—sind die leeren Punkte oben, unten, links und rechts. Verbundene Steine teilen Freiheiten.",
    why: "Das Verfolgen von Freiheiten zeigt Ihnen, welche Gruppen sicher und welche in Gefahr sind. Wenn einer Gruppe die Freiheiten ausgehen, wird sie geschlagen und entfernt."
  },
  capture: {
    title: "Gruppen schlagen",
    what: "Nachdem Sie gezogen haben, entfernen Sie alle benachbarten gegnerischen Gruppen ohne Freiheiten. Wenn keine entfernt werden und Ihre neue Gruppe keine Freiheiten hat, ist der Zug illegal (Selbstschlagen).",
    why: "Das Schlagen verwandelt lokale Kontrolle in Gebiet und schwächt den Einfluss Ihres Gegners. Das Erkennen von Atari (eine Freiheit übrig) ist der schnellste Weg zu frühen Fortschritten."
  },
  ko: {
    title: "Die Ko-Regel",
    what: "Ein Zug, der die vorherige Brett-Position wiederherstellt, ist verboten.",
    why: "Ko verhindert endlose Rückeroberungs-Schleifen. Die richtige Antwort ist, eine Drohung anderswo zu spielen und später zurückzukehren, wenn Ihr Gegner antwortet."
  },
  eyes: {
    title: "Augen & Leben",
    what: "Ein Auge ist ein leerer Punkt, der vollständig von Ihren Steinen umgeben ist. Eine Gruppe mit zwei getrennten Augen kann nicht geschlagen werden.",
    why: "Zwei Augen verwandeln fragile Steine in eine lebende Basis. Füllen Sie Ihre eigenen Augen nicht, es sei denn, es gewinnt etwas Bedeutendes."
  },
  shapes: {
    title: "Gute Form vs. Schlechte Form",
    what: "Bestimmte lokale Muster sind effizient. Beispiele: Bamboo Joint (gute Verbindung), Tiger's Mouth (starke Form), Diagonal/Keima (flexible Erweiterung). Vermeiden Sie das leere Dreieck (langsam, klumpig), es sei denn, es schlägt.",
    why: "Gute Form gibt starke Verbindungen und effiziente Freiheiten. Schlechte Form verschwendet Züge oder wird schwer und angreifbar."
  }
} as const;

export const LESSONS = LESSONS_DE;

export function getLessons(lang: Language) {
  return lang === 'de' ? LESSONS_DE : LESSONS_EN;
}

const SHAPE_LESSONS_EN = {
  bambooJoint: {
    title: "Bamboo Joint",
    description: "Two pairs of stones with two spaces between them",
    why: "Very hard to cut; solid connection",
    example: "Place stones at D4-D5, then F4-F5 (two spaces apart)"
  },
  tigersMouth: {
    title: "Tiger's Mouth",
    description: "A wedge shape that defends a cut",
    why: "Keeps cutting points safe",
    example: "Form a triangle with stones at E4, D5, and E6"
  },
  keima: {
    title: "Keima (Knight's Move)",
    description: "Two-space diagonal jump like a knight in chess",
    why: "Fast extension with reasonable stability; vulnerable to well-timed approach",
    example: "From D4, jump to E6 (knight's move pattern)"
  },
  emptyTriangle: {
    title: "Empty Triangle (Bad)",
    description: "Three stones forming a filled triangle",
    why: "Fewer liberties for the investment; slow unless it captures/seals",
    example: "Avoid placing stones at D4, E4, and D5 in a triangle"
  },
  singleJump: {
    title: "Single Jump (Good)",
    description: "One-space diagonal extension",
    why: "Fast and flexible; good for quick development",
    example: "From E4, extend to E6 (one space jump)"
  },
  ponuki: {
    title: "Ponuki (Good)",
    description: "A formation that occurs after capturing a stone, giving good shape to live and influence",
    why: "Strategic sacrifice; creates strong influence and flexible living shape",
    example: "E4, F5, E6, D5 - formation after capturing gives good shape to live"
  },
  goodCombi: {
    title: "Good Combination (Good)",
    description: "Three stones in a flexible formation",
    why: "Balances speed, safety, and influence",
    example: "D4, E6, F4 - creates strong influence"
  },
  overconcentratedBulk: {
    title: "Overconcentrated Bulk (Bad)",
    description: "Too many stones clustered together",
    why: "Inefficient use of stones; wastes potential",
    example: "Avoid placing too many stones in one area"
  },
  overconcentrated: {
    title: "Overconcentrated Lines (Bad)",
    description: "Too many stones stacked on the third line",
    why: "Inefficient; invites opponent to take the wider side",
    example: "Don't place all stones on the third line"
  }
} as const;

const SHAPE_LESSONS_DE = {
  bambooJoint: {
    title: "Bambusgelenk",
    description: "Zwei Paare von Steinen mit zwei Feldern Abstand",
    why: "Sehr schwer zu schneiden; solide Verbindung",
    example: "Platziere Steine bei D4-D5, dann F4-F5 (zwei Felder Abstand)"
  },
  tigersMouth: {
    title: "Tigermaul",
    description: "Eine Keilform, die einen Schnitt verteidigt",
    why: "Hält Schnittpunkte sicher",
    example: "Bilde ein Dreieck mit Steinen bei E4, D5 und E6"
  },
  keima: {
    title: "Keima (Rösselsprung)",
    description: "Zwei-Felder diagonaler Sprung wie ein Springer im Schach",
    why: "Schnelle Erweiterung mit angemessener Stabilität; anfällig für gut getimte Annäherung",
    example: "Von D4, springe zu E6 (Rösselsprung-Muster)"
  },
  singleJump: {
    title: "Einzelner Sprung (Gut)",
    description: "Einräumige diagonale Erweiterung",
    why: "Schnell und flexibel; gut für schnelle Entwicklung",
    example: "Von E4, erweitere zu E6 (einräumiger Sprung)"
  },
  ponuki: {
    title: "Ponuki (Gut)",
    description: "Eine Formation, die nach dem Schlagen eines Steins entsteht und gute Form zum Leben und Einfluss gibt",
    why: "Strategisches Opfer; schafft starken Einfluss und flexible lebende Form",
    example: "E4, F5, E6, D5 - Formation nach dem Schlagen gibt gute Form zum Leben"
  },
  goodCombi: {
    title: "Gute Kombination (Gut)",
    description: "Drei Steine in einer flexiblen Formation",
    why: "Balanciert Geschwindigkeit, Sicherheit und Einfluss",
    example: "D4, E6, F4 - schafft starken Einfluss"
  },
  overconcentratedBulk: {
    title: "Überkonzentrierte Masse (Schlecht)",
    description: "Zu viele Steine in einem Bereich gehäuft",
    why: "Ineffiziente Nutzung der Steine; verschwendet Potential",
    example: "Vermeide zu viele Steine in einem Bereich zu platzieren"
  },
  emptyTriangle: {
    title: "Leeres Dreieck (Schlecht)",
    description: "Drei Steine bilden ein gefülltes Dreieck",
    why: "Weniger Freiheiten für die Investition; langsam, es sei denn es schlägt/versiegelt",
    example: "Vermeide Steine bei D4, E4 und D5 in einem Dreieck zu platzieren"
  },
  overconcentrated: {
    title: "Überkonzentrierte Linien (Schlecht)",
    description: "Zu viele Steine auf der dritten Linie gestapelt",
    why: "Ineffizient; lädt den Gegner ein, die breitere Seite zu nehmen",
    example: "Platziere nicht alle Steine auf der dritten Linie"
  }
} as const;

export const SHAPE_LESSONS = SHAPE_LESSONS_DE;

export function getShapeLessons(lang: Language) {
  return lang === 'de' ? SHAPE_LESSONS_DE : SHAPE_LESSONS_EN;
}

// UI Translations
export const UI_TRANSLATIONS = {
  en: {
    goTutorial: "Go Tutorial",
    learningFlow: "Learning Flow",
    startLearning: "Start Learning",
    learnMore: "Learn More",
    whyThisMatters: "Why this matters:",
    masterTheGame: "Master the ancient game of strategy on a 9×9 board",
    learnGoWith: "Learn Go with TCI",
    followLearningPath: "Follow our structured learning path to master Go fundamentals. Start with Session 1 and progress through each session in order.",
    startHere: "Start here:",
    thenContinue: "Then continue through Sessions 2-6",
    session: "Session",
    placingStonesLiberties: "Placing Stones & Liberties",
    capturing: "Capturing",
    eyes: "Eyes",
    counting: "Counting",
    shapes: "Shapes",
    atariGo: "Atari Go",
    introduction: "Introduction",
    quiz: "Quiz",
    quizTitle: "Interactive Go Fundamentals Lab",
    quizSubtitle: "Solve three live board drills per lesson to prove your understanding.",
    quizIntro: "Play the required stones on the 9×9 board. Every scenario mirrors a lesson objective—solve them all to light up the path.",
    quizScore: "Progress",
    quizSolvedCount: "{{solved}} of {{total}} puzzles solved",
    quizResetAll: "Reset all",
    quizScenarioReset: "Reset scenario",
    quizHint: "Hint",
    quizIllegalMove: "Illegal move. Try a different intersection.",
    quizWrongMove: "That move doesn't match the prompt. Try again.",
    quizBlackToPlay: "Black to play",
    quizWhiteToPlay: "White to play",
    quizPassButton: "Pass",
    quizAttemptsLabel: "Attempts {{count}}",
    quizSolved: "Solved!",
    quizPending: "Pending",
    quizNeedsPass: "Use the pass button for this puzzle.",
    quizScoreCard: "Progress",
    quizReviewLesson: "Open lesson",

    // Rules page
    what: "What",
    whyThisMattersShort: "Why this matters",
    tryItYourself: "Try it yourself",
    reset: "Reset",
    stepOf: "Step {{current}} of {{total}}",
    greatJob: "Great job!",
    nextCapturing: "Next: Capturing",
    moveHistory: "Move History & Liberty Analysis",
    move: "Move",
    liberties: "Liberties",
    groupType: "Group Type",
    position: "Position",
    groupSize: "Group Size",
    analysis: "Analysis",
    libertyCount: "{{count}} liberties",
    stones: "stones",
    stone: "stone",
    isolatedStone: "Isolated stone",
    connectedPair: "Connected pair",
    connectedTrio: "Connected trio",
    largeGroup: "Large group",
    analysisText: "Watch how the liberty count changes as stones connect into groups. Connected stones share liberties, so the total count reflects the group's breathing space.",
    libertiesHighlighted: "Liberties Highlighted:",
    showingLibertyIntersections: "Showing {{count}} liberty intersections in red on the board.",
    groupLibertyHighlighting: "Group Liberty Highlighting",
    groupLibertyDescription: "All liberties of the connected group are highlighted for 3.5s. When stones connect, you'll see ALL liberties of the entire group!",
    rulesPageWhat: "Stones go on the intersections. A group is a set of connected stones of one color. The empty points directly up, down, left, and right are the group's liberties.",
    rulesPageWhy: "Groups share liberties. If all liberties of a group are filled by the opponent, the whole group is captured. Seeing the liberties immediately after each move helps you judge safety and danger.",
    rulesPageTry: "Click on intersections to place black stones. Watch as ALL liberties of the connected group light up in red for 3.5 seconds. When stones connect, you'll see the complete liberty pattern of the entire group!",
    rulesPageNote: "Only black stones can be placed in this lesson to focus on learning liberties.",
    rulesPageLearned: "You've learned the basics of placing stones and liberties.",
    groupLibertyActive: "Group Liberty Highlighting Active:",
    showingLiberties: "Showing {{count}} liberties of the connected group.",
    manualLibertyHighlighting: "Manual Liberty Highlighting:",

    // Capture page
    taskOf: "Task {{current}} of {{total}}",
    captures: "Captures:",
    task1: "Task 1: Capture the single white stone at B2",
    task2: "Task 2: Capture the two connected white stones at H2-H3",
    task3: "Task 3: Capture the three connected white stones at B8-C8-B9",
    task4: "Task 4: Capture the L-shaped group at G7-H7-I7-G8",
    task5: "Task 5: Capture the larger group at E5-F5-E6-F6",
    allTasksCompleted: "All tasks completed!",
    captureTaskDescription: "Place black stones to capture the white group. Each group has different liberty patterns - use what you learned about liberties to find the right moves!",
    captureTaskCompleted: "Congratulations! You've completed all capture tasks.",
    excellent: "Excellent!",
    youveMasteredCapture: "You've mastered the art of capture! You can now:",
    identifyVulnerableGroups: "• Identify vulnerable groups",
    countLibertiesAccurately: "• Count liberties accurately",
    executeCaptureSequences: "• Execute capture sequences",
    nextEyes: "Next: Eyes & Life",
    captureTasks: "Capture Tasks",
    singleStoneCapture: "Single stone capture",
    twoStoneGroupCapture: "Two-stone group capture",
    threeStoneGroupCapture: "Three-stone group capture",
    lShapedGroupCapture: "L-shaped group capture",
    largeGroupCapture: "Large group capture",
    libertyToRemove: "{{count}} liberty to remove",
    libertiestoRemove: "{{count}} liberties to remove",
    capturedStonesWhite: "Captured Stones White?",
    capturedStonesBlack: "Captured Stones Black",
    plusPoints: "Plus points",

    // Eyes page
    eyesInteractiveLessons: "Eyes & Life Interactive Lessons",
    lesson: "Lesson",
    selfCapture: "Self-Capture",
    captureWithSelfCapture: "Capture with Self-Capture",
    twoEyes: "Two Eyes",
    lesson1SelfCaptureIllegal: "Lesson 1: Self-Capture is Illegal",
    lesson1Description: "The black group is surrounded by white stones. Try to place a black stone inside the black group. This would capture your own stones, which is illegal in Go.",
    lesson1Rule: "You cannot capture your own stones. This prevents suicide moves.",
    lesson1Try: "Try placing inside the surrounded black group",
    lesson2Exception: "Lesson 2: Capture with Self-Capture (Exception)",
    lesson2Description: "Now try to place a black stone inside the white group. This will capture both your own stones AND the surrounding white stones, making self-capture legal!",
    lesson2Rule: "Self-capture becomes legal when you also capture enemy stones in the same move.",
    lesson2Try: "Try placing inside the white group to capture both",
    lesson3TwoEyesLife: "Lesson 3: Two Eyes for Life",
    lesson3Description: "The white group has two eyes and is completely surrounded by black stones. Try to capture the white group - you'll find it's impossible! Two eyes make a group uncapturable.",
    lesson3Rule: "Groups with two eyes cannot be captured and are considered alive.",
    lesson3Try: "Try to capture the white group - it's impossible!",
    selfCaptureIllegalMessage: "Self-Capture is Illegal!",
    selfCaptureIllegalText: "You cannot capture your own stones. This move is not allowed in Go.",
    selfCaptureExceptionWorks: "Self-Capture Exception Works!",
    selfCaptureExceptionText: "Because you also captured enemy stones, self-capture becomes legal. You captured both your own stones and the surrounding white stones.",
    twoEyesMakeLife: "Two Eyes Make Life!",
    twoEyesMakeLifeText: "The white group has two eyes and cannot be captured, even when completely surrounded! This demonstrates the power of two eyes in Go.",
    lessonMastered: "Lesson {{number}} Mastered!",
    lesson1Learned: "You've learned that self-capture is illegal in Go.",
    lesson2Learned: "You've learned the exception: self-capture becomes legal when also capturing enemies.",
    lesson3Learned: "You've learned that two eyes make a group alive and uncapturable.",
    nextLesson: "Next Lesson",
    nextCounting: "Next: Counting Territory",

    // Introduction page
    introPageTitle: "Welcome to Go!",
    introPageSubtitle: "The ancient game of strategy and territory",
    introPageDescription: "Go is one of the oldest board games in the world, played for over 2,500 years. Despite its simple rules, it offers incredible depth and strategic complexity.",
    introPageHowToPlay: "How to Play:",
    introPageRules: [
      "Two players take turns placing stones (black and white)",
      "Stones are placed on the intersections of the grid lines",
      "The goal is to surround more territory than your opponent",
      "You can capture enemy stones by surrounding them completely",
      "The game ends when both players pass consecutively",
      "The player with more territory wins"
    ],
    introPageTryIt: "Try placing some stones on the board below to get a feel for the game!",
    introPageNext: "Ready to learn the fundamentals? Let's start with placing stones and understanding liberties.",
    introPageStartLearning: "Start Learning Fundamentals",

    // New sections
    introPageScoring: "Scoring & Winning",
    introPageScoringRules: [
      "Afterwards: Territory + captured stones = Score",
      "Whoever has more points wins"
    ],
    introPageKomi: "Komi",
    introPageKomiDescription: "Because Black plays first, White gets +5.5 or +6.5 points. This keeps the game balanced.",
    introPagePassing: "Passing & Game End",
    introPagePassingDescription: "Pass = You skip your turn when there are no meaningful moves left. Two consecutive passes = Game over → remove dead groups, count score.",
    introPageTerritory: "Territory",
    introPageTerritoryDescription: "Empty points surrounded only by your stones. Each point = 1 point of territory. Each captured stone = +1 point.",
    introPageBoardSizes: "Board Sizes",
    introPageBoardSizesDescription: "9×9 → perfect for beginners: fast & clear. 13×13 → intermediate level. 19×19 → official tournament board, maximum depth.",
    introPageTip: "Tip",
    introPageTipDescription: "Start on 9×9 – learn how groups live, die, and territory is formed. Go is easy to learn, but endlessly deep – every game is unique.",
    introPageWhatMakesSpecial: "What makes Go special?",
    introPageSpecialDescription: "Go has simple rules but incredible depth. Every game is unique, and there are more possible games than atoms in the observable universe! The game teaches patience, strategic thinking, and pattern recognition."
  },
  de: {
    goTutorial: "Go Lernprogramm",
    learningFlow: "Lernpfad",
    startLearning: "Lernen beginnen",
    learnMore: "Mehr erfahren",
    whyThisMatters: "Warum das wichtig ist:",
    masterTheGame: "Meistere das alte strategische Spiel auf einem 9×9 Brett",
    learnGoWith: "Lerne Go mit TCI",
    followLearningPath: "Folgen Sie unserem strukturierten Lernpfad, um die Go-Grundlagen zu meistern. Beginnen Sie mit Sitzung 1 und arbeiten Sie sich durch jede Sitzung in Reihenfolge.",
    startHere: "Hier beginnen:",
    thenContinue: "Dann weiter durch Sitzungen 2-6",
    session: "Sitzung",
    placingStonesLiberties: "Steine platzieren & Freiheiten",
    capturing: "Schlagen",
    eyes: "Augen",
    counting: "Zählen",
    shapes: "Formen",
    atariGo: "Atari Go",
    introduction: "Einführung",
    quiz: "Quiz",
    quizTitle: "Interaktives Go-Grundlagen-Lab",
    quizSubtitle: "Löse drei Live-Aufgaben pro Lektion, um dein Verständnis zu beweisen.",
    quizIntro: "Setze die geforderten Steine auf dem 9×9-Brett. Jede Aufgabe spiegelt ein Lernziel – löse sie alle, damit der Pfad aufleuchtet.",
    quizScore: "Fortschritt",
    quizSolvedCount: "{{solved}} von {{total}} Aufgaben gelöst",
    quizResetAll: "Alles zurücksetzen",
    quizScenarioReset: "Aufgabe zurücksetzen",
    quizHint: "Hinweis",
    quizIllegalMove: "Illegaler Zug. Versuche einen anderen Schnittpunkt.",
    quizWrongMove: "Dieser Zug passt nicht zur Aufgabe. Versuche es erneut.",
    quizBlackToPlay: "Schwarz am Zug",
    quizWhiteToPlay: "Weiß am Zug",
    quizPassButton: "Passen",
    quizAttemptsLabel: "Versuche {{count}}",
    quizSolved: "Gelöst!",
    quizPending: "Offen",
    quizNeedsPass: "Nutze den Pass-Button für diese Aufgabe.",
    quizScoreCard: "Fortschritt",
    quizReviewLesson: "Lektion öffnen",

    // Rules page
    what: "Was",
    whyThisMattersShort: "Warum das wichtig ist",
    tryItYourself: "Probieren Sie es selbst",
    reset: "Zurücksetzen",
    stepOf: "Schritt {{current}} von {{total}}",
    greatJob: "Großartig gemacht!",
    nextCapturing: "Weiter: Schlagen",
    moveHistory: "Zughistorie & Freiheiten-Analyse",
    move: "Zug",
    liberties: "Freiheiten",
    groupType: "Gruppen-Typ",
    position: "Position",
    groupSize: "Gruppengröße",
    analysis: "Analyse",
    libertyCount: "{{count}} Freiheiten",
    stones: "Steine",
    stone: "Stein",
    isolatedStone: "Einzelner Stein",
    connectedPair: "Verbundenes Paar",
    connectedTrio: "Verbundenes Trio",
    largeGroup: "Große Gruppe",
    analysisText: "Beobachten Sie, wie sich die Anzahl der Freiheiten ändert, wenn Steine zu Gruppen verbunden werden. Verbundene Steine teilen Freiheiten, sodass die Gesamtzahl den Atemraum der Gruppe widerspiegelt.",
    libertiesHighlighted: "Freiheiten hervorgehoben:",
    showingLibertyIntersections: "Zeigt {{count}} Freiheiten-Schnittpunkte rot auf dem Brett.",
    groupLibertyHighlighting: "Gruppen-Freiheiten-Hervorhebung",
    groupLibertyDescription: "Alle Freiheiten der verbundenen Gruppe werden 3,5 Sekunden lang hervorgehoben. Wenn Steine sich verbinden, sehen Sie ALLE Freiheiten der gesamten Gruppe!",
    rulesPageWhat: "Steine werden auf die Schnittpunkte gesetzt. Eine Gruppe ist eine Menge verbundener Steine einer Farbe. Die leeren Punkte direkt oben, unten, links und rechts sind die Freiheiten der Gruppe.",
    rulesPageWhy: "Gruppen teilen Freiheiten. Wenn alle Freiheiten einer Gruppe vom Gegner gefüllt werden, wird die gesamte Gruppe geschlagen. Das sofortige Sehen der Freiheiten nach jedem Zug hilft Ihnen, Sicherheit und Gefahr einzuschätzen.",
    rulesPageTry: "Klicken Sie auf Schnittpunkte, um schwarze Steine zu platzieren. Beobachten Sie, wie ALLE Freiheiten der verbundenen Gruppe 3,5 Sekunden lang rot aufleuchten. Wenn Steine sich verbinden, sehen Sie das vollständige Freiheitsmuster der gesamten Gruppe!",
    rulesPageNote: "In dieser Lektion können nur schwarze Steine platziert werden, um sich auf das Lernen von Freiheiten zu konzentrieren.",
    rulesPageLearned: "Sie haben die Grundlagen des Platzierens von Steinen und Freiheiten gelernt.",
    groupLibertyActive: "Gruppen-Freiheiten-Hervorhebung aktiv:",
    showingLiberties: "Zeigt {{count}} Freiheiten der verbundenen Gruppe.",
    manualLibertyHighlighting: "Manuelle Freiheiten-Hervorhebung:",

    // Capture page
    taskOf: "Aufgabe {{current}} von {{total}}",
    captures: "Gefangen:",
    task1: "Aufgabe 1: Schlage den einzelnen weißen Stein bei B2",
    task2: "Aufgabe 2: Schlage die zwei verbundenen weißen Steine bei H2-H3",
    task3: "Aufgabe 3: Schlage die drei verbundenen weißen Steine bei B8-C8-B9",
    task4: "Aufgabe 4: Schlage die L-förmige Gruppe bei G7-H7-I7-G8",
    task5: "Aufgabe 5: Schlage die größere Gruppe bei E5-F5-E6-F6",
    allTasksCompleted: "Alle Aufgaben abgeschlossen!",
    captureTaskDescription: "Platziere schwarze Steine, um die weiße Gruppe zu schlagen. Jede Gruppe hat unterschiedliche Freiheitsmuster - nutze was du über Freiheiten gelernt hast, um die richtigen Züge zu finden!",
    captureTaskCompleted: "Glückwunsch! Du hast alle Schlag-Aufgaben abgeschlossen.",
    excellent: "Ausgezeichnet!",
    youveMasteredCapture: "Du hast die Kunst des Schlagens gemeistert! Du kannst jetzt:",
    identifyVulnerableGroups: "• Verwundbare Gruppen identifizieren",
    countLibertiesAccurately: "• Freiheiten genau zählen",
    executeCaptureSequences: "• Schlagsequenzen ausführen",
    nextEyes: "Weiter: Augen & Leben",
    captureTasks: "Schlag-Aufgaben",
    singleStoneCapture: "Einzelstein schlagen",
    twoStoneGroupCapture: "Zwei-Stein-Gruppe schlagen",
    threeStoneGroupCapture: "Drei-Stein-Gruppe schlagen",
    lShapedGroupCapture: "L-förmige Gruppe schlagen",
    largeGroupCapture: "Große Gruppe schlagen",
    libertyToRemove: "{{count}} Freiheit zu entfernen",
    libertiestoRemove: "{{count}} Freiheiten zu entfernen",
    capturedStonesWhite: "Geschlagene Steine Weis?",
    capturedStonesBlack: "Gefangende Steine Schwarz",
    plusPoints: "Pluspunkte",

    // Eyes page
    eyesInteractiveLessons: "Augen & Leben Interaktive Lektionen",
    lesson: "Lektion",
    selfCapture: "Selbstschlagen",
    captureWithSelfCapture: "Schlagen mit Selbstschlagen",
    twoEyes: "Zwei Augen",
    lesson1SelfCaptureIllegal: "Lektion 1: Selbstschlagen ist illegal",
    lesson1Description: "Die schwarze Gruppe ist von weißen Steinen umgeben. Versuche, einen schwarzen Stein innerhalb der schwarzen Gruppe zu platzieren. Das würde deine eigenen Steine schlagen, was in Go illegal ist.",
    lesson1Rule: "Du kannst deine eigenen Steine nicht schlagen. Dies verhindert Selbstmord-Züge.",
    lesson1Try: "Versuche innerhalb der umzingelten schwarzen Gruppe zu platzieren",
    lesson2Exception: "Lektion 2: Schlagen mit Selbstschlagen (Ausnahme)",
    lesson2Description: "Versuche nun, einen schwarzen Stein innerhalb der weißen Gruppe zu platzieren. Dies wird sowohl deine eigenen Steine ALS AUCH die umgebenden weißen Steine schlagen und macht Selbstschlagen legal!",
    lesson2Rule: "Selbstschlagen wird legal, wenn du im selben Zug auch gegnerische Steine schlägst.",
    lesson2Try: "Versuche innerhalb der weißen Gruppe zu platzieren, um beide zu schlagen",
    lesson3TwoEyesLife: "Lektion 3: Zwei Augen für Leben",
    lesson3Description: "Die weiße Gruppe hat zwei Augen und ist vollständig von schwarzen Steinen umgeben. Versuche, die weiße Gruppe zu schlagen - du wirst feststellen, dass es unmöglich ist! Zwei Augen machen eine Gruppe unschlagbar.",
    lesson3Rule: "Gruppen mit zwei Augen können nicht geschlagen werden und gelten als lebendig.",
    lesson3Try: "Versuche die weiße Gruppe zu schlagen - es ist unmöglich!",
    selfCaptureIllegalMessage: "Selbstschlagen ist illegal!",
    selfCaptureIllegalText: "Du kannst deine eigenen Steine nicht schlagen. Dieser Zug ist in Go nicht erlaubt.",
    selfCaptureExceptionWorks: "Selbstschlagen-Ausnahme funktioniert!",
    selfCaptureExceptionText: "Da du auch gegnerische Steine geschlagen hast, wird Selbstschlagen legal. Du hast sowohl deine eigenen Steine als auch die umgebenden weißen Steine geschlagen.",
    twoEyesMakeLife: "Zwei Augen machen Leben!",
    twoEyesMakeLifeText: "Die weiße Gruppe hat zwei Augen und kann nicht geschlagen werden, selbst wenn sie vollständig umzingelt ist! Dies demonstriert die Macht von zwei Augen in Go.",
    lessonMastered: "Lektion {{number}} gemeistert!",
    lesson1Learned: "Du hast gelernt, dass Selbstschlagen in Go illegal ist.",
    lesson2Learned: "Du hast die Ausnahme gelernt: Selbstschlagen wird legal, wenn man auch Gegner schlägt.",
    lesson3Learned: "Du hast gelernt, dass zwei Augen eine Gruppe lebendig und unschlagbar machen.",
    nextLesson: "Nächste Lektion",
    nextCounting: "Weiter: Gebiet zählen",

    // Introduction page
    introPageTitle: "So spielt man Go",
    introPageSubtitle: "Das alte Spiel der Strategie und des Gebiets",
    introPageDescription: "Go ist eines der ältesten Brettspiele der Welt und wird seit über 2.500 Jahren gespielt. Trotz seiner einfachen Regeln bietet es unglaubliche Tiefe und strategische Komplexität.",
    introPageHowToPlay: "Grundregeln:",
    introPageRules: [
      "Zwei Spieler: Schwarz beginnt, Weiß folgt",
      "Steine werden auf Schnittpunkte gesetzt (nicht in Felder)",
      "Einmal gelegt = bleibt liegen, wird nicht bewegt",
      "Ziel: Mehr Gebiet umschließen als der Gegner",
      "Umzingelst du alle Freiheiten einer Gruppe, nimmst du sie vom Brett",
      "Wenn beide passen, ist das Spiel vorbei"
    ],
    introPageTryIt: "Versuche, einige Steine auf dem Brett unten zu platzieren, um ein Gefühl für das Spiel zu bekommen!",
    introPageNext: "Bereit, die Grundlagen zu lernen? Lass uns mit dem Verständnis von Gebiet und wie Spiele gewonnen werden beginnen.",
    introPageStartLearning: "Grundlagen lernen beginnen",

    // New sections
    introPageScoring: "Punkte & Gewinnen",
    introPageScoringRules: [
      "Danach: Gebiet + gefangene Steine = Punkte",
      "Wer mehr Punkte hat, gewinnt"
    ],
    introPageKomi: "Komi",
    introPageKomiDescription: "Weil Schwarz zuerst zieht, bekommt Weiß +5½ oder +6½ Punkte. So bleibt das Spiel ausgeglichen.",
    introPagePassing: "Passen & Spielende",
    introPagePassingDescription: "Passen = Du überspringst deinen Zug, wenn es nichts Sinnvolles mehr gibt. Zweimal passen = Spielende → tote Gruppen entfernen, Punkte zählen.",
    introPageTerritory: "Gebiet",
    introPageTerritoryDescription: "Leere Punkte, die nur von deinen Steinen umgeben sind. Jeder Punkt = 1 Punkt Gebiet. Jeder gefangene Stein = +1 Punkt.",
    introPageBoardSizes: "Brettgrößen",
    introPageBoardSizesDescription: "9×9 → perfekt für Anfänger: schnell & übersichtlich. 13×13 → mittleres Level. 19×19 → offizielles Turnierbrett, maximale Tiefe.",
    introPageTip: "Tipp",
    introPageTipDescription: "Starte auf 9×9 – lerne, wie Gruppen leben, sterben und Gebiet entsteht. Go ist leicht zu lernen, aber endlos tief – jedes Spiel ist einzigartig.",
    introPageWhatMakesSpecial: "Was macht Go besonders?",
    introPageSpecialDescription: "Go hat einfache Regeln, aber unglaubliche Tiefe. Jedes Spiel ist einzigartig, und es gibt mehr mögliche Spiele als Atome im beobachtbaren Universum! Das Spiel lehrt Geduld, strategisches Denken und Mustererkennung."
  }
} as const;

export function getUITranslations(lang: Language) {
  return UI_TRANSLATIONS[lang];
}

// Helper function for string interpolation
export function t(key: keyof typeof UI_TRANSLATIONS['en'], lang: Language, params?: Record<string, string | number>): string {
  let text = UI_TRANSLATIONS[lang][key] as string;

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(`{{${paramKey}}}`, String(value));
    });
  }

  return text;
}