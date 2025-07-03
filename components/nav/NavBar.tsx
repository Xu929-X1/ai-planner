'use client'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/UI/navigation-menu"

import React from 'react'
import { Button } from "../UI/button"
import { pathHelper } from "@/app/pathHelper";
import { useRouter } from "next/navigation";

export default function NavBar() {
    const router = useRouter();
    return (
        <div className="w-full h-auto absolute top-0 left-0 z-50 pt-4 px-4 border-b-2 border-gray-200 bg-white shadow-sm">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <NavigationMenu className="w-full">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink href="/">Dashboard</NavigationMenuLink>
                                    <NavigationMenuLink href="/tasks">Tasks</NavigationMenuLink>
                                    <NavigationMenuLink href="/settings">Settings</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/about">About</NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="flex items-center space-x-4">
                        <Button onClick={() => router.push(pathHelper.register)}>Sign up</Button>
                        <Button onClick={() => router.push(pathHelper.login)}>Login</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
