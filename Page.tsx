'use client'

import React, { useState, useEffect } from 'react'
import { SolanaProvider } from '../components/SolanaProvider'
import { SolanaTransactionPanel } from '../components/SolanaTransactionPanel'
import { RFCommunicationPanel } from '../components/RFCommunicationPanel'
import { PowerGenerationPanel } from '../components/PowerGenerationPanel'
import { EmergencyBroadcastPanel } from '../components/EmergencyBroadcastPanel'
import { VDFMiningPanel } from '../components/VDFMiningPanel'
import { SystemStatusPanel } from '../components/SystemStatusPanel'
import { WalletTutorial } from '../components/WalletTutorial'

export default function BunkTerminal(): JSX.Element {
  const [showTutorial, setShowTutorial] = useState<boolean>(false)

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('bunk-tutorial-seen')
    if (!hasSeenTutorial) {
      setShowTutorial(true)
    }
  }, [])

  const handleTutorialComplete = (): void => {
    localStorage.setItem('bunk-tutorial-seen', 'true')
    setShowTutorial(false)
  }

  return (
    <SolanaProvider>
      <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
        {/* CRT Effect */}
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent animate-pulse" 
               style={{ 
                 backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)',
                 animation: 'flicker 0.15s infinite linear alternate'
               }} />
        </div>

        {/* Main Interface */}
        <div className="relative z-10 p-4">
          {/* Header */}
<div className="text-center mb-6 relative">
            <div className="border-2 border-green-500 p-4 bg-black/80 shadow-lg shadow-green-500/20">
              <h1 className="text-4xl font-bold text-green-400 mb-2 tracking-wider">
                ██████╗ ██╗   ██╗███╗   ██╗██╗  ██╗
              </h1>
              <h1 className="text-4xl font-bold text-green-400 mb-2 tracking-wider">
                ██╔══██╗██║   ██║████╗  ██║██║ ██╔╝
              </h1>
              <h1 className="text-4xl font-bold text-green-400 mb-2 tracking-wider">
                ██████╔╝██║   ██║██╔██╗ ██║█████╔╝ 
              </h1>
              <h1 className="text-4xl font-bold text-green-400 mb-2 tracking-wider">
                ██╔══██╗██║   ██║██║╚██╗██║██╔═██╗ 
              </h1>
              <h1 className="text-4xl font-bold text-green-400 mb-4 tracking-wider">
                ██████╔╝╚██████╔╝██║ ╚████║██║  ██╗
              </h1>
              <h1 className="text-4xl font-bold text-green-400 mb-4 tracking-wider">
                ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝
              </h1>
              <p className="text-lg text-green-300 mb-2">OFF-GRID CRYPTO TRANSMISSION SYSTEM</p>
              <p className="text-sm text-green-500 mb-4">SOLANA RF BROADCAST ARRAY - MESH NETWORK PROTOCOL</p>
              <div className="flex justify-center space-x-4 text-xs">
                <span className="text-green-400">STATUS: OPERATIONAL</span>
                <span className="text-green-400">FREQ: 14.230 MHz</span>
                <span className="text-green-400">PWR: ACTIVE</span>
              </div>
              <button
                onClick={() => setShowTutorial(true)}
                className="absolute top-4 right-4 bg-green-900 text-green-400 px-3 py-1 text-xs border border-green-500 hover:bg-green-800 transition-colors"
              >
                HELP
              </button>
            </div>
          </div>

          {/* Terminal Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <SolanaTransactionPanel />
            <RFCommunicationPanel />
            <PowerGenerationPanel />
            <EmergencyBroadcastPanel />
            <VDFMiningPanel />
            <SystemStatusPanel />
          </div>
        </div>

        {/* Tutorial Modal */}
        {showTutorial && (
          <WalletTutorial onComplete={handleTutorialComplete} />
        )}

        <style jsx>{`
          @keyframes flicker {
            0% { opacity: 1; }
            100% { opacity: 0.98; }
          }
        `}</style>
      </div>
    </SolanaProvider>
  )
}
