import { Outlet } from "react-router-dom"
import { MainNav } from "./main-nav"

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

