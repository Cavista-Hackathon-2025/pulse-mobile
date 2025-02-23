import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

interface FormGroupProps {
  children: React.ReactNode;
  disabled?: boolean;
  fieldHasError: boolean;
  title: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ disabled, children, fieldHasError, title }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View className={`flex-1 mb-4`}>
      {!disabled && (
        <TouchableOpacity
          className={`h-[50px] flex-row justify-between items-center px-4 rounded-md border ${fieldHasError ? 'border-red-500 dark:border-red-600' : isOpen ? 'border-green-dark' : 'border-green-pale/20'}`}
          onPress={toggleOpen}
          activeOpacity={0.6}
        >
          <AppText className="">{title}</AppText>
          <Ionicons name={`${isOpen || fieldHasError ? 'chevron-down-outline' : 'chevron-forward-outline'}`} size={24} />
        </TouchableOpacity>
      )}
      {(isOpen || fieldHasError) && <View className={`${!disabled ? 'mt-6' : ''}`}>{children}</View>}
    </View>
  );
};

export default FormGroup;
