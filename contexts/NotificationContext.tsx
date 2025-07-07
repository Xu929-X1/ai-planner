"use client";

import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/alert";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
type NotificationType = "success" | "error" | "info" | "warning";

type Notification = {
    id: string;
    type: NotificationType;
    message: string;
};

type NotificationContextType = {
    showNotification: (message: string, type: NotificationType) => void;
};

const NotificationContext = createContext<NotificationContextType>({
    showNotification: () => { },
});

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [expanded, setExpanded] = useState(false);

    function showNotification(message: string, type: NotificationType) {
        const id = uuidv4();
        const newNotification = { id, message, type };
        setNotifications(prev => [...prev, newNotification]);

        setTimeout(() => {
            removeNotification(id);
        }, 3000);
    }

    function removeNotification(id: string) {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }

    const MAX_VISIBLE = 3;
    const visibleNotifications = expanded ? notifications : notifications.slice(-MAX_VISIBLE);
    const hiddenCount = notifications.length - visibleNotifications.length;

    function generateAlertTitle(type: NotificationType) {
        switch (type) {
            case "error":
                return (<>
                    <ErrorOutlineIcon color="error" fontSize="small" className="mr-1" />
                    <AlertTitle>
                        Error
                    </AlertTitle>
                </>
                );
            case "info":
                return (<>
                    <InfoOutlineIcon color="info" fontSize="small" className="mr-1" />
                    <AlertTitle>
                        Info
                    </AlertTitle>
                </>
                );
            case "success":
                return (
                    <>
                        <CheckCircleOutlineIcon color="success" fontSize="small" className="mr-1" />
                        <AlertTitle>
                            Success
                        </AlertTitle>
                    </>
                );
            case "warning":
                return (<>
                    <WarningAmberIcon color="warning" fontSize="small" className="mr-1" />
                    <AlertTitle>
                        Warning
                    </AlertTitle>
                </>
                );
        }
    }

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div
                className="fixed top-12 right-5 z-50 w-80 flex flex-col gap-2 transition-all duration-300"
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
            >
                {visibleNotifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`
              transition-all duration-300 transform
              bg-white shadow-lg rounded p-0 overflow-hidden
            `}
                    >
                        <Alert>
                            <button
                                onClick={() => removeNotification(notification.id)}
                                className="absolute top-0 right-0 m-2 text-gray-400 hover:text-gray-600 transition"
                            >
                                <ClearIcon fontSize="small" />
                            </button>
                            {generateAlertTitle(notification.type)}
                            <AlertDescription className="w-full">{notification.message}</AlertDescription>
                        </Alert>
                    </div>
                ))}
                {hiddenCount > 0 && !expanded && (
                    <div className="text-sm text-gray-500 text-center">+{hiddenCount} more</div>
                )}
            </div>
        </NotificationContext.Provider>
    );
}
