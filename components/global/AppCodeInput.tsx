import { View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import AppTextInput from './AppTextInput';

interface AppCodeInputProps {
  autoFocus?: boolean;
  customStyles?: string;
  errorMessage: string;
  code: string[];
  setCode: Dispatch<SetStateAction<string[]>>;
}

const AppCodeInput = ({ autoFocus = true, customStyles, errorMessage, code, setCode }: AppCodeInputProps) => {
  const refs = useRef<TextInput[]>([]);

  useEffect(() => {
    autoFocus && refs.current[0]?.focus();
  }, []);

  const findNearestFilledInput = (index: number) => {
    let nearestFilledIndex = -1;
    for (let i = index - 1; i >= 0; i--) {
      if (code[i]) {
        nearestFilledIndex = i;
        break;
      }
    }
    return nearestFilledIndex;
  };

  const focusInput = (index: number) => {
    const nearestFilledIndex = findNearestFilledInput(index);
    refs.current[nearestFilledIndex + 1]?.focus();
  };

  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      refs.current[index + 1].focus();
    } else if (!value && index > 0) {
      refs.current[index - 1].focus();
    }
  };

  const handlePaste = (pastedText: string) => {
    const digits = pastedText.slice(0, length).split('');
    const newCode = [...code];
    digits.forEach((digit, i) => {
      if (i < length) {
        newCode[i] = digit;
      }
    });
    setCode(newCode);

    // Focus on the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex((digit) => !digit);
    if (nextEmptyIndex !== -1) {
      refs.current[nextEmptyIndex]?.focus();
    } else {
      refs.current[length - 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row gap-x-1 justify-between items-center">
      {code.map((digit, index) => (
        <AppTextInput
          customStyles={`text-center h-14 w-12 pt-1 text-lg ${customStyles ? customStyles : ''} ${errorMessage ? 'bg-red-100/70 dark:bg-red-200/50 border-red-100/70 dark:border-red-200/10 border-r-red-200 dark:border-r-red-200/30 border-b-red-200 dark:border-b-red-200/30' : ''}`}
          key={index}
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(value) => handleCodeChange(index, value)}
          ref={(ref: TextInput) => {
            if (ref) {
              refs.current[index] = ref;
            }
          }}
          onKeyPress={(e) => handleKeyPress(index, e)}
          onFocus={() => focusInput(index)} // Prevent user from moving to the next input field if the previous one(s) is/are empty
          value={digit}
        />
      ))}
    </View>
  );
};

export default AppCodeInput;
