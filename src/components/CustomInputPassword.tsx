import { Controller, Control, FieldValues, Path } from "react-hook-form";
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type CustomInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rightElement?: React.ReactNode;
} & TextInputProps;

export default function CustomInput<T extends FieldValues>({
  control,
  name,
  rightElement,
  secureTextEntry,
  ...props
}: CustomInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = typeof secureTextEntry !== "undefined";

  return (
    <Controller
      rules={{ required: "This field is required" }}
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={styles.container}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              {...props}
              secureTextEntry={isPasswordField && !showPassword}
              style={[styles.input, props.style, error ? { borderColor: "crimson" } : {}]}
              placeholderTextColor={"#a1a1a1"}
            />
            {isPasswordField ? (
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.icon}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={18}
                  color="#888"
                />
              </Pressable>
            ) : rightElement ? (
              <View style={styles.icon}>{rightElement}</View>
            ) : null}
          </View>

          <Text style={styles.error}>{error?.message}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#a1a1a1",
    borderRadius: 25,
    paddingHorizontal: 10,
    outlineColor: '#a1a1a1',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    outlineColor: '#a1a1a1',
  },
  icon: {
    paddingHorizontal: 6,
  },
  error: {
    color: "crimson",
  },
});
