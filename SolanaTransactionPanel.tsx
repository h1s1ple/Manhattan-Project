'use client'

import { useEffect, useState } from 'react'
import { TerminalWindow } from './TerminalWindow'
import { StatusIndicator } from './StatusIndicator'
import { ProgressBar } from './ProgressBar'

interface SolanaStatus {
  nodeConnection: 'connected' | 'disconnected' | 'syncing'
  blockHeight: number
  pendingTransactions: number
  verifiedTransactions: number
  encodingProgress: number
  lastTransactionHash: string
  networkHealth: number
  slotHeight: number
}

interface Transaction {
  id: string
  type: 'TRANSFER' | 'STAKE' | 'VOTE' | 'PROGRAM_CALL'
  status: 'PENDING' | 'ENCODING' | 'VERIFIED' | 'FAILED'
  amount?: number
  timestamp: string
}

export function SolanaTransactionPanel(): JSX.Element {
  const [solanaStatus, setSolanaStatus] = useState<SolanaStatus>({
    nodeConnection: 'connected',
    blockHeight: 287459832,
    pendingTransactions: 5,
    verifiedTransactions: 142,
    encodingProgress: 0,
    lastTransactionHash: '3Kf7x9...8Bm2Qw',
    networkHealth: 87,
    slotHeight: 287459834
  })

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TX001',
      type: 'TRANSFER',
      status: 'VERIFIED',
      amount: 2.5,
      timestamp: '23:14:15'
    },
    {
      id: 'TX002',
      type: 'STAKE',
      status: 'ENCODING',
      amount: 10.0,
      timestamp: '23:14:18'
    },
    {
      id: 'TX003',
      type: 'VOTE',
      status: 'PENDING',
      timestamp: '23:14:22'
    }
  ])

  const [verificationLog, setVerificationLog] = useState<string[]>([
    '> SOLANA NODE CONNECTED',
    '> BLOCK HEIGHT: 287459832',
    '> SIGNATURE VERIFICATION: OK',
    '> TRANSACTION POOL: READY'
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setSolanaStatus(prev => ({
        ...prev,
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 3),
        slotHeight: prev.slotHeight + Math.floor(Math.random() * 5),
        networkHealth: Math.max(60, Math.min(100, prev.networkHealth + (Math.random() - 0.5) * 10)),
        encodingProgress: prev.encodingProgress >= 100 ? 0 : prev.encodingProgress + Math.random() * 15
      }))

      // Simulate transaction status changes
      setTransactions(prevTxs => {
        return prevTxs.map(tx => {
          if (tx.status === 'ENCODING' && Math.random() < 0.3) {
            return { ...tx, status: 'VERIFIED' as const }
          }
          if (tx.status === 'PENDING' && Math.random() < 0.2) {
            return { ...tx, status: 'ENCODING' as const }
          }
          return tx
        })
      })

      // Add new transactions occasionally
      if (Math.random() < 0.1) {
        const newTx: Transaction = {
          id: `TX${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          type: ['TRANSFER', 'STAKE', 'VOTE', 'PROGRAM_CALL'][Math.floor(Math.random() * 4)] as Transaction['type'],
          status: 'PENDING',
          amount: Math.random() < 0.7 ? Math.random() * 100 : undefined,
          timestamp: new Date().toLocaleTimeString().slice(0, 8)
        }
        
        setTransactions(prev => [...prev.slice(-4), newTx])
      }

      // Update verification log
      if (Math.random() < 0.2) {
        const logMessages = [
          `> BLOCK #${solanaStatus.blockHeight} VERIFIED`,
          `> TRANSACTION ENCODED: ${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          `> NETWORK HEALTH: ${solanaStatus.networkHealth.toFixed(1)}%`,
          `> SIGNATURE VALIDATION: PASSED`,
          `> SLOT HEIGHT: ${solanaStatus.slotHeight}`,
          `> PENDING TX COUNT: ${solanaStatus.pendingTransactions}`
        ]
        
        setVerificationLog(prev => {
          const newLog = [...prev, logMessages[Math.floor(Math.random() * logMessages.length)]]
          return newLog.slice(-6)
        })
      }
    }, 1500)

            return () => clearInterval(interval)
  }, [solanaStatus.blockHeight, solanaStatus.networkHealth, solanaStatus.pendingTransactions, solanaStatus.slotHeight])

  const getNetworkStatus = (): 'online' | 'warning' | 'error' => {
    if (solanaStatus.networkHealth > 80) return 'online'
    if (solanaStatus.networkHealth > 50) return 'warning'
    return 'error'
  }

  const getTransactionStatusColor = (status: string): string => {
    switch (status) {
      case 'VERIFIED': return 'text-green-400'
      case 'ENCODING': return 'text-blue-400'
      case 'PENDING': return 'text-amber-400'
      case 'FAILED': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <TerminalWindow title="SOLANA TRANSACTION MONITOR" height="h-96" glowColor="blue">
      <div className="space-y-4">
        {/* Network Status */}
        <div className="space-y-2">
          <StatusIndicator 
            status={getNetworkStatus()} 
            label={`SOLANA NODE [${solanaStatus.nodeConnection.toUpperCase()}]`} 
          />
          <StatusIndicator 
            status="online" 
            label={`BLOCK HEIGHT: ${solanaStatus.blockHeight.toLocaleString()}`} 
          />
        </div>

        {/* Network Health */}
        <ProgressBar
          label="NETWORK HEALTH"
          value={solanaStatus.networkHealth}
          max={100}
          unit="%"
          color={solanaStatus.networkHealth > 80 ? 'blue' : solanaStatus.networkHealth > 50 ? 'amber' : 'red'}
        />

        {/* Encoding Progress */}
        {solanaStatus.encodingProgress > 0 && (
          <ProgressBar
            label="TRANSACTION ENCODING"
            value={solanaStatus.encodingProgress}
            max={100}
            unit="%"
            color="green"
            />
        )}

        {/* Transaction Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-blue-300">PENDING</div>
            <div className="text-blue-400 font-bold">{transactions.filter(tx => tx.status === 'PENDING').length}</div>
          </div>
          <div>
            <div className="text-blue-300">VERIFIED</div>
            <div className="text-blue-400 font-bold">{transactions.filter(tx => tx.status === 'VERIFIED').length}</div>
          </div>
          <div>
            <div className="text-blue-300">SLOT</div>
            <div className="text-blue-400 font-bold">{solanaStatus.slotHeight.toLocaleString()}</div>
          </div>
        </div>

        {/* Transaction Queue */}
        <div className="border-t border-blue-800 pt-2">
          <div className="text-blue-300 text-xs mb-2">TRANSACTION QUEUE:</div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {transactions.slice(-5).map((tx, index) => (
              <div key={index} className="text-xs font-mono flex justify-between">
                <span className="text-blue-400">
                  {tx.id} [{tx.type}]
                </span>
                <span className={getTransactionStatusColor(tx.status)}>
                  {tx.status} {tx.amount ? `${tx.amount.toFixed(2)} SOL` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Log */}
        <div className="border-t border-blue-800 pt-2">
          <div className="text-blue-300 text-xs mb-2">VERIFICATION LOG:</div>
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {verificationLog.map((log, index) => (
              <div key={index} className="text-blue-400 text-xs font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TerminalWindow>
  )
}
