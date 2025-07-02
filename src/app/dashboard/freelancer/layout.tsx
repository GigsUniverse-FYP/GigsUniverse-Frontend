import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function FreelancerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get("jwt")?.value

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!jwt) {
    redirect("/login/freelancer")
  }

  const res = await fetch(`${backendURL}/api/auth/verify-token`, {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
    cache: "no-store",
  })

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
      redirect("/login")
    }
  }

  return <>{children}</>
}
