import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    login as apiLogin,
    logout as apiLogout,
    me,
    type UserInfo,
    type AuthSession,
} from "../api/auth";

interface AuthContextValue {
    user: UserInfo | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    // al montar la app, preguntamos al backend si hay sesion
    useEffect(() => {
        const init = async () => {
            try {
                const u = await me();
                setUser(u);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        void init();
    }, []);

    const login = async (username: string, password: string) => {
        const session: AuthSession = await apiLogin(username, password);

        // intentamos traer el user completo
        try {
            const u = await me();
            setUser(u);
        } catch {
            // fallback con lo que devuelve la sesion
            setUser({
                id: session.userId,
                username: session.userName,
                profileId: session.profileId,
            });
        }
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
