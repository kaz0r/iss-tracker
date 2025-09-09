import { cn } from "@/lib/utils"
import { RecentPost } from "./components/post"
import { Map } from "./components/map"

export default async function Home() {
  return (
    <main className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex-col items-center justify-center relative isolate">
      <Map />
    </main>
  )
}
