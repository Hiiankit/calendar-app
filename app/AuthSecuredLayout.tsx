"use client"

import { signIn, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"

export const AuthSecuredLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { status } = useSession()

  if (status === "loading") return <h1>Loading</h1>

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col space-y-3 items-center justify-center h-[100vh]">
        <h1 className="font-extrabold text-3xl text-blue-700">
          Login With Google
        </h1>
        <Button className="size-40 bg-blue-700" onClick={() => signIn()}>
          Login
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
