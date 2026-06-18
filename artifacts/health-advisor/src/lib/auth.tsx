import React, { createContext, useContext } from "react";
import { useGetCurrentUser, getGetCurrentUserQueryKey } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useGetCurrentUser({
    query: {
      queryKey: getGetCurrentUserQueryKey(),
      retry: false,
      // Don't refetch on window focus — this causes a 401 console spam
      // every time the user switches tabs when they're not logged in.
      // Auth state is refreshed on page load and after login/logout via
      // queryClient.invalidateQueries().
      refetchOnWindowFocus: false,
      // Treat the session as fresh for 5 minutes — avoids redundant
      // background refetches while the user is actively browsing.
      staleTime: 5 * 60 * 1000,
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated: !!user && !isError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
