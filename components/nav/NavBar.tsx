'use client'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/UI/navigation-menu"

import React, { useContext } from 'react'
import { Button } from "../UI/button"
import { pathHelper } from "@/app/pathHelper";
import { redirect, useRouter } from "next/navigation";
import { UserContext } from "@/contexts/userContext";
import axios from "axios";
import { endpoints } from "@/app/api/route-helper";
import { useNotification } from "@/contexts/NotificationContext";

export default function NavBar() {
    const router = useRouter();
    const { user, getUserInfo } = useContext(UserContext);
    const notification = useNotification();
    async function logout() {
        await axios.get(endpoints.auth.logout.get);
        getUserInfo();
        notification.showNotification("Log out successfully", "success")
        redirect("/");
    }

    return (
        <div className="w-full h-auto absolute top-0 left-0 z-50 pt-4 px-4 border-b-2 border-gray-200 bg-white shadow-sm">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <NavigationMenu className="w-full">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink href="/dashboard">Dashboard</NavigationMenuLink>
                                    <NavigationMenuLink href="/calendar">Calendar</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            {
                                user ? <></> :
                                    <>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink href="/about">About</NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
                                        </NavigationMenuItem>
                                    </>
                            }

                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="flex items-center space-x-4">
                        {
                            user ?
                                <NavigationMenu className="w-full">
                                    <NavigationMenuList>
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger>{user.email}</NavigationMenuTrigger>
                                            <NavigationMenuContent className="w-full">
                                                <NavigationMenuLink href="/settings">Settings</NavigationMenuLink>
                                                <NavigationMenuLink onClick={logout}>Log out</NavigationMenuLink>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>

                                    </NavigationMenuList>
                                </NavigationMenu>
                                :
                                <>
                                    <Button onClick={() => router.push(pathHelper.register)}>Sign up</Button>
                                    <Button onClick={() => router.push(pathHelper.login)}>Login</Button>
                                </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
