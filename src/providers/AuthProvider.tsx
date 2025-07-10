import { createContext, PropsWithChildren, useContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}: PropsWithChildren) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const signIn = () => {
        setIsAuthenticated(true);
    }

    const signOut = () => {
        setIsAuthenticated(false);
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    )
};


export const useAuth = () => useContext(AuthContext);