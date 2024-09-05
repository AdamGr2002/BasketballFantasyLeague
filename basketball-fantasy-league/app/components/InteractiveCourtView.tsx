/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Trophy, TrendingUp, Users } from 'lucide-react'

// Mock player data with extended stats and performance score
const players = [
  { id: '1', name: "LeBron James", position: "SF", x: 70, y: 30, stats: { points: 27.1, rebounds: 7.5, assists: 7.3, steals: 1.2, blocks: 0.6 }, performanceScore: 95, trend: 'up', salary: 37500000 },
  { id: '2', name: "Stephen Curry", position: "PG", x: 20, y: 20, stats: { points: 32.0, rebounds: 5.5, assists: 5.8, steals: 1.3, blocks: 0.1 }, performanceScore: 98, trend: 'up', salary: 40000000 },
  { id: '3', name: "Giannis Antetokounmpo", position: "PF", x: 70, y: 70, stats: { points: 29.9, rebounds: 11.6, assists: 5.8, steals: 1.0, blocks: 1.4 }, performanceScore: 97, trend: 'stable', salary: 39000000 },
  { id: '4', name: "Nikola Jokic", position: "C", x: 50, y: 60, stats: { points: 26.4, rebounds: 10.8, assists: 8.3, steals: 1.3, blocks: 0.7 }, performanceScore: 96, trend: 'up', salary: 41000000 },
  { id: '5', name: "James Harden", position: "SG", x: 20, y: 80, stats: { points: 24.6, rebounds: 7.1, assists: 10.8, steals: 1.2, blocks: 0.8 }, performanceScore: 92, trend: 'down', salary: 38000000 },
  { id: '6', name: "Luka Doncic", position: "PG", x: 30, y: 30, stats: { points: 28.4, rebounds: 9.1, assists: 8.7, steals: 1.1, blocks: 0.5 }, performanceScore: 94, trend: 'up', salary: 35000000 },
  { id: '7', name: "Kevin Durant", position: "SF", x: 80, y: 40, stats: { points: 29.9, rebounds: 7.4, assists: 6.4, steals: 0.7, blocks: 1.5 }, performanceScore: 93, trend: 'stable', salary: 42000000 },
]

const getPerformanceColor = (score: number) => {
  if (score >= 95) return 'border-green-500'
  if (score >= 90) return 'border-blue-500'
  if (score >= 85) return 'border-yellow-500'
  return 'border-red-500'
}

const getPerformanceSize = (score: number) => {
  if (score >= 95) return 'h-14 w-14'
  if (score >= 90) return 'h-12 w-12'
  if (score >= 85) return 'h-10 w-10'
  return 'h-8 w-8'
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-green-500" />
    case 'down':
      return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />
    default:
      return <TrendingUp className="w-4 h-4 text-yellow-500 transform rotate-90" />
  }
}

function DashboardStats({ courtPlayers }: { courtPlayers: Player[] }) {
  const totalSalary = courtPlayers.reduce((sum, player) => sum + player.salary, 0)
  const averagePerformance = courtPlayers.reduce((sum, player) => sum + player.performanceScore, 0) / courtPlayers.length

  const teamStats = ['points', 'rebounds', 'assists', 'steals', 'blocks'].map(stat => ({
    name: stat.charAt(0).toUpperCase() + stat.slice(1),
    value: courtPlayers.reduce((sum, player) => sum + player.stats[stat], 0) / courtPlayers.length
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Salary</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(totalSalary / 1000000).toFixed(2)}M</div>
          <p className="text-xs text-muted-foreground">For {courtPlayers.length} players</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averagePerformance.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Out of 100</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Stats</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={teamStats}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis hide />
              <Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default function InteractiveCourtView() {
  const [courtPlayers, setCourtPlayers] = useState(players.slice(0, 5))
  const [benchPlayers, setBenchPlayers] = useState(players.slice(5))

  const onDragEnd = (result: { source: any; destination: any }) => {
    const { source, destination } = result
    if (!destination) return

     const sourceList = source.droppableId === 'court' ? courtPlayers : benchPlayers
    const destList = destination.droppableId === 'court' ? courtPlayers : benchPlayers

    const [reorderedItem] = sourceList.splice(source.index, 1)
    destList.splice(destination.index, 0, reorderedItem)

    if (source.droppableId === 'court') {
      setCourtPlayers([...sourceList])
      setBenchPlayers([...destList])
    } else {
      setBenchPlayers([...sourceList])
      setCourtPlayers([...destList])
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Interactive Court View</h2>
      <DashboardStats courtPlayers={courtPlayers} />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="relative aspect-[94/50] mb-4">
              {/* Basketball Court SVG */}
              <svg viewBox="0 0 94 50" className="w-full h-full">
                <rect x="0" y="0" width="94" height="50" fill="#FF9F1C" stroke="#000000" strokeWidth="0.5"/>
                <rect x="0" y="0" width="94" height="50" fill="none" stroke="#FFFFFF" strokeWidth="0.5"/>
                <circle cx="47" cy="25" r="6" fill="none" stroke="#FFFFFF" strokeWidth="0.5"/>
                <path d="M 5.25,0 A 23.75 25 0 0 1 5.25,50" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
                <path d="M 88.75,0 A 23.75 25 0 0 0 88.75,50" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
                <line x1="5.25" y1="0" x2="5.25" y2="50" stroke="#FFFFFF" strokeWidth="0.5" />
                <line x1="88.75" y1="0" x2="88.75" y2="50" stroke="#FFFFFF" strokeWidth="0.5" />
                <circle cx="16.75" cy="25" r="6" fill="none" stroke="#FFFFFF" strokeWidth="0.5"/>
                <circle cx="77.25" cy="25" r="6" fill="none" stroke="#FFFFFF" strokeWidth="0.5"/>
                <line x1="4" y1="17.5" x2="4" y2="32.5" stroke="#FFFFFF" strokeWidth="0.5" />
                <line x1="90" y1="17.5" x2="90" y2="32.5" stroke="#FFFFFF" strokeWidth="0.5" />
                <circle cx="1.25" cy="25" r="0.75" fill="#FFFFFF" />
                <circle cx="92.75" cy="25" r="0.75" fill="#FFFFFF" />
              </svg>

              {/* Player Avatars */}
              <Droppable droppableId="court">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="absolute inset-0"
                  >
                    <AnimatePresence>
                      {courtPlayers.map((player, index) => (
                        <Draggable key={player.id} draggableId={player.id} index={index}>
                          {(provided) => (
                            <motion.div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              className="absolute transform -translate-x-1/2 -translate-y-1/2"
                              style={{ left: `${player.x}%`, top: `${player.y}%`, ...provided.draggableProps.style }}
                            >
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Avatar className={`border-4 ${getPerformanceColor(player.performanceScore)} ${getPerformanceSize(player.performanceScore)}`}>
                                      <AvatarImage src={`/placeholder.svg?height=56&width=56`} alt={player.name} />
                                      <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="font-bold">{player.name} - {player.position}</p>
                                    <p>Points: {player.stats.points}</p>
                                    <p>Rebounds: {player.stats.rebounds}</p>
                                    <p>Assists: {player.stats.assists}</p>
                                    <p>Steals: {player.stats.steals}</p>
                                    <p>Blocks: {player.stats.blocks}</p>
                                    <p>Performance: {player.performanceScore}</p>
                                    <p>Salary: ${(player.salary / 1000000).toFixed(2)}M</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-1 text-xs text-center font-semibold bg-white bg-opacity-75 rounded px-1"
                              >
                                {player.name}
                              </motion.div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </div>

        <Card className="w-full md:w-64">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Bench</h3>
            <Droppable droppableId="bench">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  <AnimatePresence>
                    {benchPlayers.map((player, index) => (
                      <Draggable key={player.id} draggableId={player.id} index={index}>
                        {(provided) => (
                          <motion.div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center gap-2 bg-secondary p-2 rounded"
                          >
                            <Avatar className={`border-2 ${getPerformanceColor(player.performanceScore)} h-8 w-8`}>
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={player.name} />
                              <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-semibold">{player.name}</div>
                              <div className="text-xs text-muted-foreground">{player.position}</div>
                            </div>
                            {getTrendIcon(player.trend)}
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}