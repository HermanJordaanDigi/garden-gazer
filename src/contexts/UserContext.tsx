import { createContext, useContext, ReactNode, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

// Default user for demo purposes - replace with actual auth integration
const DEFAULT_USER: User = {
  id: "1",
  name: "Sarah",
  email: "sarah@example.com",
};

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [isLoading] = useState(false);

  return (
    <UserContext.Provider value={{ user, isLoading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
