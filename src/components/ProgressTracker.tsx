'use client'

import React from 'react'
import Link from 'next/link'
import { useProgress } from '@/contexts/ProgressContext'
import { usePathname } from 'next/navigation'

const lessons = [
    { id: 0, path: '/intro', title: '0. Intro' },
    { id: 1, path: '/rules', title: '1. Regeln' },
    { id: 2, path: '/capture', title: '2. Schlagen' },
    { id: 3, path: '/eyes', title: '3. Augen' },
    { id: 4, path: '/counting', title: '4. Zählen' },
    { id: 5, path: '/shapes', title: '5. Formen' },
    { id: 6, path: '/atari', title: '6. Atari' },
    { id: 7, path: '/play', title: 'Bot' }
]

export default function ProgressTracker() {
    const { progress } = useProgress()
    const pathname = usePathname()

    return (
        <div className="bg-white border-b-2 border-gray-300">
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex items-center gap-2 overflow-x-auto">
                    <span className="text-sm font-semibold text-gray-600 mr-2">Fortschritt:</span>
                    {lessons.map((lesson, index) => {
                        const isCompleted = progress.completedLessons.includes(lesson.id)
                        const isActive = pathname === lesson.path

                        return (
                            <React.Fragment key={lesson.id}>
                                <Link
                                    href={lesson.path}
                                    className={`
                    px-3 py-1 text-sm font-semibold border transition-colors
                    ${isActive ? 'bg-tci-green text-white border-tci-green' : ''}
                    ${isCompleted && !isActive ? 'bg-green-100 text-tci-green border-tci-green' : ''}
                    ${!isCompleted && !isActive ? 'bg-white text-gray-600 border-gray-300 hover:border-tci-green' : ''}
                  `}
                                    title={lesson.title}
                                >
                                    {lesson.title}
                                </Link>
                                {index < lessons.length - 1 && (
                                    <span className="text-gray-400">→</span>
                                )}
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
