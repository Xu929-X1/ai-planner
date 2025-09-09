export const endpoints = {
    auth: {
        register: {
            post: "/api/auth/register"
        },
        login: {
            post: "/api/auth/login"
        },
        logout: {
            post: "/api/auth/logout"
        },
        google: {
            callback: {
                post: "/api/auth/google/callback"
            }
        }
    },
    user: {
        self: {
            get: "/api/me"
        },
        getAllPlans: {
            get: (userId: number) => `/api/user/${userId}/plans`
        }
    },
    plan: {
        getAll: {
            get: "/api/plan"
        },
        create: {
            post: "/api/plan"
        },
        delete: {
            delete: (planId: number) => `/api/plan/${planId}`
        },
        update: {
            put: (planId: number) => `/api/plan/${planId}`
        },
        aiGenerate: {
            post: "/api/plan/ai"
        }
    },
    chat: {
        allChat: {
            get: "/api/chat"
        },
        chat: {
            get: '/api/chat',
            delete: (conversationId: number)=>`/api/chat/${conversationId}`
        }
    }
}