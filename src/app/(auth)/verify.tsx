import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CustomInput from '@/components/CustomInput';
import CustomBtn from '@/components/CustomBtn';
import { useForm } from 'react-hook-form';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';



const verifySchema = z.object({
  code: z.string({message:"Code is required"}).length(6, "Invalid code"),
});

type verifyFields = z.infer<typeof verifySchema>;




export default function SignUpScreen() {

  const {control, handleSubmit, formState:{errors}} = useForm<verifyFields>({
    resolver: zodResolver(verifySchema),
  })

  console.log(errors)

  const {signUp, isLoaded} = useSignUp();

  const onVerify = async ({code}: verifyFields) => {
    
    if(!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if(signUpAttempt.status === "complete"){
        console.log("Verification Successful");
        router.replace('/sign-in'); // Redirect to sign-in after verification
      }else{
        console.log("Verification Failed");
        console.log(signUpAttempt);
      }
    } catch (error) {
      console.error("Verification Error:", error);
      return;
      
    }

  }



  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
     style={styles.container}>

      <Text style={styles.title}>Verify your email</Text>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name='code'
          placeholder='123456'
          autoFocus
          keyboardType='number-pad'
          autoComplete='one-time-code'
        />
      </View>
      
      <CustomBtn onPress={handleSubmit(onVerify)} text='Verify' />
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
