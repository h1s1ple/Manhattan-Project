'use client'

import { useEffect, useState } from 'react'
import { TerminalWindow } from './TerminalWindow'
import { StatusIndicator } from './StatusIndicator'
import { ProgressBar } from './ProgressBar'

interface RFStatus {
  signalStrength: number
  frequency: number
  transmissionQueue: number
  encodingStatus: 'idle' | 'encoding' | 'transmitting' | 'complete'
  lastTransmission: string
  packetsTransmitted: number
  packetsReceived: number
}

export function RFCommunicationPanel(): JSX.Element {
  const [rfStatus, setRfStatus] = useState<RFStatus>({
    signalStrength: 75,
    frequency: 14.230,
    transmissionQueue: 3,
    encodingStatus: 'idle',
    lastTransmission: '23:14:22',
    packetsTransmitted: 127,
    packetsReceived: 89
  })

const [transmissionLog, setTransmissionLog] = useState<string[]>([
    '> RF ENCODER INITIALIZED',
    '> SHORTWAVE ANTENNA ALIGNED',
    '> FREQUENCY LOCK: 14.230 MHz',
    '> AWAITING TRANSMISSION...'
  ])

useEffect(() => {
    const interval = setInterval(() => {
      setRfStatus(prev => {
        const newStatus = { ...prev }
        
        // Simulate signal strength fluctuation
        newStatus.signalStrength = Math.max(10, Math.min(100, 
          prev.signalStrength + (Math.random() - 0.5) * 10
        ))
        
        // Simulate frequency drift
        newStatus.frequency = 14.230 + (Math.random() - 0.5) * 0.01
        
        // Simulate transmission states
        if (Math.random() < 0.1) {
          const states: Array<'idle' | 'encoding' | 'transmitting' | 'complete'> = 
            ['idle', 'encoding', 'transmitting', 'complete']
          newStatus.encodingStatus = states[Math.floor(Math.random() * states.length)]
          
          if (newStatus.encodingStatus === 'complete') {
            newStatus.packetsTransmitted += 1
            newStatus.transmissionQueue = Math.max(0, newStatus.transmissionQueue - 1)
            newStatus.lastTransmission = new Date().toLocaleTimeString().slice(0, 8)
          }
        }
        
        // Add new transmission queue items
        if (Math.random() < 0.05) {
          newStatus.transmissionQueue = Math.min(10, newStatus.transmissionQueue + 1)
        }
        
        // Simulate packet reception
        if (Math.random() < 0.08) {
          newStatus.packetsReceived += 1
        }
        
        return newStatus
      })

      // Add transmission log entries
      if (Math.random() < 0.15) {
        const logMessages = [
          `> TX PACKET #${rfStatus.packetsTransmitted + 1} ENCODED`,
          `> SIGNAL STRENGTH: ${rfStatus.signalStrength.toFixed(1)}%`,
          `> FREQUENCY DRIFT: ${(rfStatus.frequency - 14.230).toFixed(4)} MHz`,
          `> RX PACKET VERIFIED`,
          `> ANTENNA ALIGNMENT: OK`,
          `> TRANSMISSION BUFFER: READY`
        ]
        
        setTransmissionLog(prev => {
          const newLog = [...prev, logMessages[Math.floor(Math.random() * logMessages.length)]]
          return newLog.slice(-8) // Keep only last 8 entries
        })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [rfStatus.packetsTransmitted, rfStatus.signalStrength, rfStatus.frequency])

  const getStatusIndicator = (): 'online' | 'offline' | 'warning' | 'error' | 'transmitting' => {
    if (rfStatus.encodingStatus === 'transmitting') return 'transmitting'
    if (rfStatus.signalStrength > 60) return 'online'
    if (rfStatus.signalStrength > 30) return 'warning'
    return 'error'
  }

return (
    <TerminalWindow title="RF COMMUNICATION ARRAY" height="h-80" glowColor="green">
      <div className="space-y-4">
        {/* Status Indicators */}
        <div className="space-y-2">
          <StatusIndicator 
            status={getStatusIndicator()} 
            label={`RF TRANSCEIVER [${rfStatus.frequency.toFixed(3)} MHz]`} 
          />
          <StatusIndicator 
            status={rfStatus.encodingStatus === 'encoding' ? 'transmitting' : 'online'} 
            label={`ENCODER: ${rfStatus.encodingStatus.toUpperCase()}`} 
          />
        </div>

{/* Signal Strength */}
        <ProgressBar
          label="SIGNAL STRENGTH"
          value={rfStatus.signalStrength}
          max={100}
          unit="%"
          color={rfStatus.signalStrength > 60 ? 'green' : rfStatus.signalStrength > 30 ? 'amber' : 'red'}
        />

        {/* Transmission Stats */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-green-300">TX PACKETS</div>
            <div className="text-green-400 font-bold">{rfStatus.packetsTransmitted}</div>
          </div>
          <div>
            <div className="text-green-300">RX PACKETS</div>
            <div className="text-green-400 font-bold">{rfStatus.packetsReceived}</div>
          </div>
          <div>
<div className="text-green-300">QUEUE</div>
            <div className="text-green-400 font-bold">{rfStatus.transmissionQueue}</div>
          </div>
          <div>
            <div className="text-green-300">LAST TX</div>
            <div className="text-green-400 font-bold">{rfStatus.lastTransmission}</div>
          </div>
        </div>

        {/* Transmission Log */}
        <div className="border-t border-green-800 pt-2">
          <div className="text-green-300 text-xs mb-2">TRANSMISSION LOG:</div>
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {transmissionLog.map((log, index) => (
              <div key={index} className="text-green-400 text-xs font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TerminalWindow>
  )
}
