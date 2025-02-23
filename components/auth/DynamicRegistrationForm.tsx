import React, { FC, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Formik, FieldArray, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';

import {
  IAccount,
  IUserFields,
  IAdditionalFields,
  UserRole,
  User,
  IHospital,
} from '@/types';
import { AppLocalStorage, AppSecureStore } from '@/config';
import { AppStateContext } from '@/contexts/AppStateContext';
import { AppToastContext } from '@/contexts/AppToastContext';

import axiosInstance from '@/lib/axios';

import AppText from '@/components/global/AppText';
import AppTextInput from '@/components/global/AppTextInput';
import AppButton from '@/components/global/AppButton';
import FormGroup from '@/components/global/FormGroup';
import FieldLabel from '@/components/global/FieldLabel';
import AppModalSelector from '@/components/global/AppModalSelector';
import FindAddress from '@/components/FindAddress';

interface DynamicRegistrationFormProps {
  accountToUpdate?: User | null;
  cleanUp?: (newUser: User) => Promise<void> | void;
  commonInitialValues?: IAccount;
  initialValuesByUserRole: IAdditionalFields[UserRole];
  saveResultToLocalStorage?: boolean;
  submitButtonText?: string;
  submitButtonCustomStyles?: string;
  userRole: UserRole;
  formValuesHandler?: (values: IUserFields) => Promise<void> | void;
}

const baseSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  firstName: Yup.string().optional(),
  lastName: Yup.string().optional(),
});

const roleSpecificSchema = {
  [UserRole.HOSPITAL]: Yup.object().shape({
    hospitalName: Yup.string().required('Hospital name is required'),
    // If location is required on signup, you can make it required with a custom check
    // location: Yup.object().required('Location is required'),
    specialties: Yup.string().optional(),
  }),
  [UserRole.MED_TRANSPORT]: Yup.object().shape({
    type: Yup.string().required('Type is required'),
    hospital: Yup.string().optional(), // If private_ambulance chooses a hospital
  }),
  [UserRole.PATIENT]: Yup.object().shape({
    pastHealthSummary: Yup.string().optional(),
    knownAilments: Yup.string().optional(), // comma-separated
  }),
};

const DynamicRegistrationForm: FC<DynamicRegistrationFormProps> = ({
  accountToUpdate,
  cleanUp,
  commonInitialValues,
  initialValuesByUserRole,
  saveResultToLocalStorage = true,
  submitButtonText = 'SUBMIT',
  submitButtonCustomStyles = '',
  userRole,
  formValuesHandler,
}) => {
  const [hospitals, setHospitals] = useState<IHospital[]>([]);
  const router = useRouter();
  const { setIsLoading } = useContext(AppStateContext);
  const { notifyError } = useContext(AppToastContext);

  // If med_transport, fetch hospitals for potential selection
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axiosInstance.get('/api/v1/hospitals');
        setHospitals(res.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    if (userRole === UserRole.MED_TRANSPORT) {
      fetchHospitals();
    }
  }, [userRole]);

  const validationSchema = baseSchema.concat(roleSpecificSchema[userRole] || Yup.object());

  const initialValues: IUserFields = {
    ...commonInitialValues,
    ...initialValuesByUserRole,
  };

  const onSubmit = async (vals: IUserFields, helpers: FormikHelpers<IUserFields>) => {
    try {
      setIsLoading(true);
      if (formValuesHandler) {
        await formValuesHandler(vals);
        setIsLoading(false);
        helpers.setSubmitting(false);
        return;
      }
      let response;
      if (accountToUpdate?.baseProfile?._id) {
        response = await axiosInstance.put(
          /api/v1/accounts/${accountToUpdate.baseProfile._id},
          { baseProfile: vals, profileByRole: {} }
        );
      } else {
        response = await axiosInstance.post('/api/v1/accounts', {
          baseProfile: vals,
          profileByRole: {},
        });
      }
      const newUser = response.data as User;
      if (saveResultToLocalStorage) {
        if (accountToUpdate) {
          await AppLocalStorage.set('user', newUser);
          cleanUp?.(newUser);
        } else {
          const { token, ...userData } = newUser;
          await AppSecureStore.set('token', token);
          await AppLocalStorage.set('user', userData);
          axiosInstance.defaults.headers.common.Authorization = Bearer ${token};
          router.replace('/');
        }
      } else {
        cleanUp?.(newUser);
      }
      setIsLoading(false);
      helpers.setSubmitting(false);
    } catch (error) {
      setIsLoading(false);
      helpers.setSubmitting(false);
      console.error(error);
      notifyError('Error submitting the form. Please try again.');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnBlur
      validateOnChange
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
      }) => (
        <View className="flex-1">
          <FormGroup title="Basic Information">
            <View className="mb-4">
              <FieldLabel label="First Name" />
              <AppTextInput
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName || ''}
                placeholder="First Name"
                customStyles={`mb-2 ${
                  touched.firstName && errors.firstName ? 'border-red-200 bg-red-100' : ''
                }`}
              />
              {touched.firstName && errors.firstName && (
                <AppText customStyles="text-red-500">{errors.firstName}</AppText>
              )}
            </View>

            <View className="mb-4">
              <FieldLabel label="Last Name" />
              <AppTextInput
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName || ''}
                placeholder="Last Name"
                customStyles={`mb-2 ${
                  touched.lastName && errors.lastName ? 'border-red-200 bg-red-100' : ''
                }`}
              />
              {touched.lastName && errors.lastName && (
                <AppText customStyles="text-red-500">{errors.lastName}</AppText>
              )}
            </View>

            <View className="mb-4">
              <FieldLabel label="Email" />
              <AppTextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email || ''}
                placeholder="me@example.com"
                keyboardType="email-address"
                customStyles={`mb-2 ${
                  touched.email && errors.email ? 'border-red-200 bg-red-100' : ''
                }`}
              />
              {touched.email && errors.email && (
                <AppText customStyles="text-red-500">{errors.email}</AppText>
              )}
            </View>
          </FormGroup>

          {userRole === UserRole.HOSPITAL && (
            <FormGroup title="Hospital Details">
              <View className="mb-4">
                <FieldLabel label="Hospital Name" />
                <AppTextInput
                  onChangeText={handleChange('hospitalName')}
                  onBlur={handleBlur('hospitalName')}
                  value={values.hospitalName || ''}
                  placeholder="Hospital Name"
                  customStyles={`mb-2 ${
                    touched.hospitalName && errors.hospitalName
                      ? 'border-red-200 bg-red-100'
                      : ''
                  }`}
                />
                {touched.hospitalName && errors.hospitalName && (
                  <AppText customStyles="text-red-500">{errors.hospitalName}</AppText>
                )}
              </View>

              <View className="mb-4">
                <FieldLabel label="Hospital Location" />
                <FindAddress
                  localStorageKey="hospitalLocation"
                  queryString="components=country:ng"
                  setResult={(addr) => {
                    setFieldValue('location', {
                      formattedAddress: addr.formatted_address,
                      coordinates: addr.geometry.location,
                      placeId: addr.place_id,
                    });
                  }}
                >
                  <AppTextInput
                    value={typeof values.location === 'object' && values.location?.type
                      ? (values.location as any).type.formattedAddress
                      : ''}
                    placeholder="Tap to select hospital address"
                    customStyles={`mb-2 ${
                      touched.location && errors.location ? 'border-red-200 bg-red-100' : ''
                    }`}
                  />
                </FindAddress>
                {touched.location && errors.location && (
                  <AppText customStyles="text-red-500">
                    {typeof errors.location === 'string'
                      ? errors.location
                      : 'Location is required'}
                  </AppText>
                )}
              </View>

              <View className="mb-4">
                <FieldLabel label="Specialties (comma-separated)" />
                <AppTextInput
                  onChangeText={handleChange('specialties')}
                  onBlur={handleBlur('specialties')}
                  value={(values as any).specialties || ''}
                  placeholder="e.g cardiology, neurology"
                  customStyles={`mb-2 ${
                    touched.specialties && errors.specialties
                      ? 'border-red-200 bg-red-100'
                      : ''
                  }`}
                />
                {touched.specialties && errors.specialties && (
                  <AppText customStyles="text-red-500">{errors.specialties as string}</AppText>
                )}
              </View>
            </FormGroup>
          )}

          {userRole === UserRole.MED_TRANSPORT && (
            <FormGroup title="Medical Transport Details">
              <View className="mb-4">
                <FieldLabel label="Type" />
                <AppTextInput
                  onChangeText={handleChange('type')}
                  onBlur={handleBlur('type')}
                  value={(values as any).type || ''}
                  placeholder="e.g private_ambulance"
                  customStyles={`mb-2 ${
                    touched.type && errors.type ? 'border-red-200 bg-red-100' : ''
                  }`}
                />
                {touched.type && errors.type && (
                  <AppText customStyles="text-red-500">{errors.type as string}</AppText>
                )}
              </View>

              {values.type === 'private_ambulance' && (
                <View className="mb-4">
                  <FieldLabel label="Linked Hospital" />
                  <AppModalSelector
                    allowSearch
                    hasError={touched.hospital && !!errors.hospital}
                    keyExtractor="_id"
                    labelExtractor={(item) =>
                      (item as IHospital)?.hospitalName || 'Unknown Hospital'
                    }
                    onSelect={(val) => setFieldValue('hospital', (val as IHospital)._id)}
                    options={hospitals as Record<string, any>[]}
                    selectionTitle="Select Hospital"
                    value={(values as any).hospital || ''}
                  />
                  {touched.hospital && errors.hospital && (
                    <AppText customStyles="text-red-500">{errors.hospital as string}</AppText>
                  )}
                </View>
              )}
            </FormGroup>
          )}

          {userRole === UserRole.PATIENT && (
            <FormGroup title="Patient Details">
              <View className="mb-4">
                <FieldLabel label="Past Health Summary" />
                <AppTextInput
                  multiline
                  numberOfLines={4}
                  onChangeText={handleChange('pastHealthSummary')}
                  onBlur={handleBlur('pastHealthSummary')}
                  value={(values as any).pastHealthSummary || ''}
                  placeholder="Describe relevant history..."
                  customStyles={`mb-2 ${
                    touched.pastHealthSummary && errors.pastHealthSummary
                      ? 'border-red-200 bg-red-100'
                      : ''
                  }`}
                />
                {touched.pastHealthSummary && errors.pastHealthSummary && (
                  <AppText customStyles="text-red-500">
                    {errors.pastHealthSummary as string}
                  </AppText>
                )}
              </View>

              <View className="mb-4">
                <FieldLabel label="Known Ailments (comma-separated)" />
                <AppTextInput
                  multiline
                  numberOfLines={2}
                  onChangeText={handleChange('knownAilments')}
                  onBlur={handleBlur('knownAilments')}
                  value={(values as any).knownAilments || ''}
                  placeholder="e.g hypertension, anemia"
                  customStyles={`mb-2 ${
                    touched.knownAilments && errors.knownAilments
                      ? 'border-red-200 bg-red-100'
                      : ''
                  }`}
                />
                {touched.knownAilments && errors.knownAilments && (
                  <AppText customStyles="text-red-500">
                    {errors.knownAilments as string}
                  </AppText>
                )}
              </View>
            </FormGroup>
          )}

          <AppButton
            buttonText={submitButtonText}
            customStyles={submitButtonCustomStyles}
            disabled={isSubmitting}
            isLoading={isSubmitting}
            onPress={handleSubmit}
          />
        </View>
      )}
    </Formik>
  );
};

export default DynamicRegistrationForm;