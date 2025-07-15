import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CustomInput from '@/components/CustomInput';
import CustomBtn from '@/components/CustomBtn';
import { useForm } from 'react-hook-form';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';



const signInSchema = z.object({
  email: z.string({message:"Email is required"}).email("Invalid email"),
  password: z.string({message: "Password is required"}).min(8, "Password must be at least 8 characters long"),
});

type signInFields = z.infer<typeof signInSchema>;




export default function SignInScreen() {

  const {signIn, isLoaded, setActive } = useSignIn();

  const {control, handleSubmit, formState:{errors}} = useForm<signInFields>({
    resolver: zodResolver(signInSchema),
  })

  console.log(errors)



  const onSignIn = async (data: signInFields) => {

    if(!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if(signInAttempt.status === "complete"){
        // console.log("Sign In Successful");
        setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.log("Sign In Failed");
      }

      
    } catch (error) {
      console.error("Sign In Error:", error);
      return;
    }

    console.log("Sign In:", data.email, data.password);
  }



  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
     style={styles.container}>

      <Text style={styles.title}>Login Account</Text>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name='email'
          placeholder='Email'
          autoFocus
          keyboardType='email-address'
          autoComplete='email'
        />
        <CustomInput control={control} name='password' placeholder='Password' secureTextEntry/>
      </View>
      
      <CustomBtn onPress={handleSubmit(onSignIn)} text='Login' />
  
      <Link href='/sign-up' style={styles.link}>Dont have an account? Sign up</Link>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  form:{
    gap: 10
  },
  link:{
    color: '#4353Fd',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  }
});
