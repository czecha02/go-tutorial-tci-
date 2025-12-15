'use client'

import React from 'react'

interface VideoPlayerProps {
    videoId: string
    title?: string
    large?: boolean
}

export default function VideoPlayer({ videoId, title, large = false }: VideoPlayerProps) {
    return (
        <div className={large ? "mb-6" : "mb-4"}>
            {title && <h3 className="text-lg font-bold text-tci-dark mb-2">{title}</h3>}
            <div className="relative w-full bg-black" style={{ paddingBottom: large ? '56.25%' : '56.25%', maxWidth: large ? '100%' : '800px', margin: '0 auto' }}>
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={title || 'Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-2 border-gray-300"
                />
            </div>
        </div>
    )
}
