import { LoginForm } from "./_components/login-form"

export default function LoginPage() {
  return (
    <main className="relative z-10 flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  )
}
