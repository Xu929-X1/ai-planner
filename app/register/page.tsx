'use client'
import { Button } from '@/components/UI/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/UI/card'
import React, { useActionState } from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import PasswordInput from '@/components/PasswordInput';
import { Input } from '@/components/UI/input';
import { endpoints } from '../api/route-helper';
import axios from 'axios';

type State = {
    error?: string
}

async function handleRegister(prevState: State, formData: FormData): Promise<State> {
    try {
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirm-password");
        if (!email || !password || !confirmPassword) {
            return { error: 'Email, password, and confirm password are required' };
        }

        if (password !== confirmPassword) {
            return { error: 'Passwords do not match' };
        }

        const response = await axios.post(endpoints.auth.register.post, {
            body: JSON.stringify({
                email,
                password
            })
        });

        if (response.status === 200) {
            return {};
        } else {
            return { error: 'Registration failed, please try again.' };
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return { error: error.response.data?.error || 'Registration failed' };
        }
        return { error: 'An unexpected error occurred' };
    }
}

export default function Register() {
    const [state, formAction] = useActionState(handleRegister, {});
    return (
        <div className='text-left flex h-screen items-center justify-center bg-gray-100 w-screen'>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Sign Up</h2>
                    <p className="text-sm text-gray-600">Create a new account</p>
                </CardHeader>
                <form action={formAction}>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    name='email'
                                    placeholder="Please enter your email"
                                    required
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                <PasswordInput
                                    id="password"
                                    name='password'
                                    placeholder="Please enter your password"
                                    required
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                                <PasswordInput
                                    id="confirm-password"
                                    name='confirm-password'
                                    placeholder="Please confirm your password"
                                    required
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {state.error && (
                            <div className="mt-4 text-red-600">
                                {state.error}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 mt-4">
                        <Button
                            type="submit"
                            className="w-full px-4 py-2  text-white rounded-md focus:outline-none focus:ring-2"
                        >
                            Sign Up
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            className='w-full'
                        >
                            <GoogleIcon />Login with Google
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div >
    )
}
