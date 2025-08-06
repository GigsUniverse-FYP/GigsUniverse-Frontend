import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import ClientLayoutWrapper from "./client-layout-wrapper"

export default async function FreelancerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get("jwt")?.value
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!jwt) {
    redirect("/login/freelancer")
  }

  const res = await fetch(`${backendURL}/api/auth/verify-token`, {
    headers: {
      cookie: `jwt=${jwt}`, // send JWT manually
    },
    credentials: "include",
    cache: "no-store",
  })

  console.log("Backend returned status:", res.status)

  if (res.status === 403) {
    const banned = await res.json()
    const reason = banned.reason || "No reason provided"
    const unbanDate = banned.unbanDate || ""
    redirect(
      `/dashboard/banned/freelancer?reason=${encodeURIComponent(reason)}&unbanDate=${encodeURIComponent(unbanDate)}`
    )
  }

  if (res.status === 404) {
    redirect("/login/freelancer")
  }

  if (!res.ok) {
    redirect("/login/freelancer")
  }

  const user = await res.json()

  if (user.role !== "freelancer") {
    if (user.role === "employer") {
      redirect("/dashboard/employer")
    } else if (user.role === "admin") {
      redirect("/dashboard/admin")
    } else {
      redirect("/login/freelancer") 
    }
  }

  return <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
}
