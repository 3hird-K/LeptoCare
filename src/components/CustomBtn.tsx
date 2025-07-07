import { Pressable, PressableProps, Text, StyleSheet } from "react-native";

type CustomBtnProps = {
    text: string;
} &  PressableProps;


export default function CustomBtn({text, ...props}: CustomBtnProps) {
    return (
        <Pressable {...props} style={[styles.button]} >
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
        button:{
            // backgroundColor: '#0a1282',
            backgroundColor: '#4353Fd',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            cursor: 'pointer',
            paddingBlock: 12,
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
        }
});