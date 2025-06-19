import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import React from "react"

const SuperAdminPage = () => {
  return (
    <div>
      Welcome to SuperAdminPage
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
        className="mt-4"
      >
        <Button
          variant={"outline"}
          size={"lg"}
          className="w-full"
          type="submit"
        >
          Sign out
        </Button>
      </form>
    </div>
  )
}

export default SuperAdminPage
