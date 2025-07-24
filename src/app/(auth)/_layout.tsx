import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout(){

    const {isSignedIn} = useAuth();

    if(isSignedIn){
        return <Redirect href='/home'/>;
    }

    return (
         <Stack>
            <Stack.Screen name="sign-in" options={{headerShown: false, title:""}} />
            <Stack.Screen name="sign-up" options={{title:"", headerShown: false}} />
            <Stack.Screen name="verify" options={{title:"", headerShown: true}} />
        </Stack>
    );
}