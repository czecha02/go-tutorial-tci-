'use client'

import React, { useEffect, useState } from 'react'

const TOUR_STORAGE_KEY = 'go-tutorial-tour-completed'

const tourSteps = [
    {
        title: 'Willkommen! 👋',
        description: 'Lerne Go Schritt für Schritt mit diesem interaktiven Tutorial.',
        highlight: null
    },
    {
        title: 'Dein Fortschritt 📊',
        description: 'Hier oben siehst du deinen Fortschritt durch alle Lektionen.',
        highlight: '.progress-tracker-container'
    },
    {
        title: 'Navigation 🧭',
        description: 'Nutze die Weiter/Zurück-Buttons unten, um durch die Lektionen zu navigieren.',
        highlight: '.lesson-navigation'
    },
    {
        title: 'Los geht\'s! 🚀',
        description: 'Viel Spaß beim Lernen! Du kannst jederzeit zwischen den Lektionen wechseln.',
        highlight: null
    }
]

export default function OnboardingTour() {
    const [isActive, setIsActive] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY)
        if (!tourCompleted) {
            // Wait a bit for the page to load
            setTimeout(() => setIsActive(true), 500)
        }
    }, [])

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleClose()
        }
    }

    const handleSkip = () => {
        handleClose()
    }

    const handleClose = () => {
        setIsActive(false)
        localStorage.setItem(TOUR_STORAGE_KEY, 'true')
    }

    if (!isActive) return null

    const step = tourSteps[currentStep]

    return (
        <>
            <div className="onboarding-overlay" onClick={handleSkip} />
            <div className="onboarding-tour">
                <div className="onboarding-content">
                    <h2 className="onboarding-title">{step.title}</h2>
                    <p className="onboarding-description">{step.description}</p>
                    <div className="onboarding-actions">
                        <button onClick={handleSkip} className="onboarding-skip">
                            Überspringen
                        </button>
                        <div className="onboarding-dots">
                            {tourSteps.map((_, index) => (
                                <span
                                    key={index}
                                    className={`onboarding-dot ${index === currentStep ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                        <button onClick={handleNext} className="onboarding-next">
                            {currentStep < tourSteps.length - 1 ? 'Weiter' : 'Fertig'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
