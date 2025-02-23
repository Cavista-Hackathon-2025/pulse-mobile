import { TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import AppText from './AppText';
import { Octicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import Colors from '@/constants/Colors';

interface FieldLabelProps {
  isRequired?: boolean;
  hasLearnMore?: boolean;
  helpText?: string;
  helpIconCustomStyles?: string;
  iconBesideLabel?: boolean;
  label: string;
  labelCustomStyles?: string;
  showIsRequired?: boolean;
}

const FieldLabel = ({
  isRequired = true,
  helpText,
  helpIconCustomStyles,
  iconBesideLabel = false,
  label,
  labelCustomStyles,
  showIsRequired = true,
}: FieldLabelProps) => {
  const { colorScheme } = useColorScheme();
  const [isShowingTooltip, setIsShowingTooltip] = useState(false);
  const { width } = Dimensions.get('window');

  return (
    <View className="mb-1 ml-[2px]">
      <View className={`flex-row ${iconBesideLabel ? '' : 'justify-between mr-1'} items-center`}>
        <View className={`flex-row ${iconBesideLabel ? 'mr-1' : ''}`}>
          {showIsRequired && isRequired && <AppText customStyles="text-red-400 mt-[3px]">* </AppText>}
          <AppText customStyles={labelCustomStyles}>
            {label}{' '}
            {showIsRequired && !isRequired && (
              <AppText className="text-gray-400">
                <AppText customStyles="text-green-pale/50 dark:text-green-pale/50">(optional)</AppText>
              </AppText>
            )}
          </AppText>
        </View>

        {helpText && (
          <Tooltip
            contentStyle={{
              minHeight: 48,
              width: width * 0.9,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            childContentSpacing={-2}
            isVisible={isShowingTooltip}
            content={
              <TouchableOpacity onPress={() => setIsShowingTooltip(false)} activeOpacity={0.6}>
                <AppText>{helpText}</AppText>
              </TouchableOpacity>
            }
            placement="bottom"
            onClose={() => setIsShowingTooltip(false)}
            disableShadow
          >
            <View className={`mb-[5px] ${helpIconCustomStyles ? helpIconCustomStyles : ''}`}>
              <TouchableOpacity onPress={() => setIsShowingTooltip(true)}>
                <Octicons name="question" size={16} className="" color={colorScheme === 'light' ? Colors.light.secondary : Colors.dark.secondary} />
              </TouchableOpacity>
            </View>
          </Tooltip>
        )}
      </View>
    </View>
  );
};

export default FieldLabel;
