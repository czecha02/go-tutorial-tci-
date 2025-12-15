'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface LessonProgress {
    videoWatched: boolean
    exerciseDone: boolean
    quizPassed: boolean
}

export interface ProgressState {
    completedLessons: number[]
    currentLesson: number
    lessonProgress: {
        [lessonId: number]: LessonProgress
    }
}

interface ProgressContextType {
    progress: ProgressState
    markLessonComplete: (lessonId: number) => void
    markChecklistItem: (lessonId: number, item: keyof LessonProgress) => void
    setCurrentLesson: (lessonId: number) => void
    getLessonProgress: (lessonId: number) => LessonProgress
    getOverallProgress: () => number
    resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

const STORAGE_KEY = 'go-tutorial-progress'

const defaultProgress: ProgressState = {
    completedLessons: [],
    currentLesson: 0,
    lessonProgress: {}
}

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [progress, setProgress] = useState<ProgressState>(defaultProgress)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load progress from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setProgress(parsed)
            } catch (e) {
                console.error('Failed to parse stored progress:', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
        }
    }, [progress, isLoaded])

    const markLessonComplete = (lessonId: number) => {
        setProgress(prev => ({
            ...prev,
            completedLessons: prev.completedLessons.includes(lessonId)
                ? prev.completedLessons
                : [...prev.completedLessons, lessonId].sort((a, b) => a - b)
        }))
    }

    const markChecklistItem = (lessonId: number, item: keyof LessonProgress) => {
        setProgress(prev => {
            const updatedLessonProgress = {
                videoWatched: prev.lessonProgress[lessonId]?.videoWatched || false,
                exerciseDone: prev.lessonProgress[lessonId]?.exerciseDone || false,
                quizPassed: prev.lessonProgress[lessonId]?.quizPassed || false,
                [item]: true
            }

            // Auto-complete lesson if all items are checked
            const allCompleted = updatedLessonProgress.videoWatched &&
                updatedLessonProgress.exerciseDone &&
                updatedLessonProgress.quizPassed

            return {
                ...prev,
                lessonProgress: {
                    ...prev.lessonProgress,
                    [lessonId]: updatedLessonProgress
                },
                completedLessons: allCompleted && !prev.completedLessons.includes(lessonId)
                    ? [...prev.completedLessons, lessonId].sort((a, b) => a - b)
                    : prev.completedLessons
            }
        })
    }

    const setCurrentLesson = (lessonId: number) => {
        setProgress(prev => ({
            ...prev,
            currentLesson: lessonId
        }))
    }

    const getLessonProgress = (lessonId: number): LessonProgress => {
        return progress.lessonProgress[lessonId] || {
            videoWatched: false,
            exerciseDone: false,
            quizPassed: false
        }
    }

    const getOverallProgress = (): number => {
        const totalLessons = 7 // 0-6
        return Math.round((progress.completedLessons.length / totalLessons) * 100)
    }

    const resetProgress = () => {
        setProgress(defaultProgress)
        localStorage.removeItem(STORAGE_KEY)
    }

    return (
        <ProgressContext.Provider
            value={{
                progress,
                markLessonComplete,
                markChecklistItem,
                setCurrentLesson,
                getLessonProgress,
                getOverallProgress,
                resetProgress
            }}
        >
            {children}
        </ProgressContext.Provider>
    )
}

export function useProgress() {
    const context = useContext(ProgressContext)
    if (context === undefined) {
        throw new Error('useProgress must be used within a ProgressProvider')
    }
    return context
}
