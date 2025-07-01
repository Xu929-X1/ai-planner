'use client'
import { Button } from '@/components/UI/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/UI/card'
import { Input } from '@/components/UI/input'
import { Label } from '@/components/UI/label'
import { redirect } from 'next/navigation'
import React, { useActionState, useState } from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';
import { endpoints } from '../api/route-helper'
import PasswordInput from '@/components/PasswordInput'
import Link from 'next/link'

type LoginFormData = {
  email: string;
  password: string;
}
type State = {
  error?: string
}


async function handleLogin(prevState: State, formData: FormData): Promise<State> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  try {
    const res = await axios.post(endpoints.auth.login, {
      body: JSON.stringify({
        email,
        password
      })
    });
    const status = res.status;
    if (status === 200) {
      redirect('/dashboard');
    } else {
      return { error: 'Login failed, please check your credentials.' };
    }
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error) && error.response) {
      return { error: error.response.data.error || 'Login failed' };
    }
    return { error: 'An unexpected error occurred' };
  }
}

export default function Login() {
  const [state, formAction, isPending] = useActionState(handleLogin, {})

  function handleSignUp() {
    redirect('/register');
  }


  function handleLoginWithGoogle() {
    // Logic for Google login 
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={handleSignUp}>Sign Up</Button>
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
          </CardContent>
          <CardFooter className="flex flex-col gap-2 ">
            <Button type="submit" className="w-full" >
              Login
            </Button>
            <Button variant="outline" className="w-full" onClick={handleLoginWithGoogle}>
              <div className="flex items-center">
                <GoogleIcon className="transition-opacity duration-300 hover:opacity-70" />
                <span className="ml-2">Login with Google</span>
              </div>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div >
  )
}
