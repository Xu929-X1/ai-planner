export const endpoints = {
    auth: {
        register: {
            post: "/api/auth/register"
        },
        login: {
            post: "/api/auth/login"
        },
        logout: {
            get: "/api/auth/logout"
        }
    },
    user: {
        self: {
            get: "/api/me"
        }
    }
}