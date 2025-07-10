import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CustomInput from '@/components/CustomInput';
import CustomBtn from '@/components/CustomBtn';
import { useForm } from 'react-hook-form';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';



const signInSchema = z.object({
  email: z.string({message:"Email is required"}).email("Invalid email"),
  password: z.string({message: "Password is required"}).min(8, "Password must be at least 8 characters long"),
});

type signInFields = z.infer<typeof signInSchema>;




export default function SignInScreen() {

  const {control, handleSubmit, formState:{errors}} = useForm<signInFields>({
    resolver: zodResolver(signInSchema),
  })

  console.log(errors)

  const { signIn } = useAuth()

  const onSignIn = (data: signInFields) => {
    console.log("Sign In:", data.email, data.password);
    signIn();
    // router.replace('/'); // Redirect to home after sign-in
  }



  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
     style={styles.container}>

      <Text style={styles.title}>Create an Account</Text>

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
      
      <CustomBtn onPress={handleSubmit(onSignIn)} text='Sign in' />
  
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
