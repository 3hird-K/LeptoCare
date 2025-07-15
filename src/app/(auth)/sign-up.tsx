import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CustomInput from '@/components/CustomInput';
import CustomBtn from '@/components/CustomBtn';
import { useForm } from 'react-hook-form';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';



const signUpSchema = z.object({
  email: z.string({message:"Email is required"}).email("Invalid email"),
  password: z.string({message: "Password is required"}).min(8, "Password must be at least 8 characters long"),
});

type signUpFields = z.infer<typeof signUpSchema>;




export default function SignUpScreen() {

  const {control, handleSubmit, formState:{errors}} = useForm<signUpFields>({
    resolver: zodResolver(signUpSchema),
  })

  console.log(errors)

  const {signUp, isLoaded} = useSignUp();

  const onSignUp = async (data: signUpFields) => {
    if (!isLoaded) return;

    try {

      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

    } catch (error) {
      console.error("Sign Up Error:", error);
      return;
    }

    console.log("Sign Up:", data.email, data.password);
  }



  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
     style={styles.container}>

      <Text style={styles.title}>Create Account</Text>

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
      
      <CustomBtn onPress={handleSubmit(onSignUp)} text='Register Account' />

      <Link href='/sign-in' style={styles.link}>Already have an account? Sign in</Link>
      

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
