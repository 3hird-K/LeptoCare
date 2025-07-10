import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout(){

    const {isAuthenticated} = useAuth();

    if(isAuthenticated){
        return <Redirect href='/' />;
    }

    return  <Stack>
                <Stack.Screen name="sign-in" options={{headerShown: false, title:"Sign-In"}} />
                <Stack.Screen name="sign-up" options={{title:"Sign-Up"}} />
            </Stack>
        ;
}