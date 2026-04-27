// Auth hook - stub for local development
// In production, this uses Manus OAuth

export function useAuth() {
  return {
    user: {
      id: "local-user",
      name: "本地用户",
      email: "dev@localhost",
      role: "admin",
    },
    isAuthenticated: true,
    isLoading: false,
    login: () => {},
    logout: () => {},
  }
}
