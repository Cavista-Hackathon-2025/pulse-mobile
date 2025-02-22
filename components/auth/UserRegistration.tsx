import { View, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Keyboard } from 'react-native';
import React, { useContext } from 'react';
import Modal from 'react-native-modal';
import AppText from '../global/AppText';
import DynamicRegistrationForm from './DynamicRegistrationForm';
import { IAdditionalFields, IUserFields, UserRole } from '@/types';
import { AppStateContext } from '@/contexts/AppStateContext';
import { alertProgressNotSaved } from '@/helpers';
import CloseIcon from '../global/CloseIcon';

interface UserRegistrationProps {
  newUserProfile: Record<string, string> | null;
  userRole: UserRole;
  hideRegistrationModal: () => void;
}

const UserRegistration = ({ newUserProfile, userRole, hideRegistrationModal }: UserRegistrationProps) => {
  console.log('newUserProfile: ', newUserProfile);
  const { setIsLoading } = useContext(AppStateContext);

  const commonInitialValues = {
    firstName: newUserProfile?.firstName || '',
    lastName: newUserProfile?.lastName || '',
    dateOfBirth: { month: null, day: null },
    email: newUserProfile?.email || '',
    phoneNumber: newUserProfile?.phoneNumber || '',
    role: userRole,
  };

  const readonlyFields: Array<keyof IUserFields> = ['email'];

  const getInitialValuesByUserRole = (userRole: UserRole): IAdditionalFields[keyof IAdditionalFields] => {
    
  };

  return (
    <Modal
      avoidKeyboard
      className="justify-end m-0"
      isVisible={!!userRole}
      onBackButtonPress={() => alertProgressNotSaved('Cancel registration?', hideRegistrationModal)}
      onBackdropPress={() => alertProgressNotSaved('Cancel registration?', hideRegistrationModal)}
      // useNativeDriver={true} // This is causing the modal to not animate out at all when it's true
      useNativeDriverForBackdrop={true}
    >
      <View className="flex-1 absolute bottom-0 bg-white dark:bg-black/90 h-[90%] w-[100%] px-7 rounded-tr-[40px] rounded-tl-[40px]">
        <CloseIcon customStyles="top-[22px] right-6" onPress={() => alertProgressNotSaved('Cancel registration?', hideRegistrationModal)} />
        <View className="justify-center mt-6">
          <AppText customStyles="font-rubik text-[25px] leading-8">Let's get to know you better</AppText>
          <AppText customStyles="text-sm text-gray-400">Fields marked with asterisk (*) are required</AppText>
        </View>

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View className="flex-1 border-b-green-pale/20">
            <ScrollView className="flex-1 mt-10" showsVerticalScrollIndicator={false}>
              <DynamicRegistrationForm
                commonInitialValues={commonInitialValues}
                initialValuesByUserRole={getInitialValuesByUserRole(userRole)}
                readonlyFields={readonlyFields}
                userRole={userRole}
              />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

export default UserRegistration;
