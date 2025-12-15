'use client'

import React from 'react'
import Link from 'next/link'

interface LessonNavigationProps {
    currentLessonId: number
}

const lessonMap: { [key: number]: { path: string; title: string } } = {
    0: { path: '/intro', title: 'Einführung' },
    1: { path: '/rules', title: 'Steine setzen & Freiheiten' },
    2: { path: '/capture', title: 'Schlagen' },
    3: { path: '/eyes', title: 'Augen' },
    4: { path: '/counting', title: 'Zählen' },
    5: { path: '/shapes', title: 'Formen' },
    6: { path: '/atari', title: 'Atari Go' },
    7: { path: '/play', title: 'Gegen Bot spielen' }
}

export default function LessonNavigation({ currentLessonId }: LessonNavigationProps) {
    const previousLesson = currentLessonId > 0 ? lessonMap[currentLessonId - 1] : null
    const nextLesson = currentLessonId < 7 ? lessonMap[currentLessonId + 1] : null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 z-50">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                {previousLesson ? (
                    <Link
                        href={previousLesson.path}
                        className="px-6 py-3 border-2 border-gray-300 font-semibold hover:border-tci-green transition-colors"
                    >
                        ← Zurück
                    </Link>
                ) : (
                    <div className="px-6 py-3 border-2 border-gray-200 text-gray-400 font-semibold">
                        ← Zurück
                    </div>
                )}

                {nextLesson ? (
                    <Link
                        href={nextLesson.path}
                        className="px-6 py-3 bg-tci-green text-white font-bold hover:bg-green-600 transition-colors"
                    >
                        Weiter →
                    </Link>
                ) : (
                    <div className="px-6 py-3 bg-gray-200 text-gray-500 font-bold">
                        Fertig!
                    </div>
                )}
            </div>
        </div>
    )
}
