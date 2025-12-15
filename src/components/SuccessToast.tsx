'use client'

import React, { useEffect, useState } from 'react'

interface SuccessToastProps {
    message: string
    show: boolean
    onClose: () => void
    duration?: number
}

export default function SuccessToast({ message, show, onClose, duration = 3000 }: SuccessToastProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (show) {
            setIsVisible(true)
            const timer = setTimeout(() => {
                setIsVisible(false)
                setTimeout(onClose, 300) // Wait for fade out animation
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [show, duration, onClose])

    if (!show && !isVisible) return null

    return (
        <div className={`success-toast ${isVisible ? 'show' : ''}`}>
            <div className="success-toast-content">
                <span className="success-toast-icon">🎉</span>
                <span className="success-toast-message">{message}</span>
            </div>
        </div>
    )
}
