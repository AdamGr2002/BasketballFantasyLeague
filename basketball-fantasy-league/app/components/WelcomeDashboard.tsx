import React from 'react'
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Trophy, TrendingUp, Users, Activity } from 'lucide-react'
import Link from 'next/link'

export function WelcomeDashboard({ user }) {
  const team = useQuery(api.myFunctions.getTeam, { userId: user.id });
  const addPlayer = useMutation(api.myFunctions.addPlayerToTeam);

  if (!team) return <div>Loading team data...</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {user.firstName}!</CardTitle>
          <CardDescription>Here's an overview of your fantasy basketball league</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="text-muted-foreground">Team: {team.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.totalPoints}</div>
            <p className="text-xs text-muted-foreground">+20% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">League Rank</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.rank}th</div>
            <p className="text-xs text-muted-foreground">Out of 12 teams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$92.5M</div>
            <p className="text-xs text-muted-foreground">+2.5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.players.length}/10</div>
            <p className="text-xs text-muted-foreground">{10 - team.players.length} slots available</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {team.players.map((player) => (
              <div key={player._id} className="flex justify-between items-center">
                <div>{player.name} - {player.position}</div>
                <div className="text-muted-foreground">
                  {player.stats.points} pts, {player.stats.rebounds} reb, {player.stats.assists} ast
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-24">Offense</span>
              <Progress value={75} className="flex-1" />
              <span className="w-12 text-right">75%</span>
            </div>
            <div className="flex items-center">
              <span className="w-24">Defense</span>
              <Progress value={60} className="flex-1" />
              <span className="w-12 text-right">60%</span>
            </div>
            <div className="flex items-center">
              <span className="w-24">Teamwork</span>
              <Progress value={85} className="flex-1" />
              <span className="w-12 text-right">85%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button onClick={() => addPlayer({ teamId: team._id, playerName: "New Player", position: "PG" })}>
          Add Player
        </Button>
        <Button asChild>
          <Link href="/league-standings">League Standings</Link>
        </Button>
      </div>
    </div>
  )
}