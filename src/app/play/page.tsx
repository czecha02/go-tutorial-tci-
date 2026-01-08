'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import BoardSvg from '@/components/BoardSvg'
import { createInitialState, placeStone, toStoneArray, GameState, Point } from '@/lib/engine'
import { getBotMove } from '@/lib/bot'
import LessonNavigation from '@/components/LessonNavigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { getUITranslations } from '@/content/strings'

export default function PlayBotPage() {
    const { language } = useLanguage()
    const t = getUITranslations(language)

    const [gameState, setGameState] = useState<GameState>(createInitialState())
    const [isBotThinking, setIsBotThinking] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing')
    const [winner, setWinner] = useState<'B' | 'W' | null>(null)
    const [passCount, setPassCount] = useState(0)

    const stones = useMemo(() => toStoneArray(gameState.board), [gameState.board])

    // Bot turn effect
    useEffect(() => {
        if (gameStatus === 'playing' && gameState.toPlay === 'W' && !isBotThinking) {
            setIsBotThinking(true)
            setCountdown(10) // Start 10s countdown
        }
    }, [gameState.toPlay, gameStatus, isBotThinking])

    const handlePass = useCallback(() => {
        const newPassCount = passCount + 1
        setPassCount(newPassCount)

        // Switch turn
        setGameState(prev => ({
            ...prev,
            toPlay: prev.toPlay === 'B' ? 'W' : 'B',
            lastMove: undefined // Clear last move marker on pass
        }))

        if (newPassCount >= 2) {
            setGameStatus('finished')
        }
    }, [passCount])

    const executeBotMove = useCallback(() => {
        try {
            const move = getBotMove(gameState, 'W')

            if (move) {
                const { nextState } = placeStone(gameState, move, 'W')
                setGameState(nextState)
                setPassCount(0)
            } else {
                // Bot passes
                handlePass()
            }
        } catch (e) {
            console.error("Bot error:", e)
            handlePass()
        }

        setIsBotThinking(false)
    }, [gameState, handlePass])

    // Countdown and Move Execution Effect
    useEffect(() => {
        if (!isBotThinking || countdown <= 0) return

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    // Execute move when countdown hits 0 (or 1 -> 0 transition)
                    executeBotMove()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isBotThinking, countdown, executeBotMove])

    const handlePlayerMove = (x: number, y: number) => {
        if (gameStatus !== 'playing' || gameState.toPlay !== 'B' || isBotThinking) return

        try {
            const { nextState } = placeStone(gameState, { x, y }, 'B')
            setGameState(nextState)
            setPassCount(0)
        } catch (e) {
            // Illegal move, ignore
        }
    }

    const resetGame = () => {
        setGameState(createInitialState())
        setGameStatus('playing')
        setWinner(null)
        setPassCount(0)
        setIsBotThinking(false)
        setCountdown(0)
    }

    return (
        <div className="max-w-8xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-tci-dark mb-4">
                    {language === 'de' ? 'Spiele gegen den Bot' : 'Play against the Bot'}
                </h1>
                <p className="text-xl text-gray-600">
                    {language === 'de'
                        ? 'Ein freundliches Übungsspiel für Anfänger. Du spielst Schwarz.'
                        : 'A friendly practice game for beginners. You play Black.'}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {/* Board Area */}
                <div className="flex justify-center">
                    <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                        <BoardSvg
                            size={500}
                            stones={stones}
                            lastMove={gameState.lastMove}
                            onPlace={handlePlayerMove}
                            showCoords
                        />
                    </div>
                </div>

                {/* Controls & Info */}
                <div className="space-y-8">
                    {/* Status Card */}
                    <div className="bg-gradient-to-br from-tci-light to-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-bold text-tci-dark mb-6">
                            {gameStatus === 'finished'
                                ? (language === 'de' ? 'Spiel Vorbei' : 'Game Over')
                                : (language === 'de' ? 'Spielstatus' : 'Game Status')}
                        </h2>

                        <div className="flex items-center justify-between mb-8">
                            <div className={`text - center p - 4 rounded - 2xl w - 32 ${gameState.toPlay === 'B' ? 'bg-black text-white ring-4 ring-green-400' : 'bg-gray-200 text-gray-400'} `}>
                                <div className="font-bold text-lg">{language === 'de' ? 'Du (Schwarz)' : 'You (Black)'}</div>
                                <div className="text-sm mt-1">{language === 'de' ? 'Gefangen' : 'Captured'}: {gameState.captured.B}</div>
                            </div>

                            <div className="text-2xl font-bold text-gray-400">VS</div>

                            <div className={`text - center p - 4 rounded - 2xl w - 32 ${gameState.toPlay === 'W' ? 'bg-white text-black border-2 border-black ring-4 ring-green-400' : 'bg-gray-200 text-gray-400'} `}>
                                <div className="font-bold text-lg">Bot (White)</div>
                                <div className="text-sm mt-1">{language === 'de' ? 'Gefangen' : 'Captured'}: {gameState.captured.W}</div>
                                {isBotThinking && (
                                    <div className="text-sm text-green-600 mt-2 font-bold animate-pulse">
                                        {language === 'de' ? `Denkt nach... ${countdown} s` : `Thinking... ${countdown} s`}
                                    </div>
                                )}
                            </div>
                        </div>

                        {gameStatus === 'playing' && (
                            <div className="space-y-4">
                                <button
                                    onClick={handlePass}
                                    disabled={gameState.toPlay !== 'B' || isBotThinking}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {language === 'de' ? 'Passen' : 'Pass'}
                                </button>
                                <p className="text-sm text-gray-500 text-center">
                                    {language === 'de'
                                        ? 'Passe, wenn du keine sinnvollen Züge mehr siehst.'
                                        : 'Pass if you see no more useful moves.'}
                                </p>
                            </div>
                        )}

                        {gameStatus === 'finished' && (
                            <div className="text-center">
                                <p className="text-lg text-gray-700 mb-6">
                                    {language === 'de'
                                        ? 'Beide Spieler haben gepasst. Das Spiel ist zu Ende.'
                                        : 'Both players passed. The game is ended.'}
                                </p>
                                <button
                                    onClick={resetGame}
                                    className="bg-tci-green hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl"
                                >
                                    {language === 'de' ? 'Neues Spiel' : 'New Game'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                        <h3 className="text-lg font-bold text-blue-800 mb-4">
                            {language === 'de' ? 'Tipps' : 'Tips'}
                        </h3>
                        <ul className="space-y-2 text-blue-700">
                            <li>• {language === 'de' ? 'Versuche, deine Steine zu verbinden.' : 'Try to keep your stones connected.'}</li>
                            <li>• {language === 'de' ? 'Achte auf Atari (nur 1 Freiheit übrig)!' : 'Watch out for Atari (only 1 liberty left)!'}</li>
                            <li>• {language === 'de' ? 'Ecken sind einfacher zu verteidigen als die Mitte.' : 'Corners are easier to defend than the center.'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
