export const endpoints = {
    auth: {
        register: {
            post: "/api/auth/register"
        },
        login: {
            post: "/api/auth/login"
        },
    },
    user: {
        self: {
            get: "/api/me"
        }
    }
}