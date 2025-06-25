'use client'

import { useEffect, useState } from 'react'
import { TerminalWindow } from './TerminalWindow'
import { StatusIndicator } from './StatusIndicator'
import { ProgressBar } from './ProgressBar'

interface PowerStatus {
  handCrankOutput: number
  solarPanelOutput: number
  batteryLevel: number
  totalPowerGeneration: number
  powerConsumption: number
  estimatedRuntime: number
  isHandCranking: boolean
  solarEfficiency: number
  batteryHealth: number
}

export function PowerGenerationPanel(): JSX.Element {
  const [powerStatus, setPowerStatus] = useState<PowerStatus>({
    handCrankOutput: 0,
    solarPanelOutput: 45,
    batteryLevel: 78,
    totalPowerGeneration: 45,
    powerConsumption: 32,
    estimatedRuntime: 24.5,
    isHandCranking: false,
    solarEfficiency: 67,
    batteryHealth: 89
  })

  const [powerLog, setPowerLog] = useState<string[]>([
    '> POWER SYSTEMS ONLINE',
    '> SOLAR PANELS: 45W',
    '> BATTERY BANK: 78%',
    '> POWER RESERVE: NOMINAL'
  ])

useEffect(() => {
    const interval = setInterval(() => {
      setPowerStatus(prev => {
        const newStatus = { ...prev }
        
        // Simulate solar panel output variation (weather/clouds)
        newStatus.solarPanelOutput = Math.max(0, Math.min(80, 
          45 + (Math.random() - 0.5) * 15
        ))
        
        // Solar efficiency based on output
        newStatus.solarEfficiency = Math.max(40, Math.min(100, 
          (newStatus.solarPanelOutput / 80) * 100 + (Math.random() - 0.5) * 10
        ))
        
        // Simulate hand crank usage (random bursts)
        if (Math.random() < 0.1) {
          newStatus.isHandCranking = !newStatus.isHandCranking
        }
        
        newStatus.handCrankOutput = newStatus.isHandCranking 
          ? Math.random() * 25 + 15  // 15-40W when cranking
          : 0
        
        // Calculate total generation
        newStatus.totalPowerGeneration = newStatus.handCrankOutput + newStatus.solarPanelOutput

        // Simulate power consumption fluctuation
        newStatus.powerConsumption = Math.max(25, Math.min(45, 
          32 + (Math.random() - 0.5) * 8
        ))
        
        // Battery level changes based on power balance
        const powerBalance = newStatus.totalPowerGeneration - newStatus.powerConsumption
        newStatus.batteryLevel = Math.max(0, Math.min(100, 
          newStatus.batteryLevel + (powerBalance / 100) * 0.5
        ))
        
        // Battery health degrades very slowly
        if (Math.random() < 0.01) {
          newStatus.batteryHealth = Math.max(60, newStatus.batteryHealth - 0.1)
        }
        
        // Calculate estimated runtime
        if (powerBalance < 0) {
          const hoursRemaining = (newStatus.batteryLevel / 100) * 48 // 48 hours max at full battery
          newStatus.estimatedRuntime = Math.max(0, hoursRemaining)
        } else {
          newStatus.estimatedRuntime = Math.min(48, newStatus.estimatedRuntime + 0.1)
        }
        
        return newStatus
      })

      // Update power log
      if (Math.random() < 0.2) {
        const logMessages = [
          `> SOLAR OUTPUT: ${powerStatus.solarPanelOutput.toFixed(1)}W`,
          `> BATTERY LEVEL: ${powerStatus.batteryLevel.toFixed(1)}%`,
          `> POWER CONSUMPTION: ${powerStatus.powerConsumption.toFixed(1)}W`,
          powerStatus.isHandCranking ? `> HAND CRANK ACTIVE: ${powerStatus.handCrankOutput.toFixed(1)}W` : '> HAND CRANK IDLE',
          `> BATTERY HEALTH: ${powerStatus.batteryHealth.toFixed(1)}%`,
          `> ESTIMATED RUNTIME: ${powerStatus.estimatedRuntime.toFixed(1)}H`
        ]
        
        setPowerLog(prev => {
          const newLog = [...prev, logMessages[Math.floor(Math.random() * logMessages.length)]]
          return newLog.slice(-6)
        })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [powerStatus])

  const getPowerStatus = (): 'online' | 'warning' | 'error' => {
    if (powerStatus.batteryLevel > 60) return 'online'
    if (powerStatus.batteryLevel > 30) return 'warning'
    return 'error'
  }

  const getBatteryColor = (): 'green' | 'amber' | 'red' => {
    if (powerStatus.batteryLevel > 60) return 'green'
    if (powerStatus.batteryLevel > 30) return 'amber'
    return 'red'
  }

return (
    <TerminalWindow title="POWER GENERATION HUB" height="h-80" glowColor="amber">
      <div className="space-y-4">
        {/* Power Status Indicators */}
        <div className="space-y-2">
          <StatusIndicator 
            status={getPowerStatus()} 
            label={`POWER GRID [${powerStatus.totalPowerGeneration.toFixed(1)}W GEN]`} 
          />
          <StatusIndicator 
            status={powerStatus.isHandCranking ? 'transmitting' : 'online'} 
            label={`HAND CRANK [${powerStatus.handCrankOutput.toFixed(1)}W]`} 
          />
          <StatusIndicator 
            status="online" 
            label={`SOLAR ARRAY [${powerStatus.solarPanelOutput.toFixed(1)}W]`} 
          />
        </div>

        {/* Battery Level */}
        <ProgressBar
          label="BATTERY BANK"
          value={powerStatus.batteryLevel}
          max={100}
          unit="%"
          color={getBatteryColor()}
          showPercentage={true}
        />

        {/* Solar Efficiency */}
        <ProgressBar
          label="SOLAR EFFICIENCY"
          value={powerStatus.solarEfficiency}
          max={100}
          unit="%"
          color="amber"
          showPercentage={true}
        />

        {/* Power Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-amber-300">GENERATION</div>
            <div className="text-amber-400 font-bold">{powerStatus.totalPowerGeneration.toFixed(1)}W</div>
          </div>
          <div>
            <div className="text-amber-300">CONSUMPTION</div>
            <div className="text-amber-400 font-bold">{powerStatus.powerConsumption.toFixed(1)}W</div>
          </div>
          <div>
            <div className="text-amber-300">RUNTIME</div>
            <div className="text-amber-400 font-bold">{powerStatus.estimatedRuntime.toFixed(1)}H</div>
          </div>
          <div>
            <div className="text-amber-300">BAT HEALTH</div>
            <div className="text-amber-400 font-bold">{powerStatus.batteryHealth.toFixed(1)}%</div>
          </div>
        </div>

        {/* Power Balance Indicator */}
        <div className="border-t border-amber-800 pt-2">
          <div className="text-amber-300 text-xs mb-1">POWER BALANCE:</div>
          <div className="flex items-center space-x-2">
            <div className={`text-xs font-mono ${
              powerStatus.totalPowerGeneration > powerStatus.powerConsumption 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {powerStatus.totalPowerGeneration > powerStatus.powerConsumption ? '+' : ''}
              {(powerStatus.totalPowerGeneration - powerStatus.powerConsumption).toFixed(1)}W
            </div>
            <div className="text-amber-500 text-xs">
              {powerStatus.totalPowerGeneration > powerStatus.powerConsumption ? 'CHARGING' : 'DISCHARGING'}
            </div>
          </div>
        </div>

        {/* Power Log */}
        <div className="border-t border-amber-800 pt-2">
          <div className="text-amber-300 text-xs mb-2">POWER LOG:</div>
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {powerLog.map((log, index) => (
              <div key={index} className="text-amber-400 text-xs font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TerminalWindow>
  )
}
