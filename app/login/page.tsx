'use client'
import { Button } from '@/components/UI/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/UI/card'
import { Input } from '@/components/UI/input'
import { Label } from '@/components/UI/label'
import { useRouter } from 'next/navigation'
import React, { useActionState, useContext, useEffect } from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';
import { endpoints } from '../api/route-helper'
import PasswordInput from '@/components/PasswordInput'
import Link from 'next/link'
import { UserContext } from '@/contexts/userContext'
import { useNotification } from '@/contexts/NotificationContext'

type State = {
  error?: string
}


export default function Login() {
  const notificationContext = useNotification();
  const [state, formAction] = useActionState(handleLogin, {})
  const router = useRouter();
  const userContextInstance = useContext(UserContext)

  useEffect(() => {
    if (userContextInstance.user) {
      router.push("/dashboard");
    }
  }, [userContextInstance.user])

  function handleSignUp() {
    router.push('/register');
  }
  async function handleLogin(prevState: State, formData: FormData): Promise<State> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    try {
      const res = await axios.post(endpoints.auth.login.post, {
        email,
        password
      });
      const status = res.status;
      if (status === 200) {
        router.push("/dashboard");
        userContextInstance.getUserInfo();
        return {};
      } else {
        return { error: 'Login failed, please check your credentials.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error) && error.response) {
        notificationContext.showNotification(`Login Error: ${error.response.data.error}`, "error");
        return { error: error.response.data.error || 'Login failed' };
      } else {
        notificationContext.showNotification(`Login Error: An unexpected error occurred`, "error");
      }
      return { error: 'An unexpected error occurred' };
    }
  }

  function handleLoginWithGoogle() {
    // Logic for Google login 
  }

  return (
    <div className="text-left flex h-screen items-center justify-center w-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button className='text-accent-foreground' variant="link" onClick={handleSignUp}>Sign Up</Button>
          </CardAction>
        </CardHeader>
        <form action={formAction}>
          <CardContent className='mb-8'>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <PasswordInput id="password" name='password' required />
              </div>
            </div>

            {state?.error && (
              <div className="mt-4 text-red-600">
                {state.error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 ">
            <Button type="submit" className="w-full" >
              Login
            </Button>
            <Button  className="w-full" onClick={handleLoginWithGoogle}>
              <div className="flex items-center">
                <GoogleIcon className="transition-opacity duration-300 hover:opacity-100" />
                <span className="ml-2">Login with Google</span>
              </div>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div >
  )
}
