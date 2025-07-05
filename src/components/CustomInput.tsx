import { TextInput, TextInputProps, StyleSheet } from "react-native";

type CustomInputProps = {
    // custom fields
} & TextInputProps;

export default function CustomInput(props: CustomInputProps){
    return (
        <TextInput
            {...props}
            style={[styles.input, props.style]}
            placeholderTextColor={'#a1a1a1'}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#a1a1a1',
        padding: 10,
        borderRadius: 5,
    },
});

