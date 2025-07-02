import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function FreelancerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get("jwt")?.value

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!jwt) {
    redirect("/login/admin")
  }

  const res = await fetch(`${backendURL}/api/auth/verify-token`, {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    redirect("/login/admin")
  }

  const user = await res.json()

  if (user.role !== "admin") {
    if (user.role === "freelancer") {
      redirect("/dashboard/freelancer")
    } else if (user.role === "employer") {
      redirect("/dashboard/employer")
    } else {
      redirect("/login")
    }
  }

  return <>{children}</>
}
