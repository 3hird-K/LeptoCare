import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Slot } from "expo-router";

export default function ProtectedLayout(){

    const {isAuthenticated} = useAuth();
    
    if(!isAuthenticated){
        return <Redirect href='/sign-up ' />;

    }

    return <Slot />;
}