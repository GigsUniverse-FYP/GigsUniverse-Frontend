import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import EmployerLayoutWrapper from "./employer-layout-wrapper"

export default async function FreelancerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get("jwt")?.value

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!jwt) {
    redirect("/login/employer")
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
    redirect(`/dashboard/banned/employer?reason=${encodeURIComponent(reason)}&unbanDate=${encodeURIComponent(unbanDate)}`)
  }

  if (res.status === 404) {
    redirect("/login/employer")
  }

  if (!res.ok) {
    redirect("/login/employer")
  }

  const user = await res.json()

  if (user.role !== "employer") {
    if (user.role === "freelancer") {
      redirect("/dashboard/freelancer")
    } else if (user.role === "admin") {
      redirect("/dashboard/admin")
    } else {
      redirect("/login/employer")
    }
  }


  return <EmployerLayoutWrapper>{children}</EmployerLayoutWrapper>
  
}
