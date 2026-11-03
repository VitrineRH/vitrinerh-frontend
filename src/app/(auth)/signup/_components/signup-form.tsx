"use client"

import { useActionState } from "react"
import { cn } from "cn"
import { signup } from "@/app/(auth)/actions"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, action, pending] = useActionState(signup, {})

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crie sua conta!</CardTitle>
          <CardDescription>
            Entre com seu email e crie sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                <Input id="name" name="name" type="text" placeholder="John Doe" defaultValue={state.name} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={state.email}
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input id="password" name="password" type="password" minLength={8} required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirme sua senha
                    </FieldLabel>
                    <Input id="confirm-password" name="confirm-password" type="password" minLength={8} required />
                  </Field>
                </Field>
                <FieldDescription>
                  Coloque pelo menos 8 caracteres
                </FieldDescription>
              </Field>
              {state.error && (
                <p role="alert" className="text-sm text-destructive text-center">
                  {state.error}
                </p>
              )}
              {state.message && (
                <p role="status" className="text-sm text-center">
                  {state.message}
                </p>
              )}
              <Field>
                <Button type="submit" disabled={pending}>
                  {pending ? "Criando..." : "Crie sua conta"}
                </Button>
                <FieldDescription className="text-center">
                  Já tem uma conta? <a href="/auth" className="text-blue-500"> Faça login. </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Clicando você aceita todos os termos de condições <a href="#">Termos de condição </a>.
      </FieldDescription>
    </div>
  )
}
