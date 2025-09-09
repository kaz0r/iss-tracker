"use client"
import { IssMap } from "./components/iss-map"

export default function Home() {

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex-col items-center justify-center relative isolate">
      <IssMap />
    </main>
  )
}
