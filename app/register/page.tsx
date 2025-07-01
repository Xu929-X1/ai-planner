'use client'
import { Button } from '@/components/UI/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/UI/card'
import React from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import PasswordInput from '@/components/PasswordInput';
import { Input } from '@/components/UI/input';
export default function Register() {
    return (
        <div className='flex h-screen items-center justify-center bg-gray-100'>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Sign Up</h2>
                    <p className="text-sm text-gray-600">Create a new account</p>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Please enter your email"
                                    required
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                <PasswordInput
                                    id="password"
                                    placeholder="Please enter your password"
                                    required
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                                <PasswordInput
                                    id="confirm-password"
                                    placeholder="Please confirm your password"
                                    required
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </form>
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
            </Card>
        </div>
    )
}
