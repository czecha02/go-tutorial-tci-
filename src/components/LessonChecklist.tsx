'use client'

import React, { useEffect } from 'react'
import { useProgress, LessonProgress } from '@/contexts/ProgressContext'

interface LessonChecklistProps {
    lessonId: number
    items: {
        key: keyof LessonProgress
        label: string
    }[]
    onComplete?: () => void
}

export default function LessonChecklist({ lessonId, items, onComplete }: LessonChecklistProps) {
    const { getLessonProgress, markChecklistItem, progress } = useProgress()
    const lessonProgress = getLessonProgress(lessonId)

    const allCompleted = items.every(item => lessonProgress[item.key])

    useEffect(() => {
        if (allCompleted && onComplete) {
            onComplete()
        }
    }, [allCompleted, onComplete])

    const handleToggle = (key: keyof LessonProgress) => {
        markChecklistItem(lessonId, key)
    }

    const completedCount = items.filter(item => lessonProgress[item.key]).length

    return (
        <div className="lesson-checklist">
            <div className="checklist-header">
                <h3 className="checklist-title">📋 Aufgaben</h3>
                <div className="checklist-progress">
                    {completedCount} / {items.length}
                </div>
            </div>
            <div className="checklist-items">
                {items.map(item => (
                    <label key={item.key} className="checklist-item">
                        <input
                            type="checkbox"
                            checked={lessonProgress[item.key]}
                            onChange={() => handleToggle(item.key)}
                            className="checklist-checkbox"
                        />
                        <span className={`checklist-label ${lessonProgress[item.key] ? 'completed' : ''}`}>
                            {item.label}
                        </span>
                    </label>
                ))}
            </div>
            {allCompleted && (
                <div className="checklist-complete">
                    ✅ Alle Aufgaben abgeschlossen!
                </div>
            )}
        </div>
    )
}
