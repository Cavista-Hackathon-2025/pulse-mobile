import { View, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import AppText from './AppText';
import AppTextInput from './AppTextInput';
import { capitalizeString } from '@/utils';
import CloseIcon from './CloseIcon';

interface AppModalSelectorProps {
  hasError?: boolean;
  isDisabled?: boolean;
  keyExtractor?: string;
  selectionTitle: string;
  onHide?: () => void;
  options: string[] | Record<string, string | Record<string, unknown> | Array<unknown>>[];
  value?: string;
  onSelect: (value: string | Record<string, string | Record<string, unknown> | Array<unknown>>) => void | Promise<void>;
  useTextInput?: boolean;
}

const AppModalSelector = ({
  hasError,
  isDisabled,
  keyExtractor,
  selectionTitle,
  onHide,
  options,
  value,
  onSelect,
  useTextInput = true,
}: AppModalSelectorProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const closeModal = () => {
    setIsVisible(false);
    onHide && onHide();
  };

  const handleSelection = async (option: string | Record<string, string>) => {
    setIsVisible(false);
    await onSelect(option);
    onHide && onHide();
  };

  const handleFocus = () => !isDisabled && setIsVisible(true);

  const renderItem = useCallback(({ item }: { item: string | Record<string, string> }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={async () => {
          await handleSelection(item);
        }}
        className={`py-3`}
      >
        <AppText>{keyExtractor ? capitalizeString((item as Record<string, string>)[keyExtractor]) : capitalizeString(item as string)}</AppText>
      </TouchableOpacity>
    );
  }, []);

  useEffect(() => {
    !useTextInput && setIsVisible(true);
  }, [options]);

  return (
      <>
          {useTextInput && (
              <AppTextInput
                  asSelect={true}
                  placeholder="Select"
                  customStyles={`${
                      hasError
                          ? "bg-red-100/70 dark:bg-red-200/50 border-red-100/70 dark:border-red-200/10 border-r-red-200 dark:border-r-red-200/30 border-b-red-200 dark:border-b-red-200/30"
                          : ""
                  }`}
                  value={value && capitalizeString(value)}
                  onPress={handleFocus}
              />
          )}
          <Modal
              animationOutTiming={600}
              avoidKeyboard
              className="justify-end m-0"
              isVisible={isVisible}
              onBackdropPress={() => closeModal()}
              onBackButtonPress={() => closeModal()}
              useNativeDriver={true}
              useNativeDriverForBackdrop={true}
          >
              <TouchableWithoutFeedback
              >
                  <View
                      className={`flex-1 max-h-[90%] absolute bg-gray-100 border-2 dark:bg-gray-100 border-gray-200/30 w-[100%] px-7 rounded-tr-[20px] rounded-tl-[20px]`}
                  >
                      <CloseIcon
                          customStyles="top-3 right-6"
                          onPress={() => closeModal()}
                      />

                      <View className="flex-row items-end justify-between mt-4 space-x-10">
                          <AppText customStyles="font-rubik text-center text-xl">
                              {selectionTitle}
                          </AppText>
                      </View>

                      <View className="bg-gray-200 h-0.5 mt-2 rounded" />

                      <View className="h-[100%] flex-1">
                          <FlatList
                              showsVerticalScrollIndicator={false}
                              data={
                                  options as string[] | Record<string, string>[]
                              }
                              ItemSeparatorComponent={() => (
                                  <View className="border-b-[0.5px] border-b-gray-200" />
                              )}
                              keyExtractor={(
                                  item: string | Record<string, string>
                              ) =>
                                  keyExtractor
                                      ? (item as Record<string, string>)[
                                            keyExtractor
                                        ]
                                      : (item as string)
                              }
                              maxToRenderPerBatch={10}
                              removeClippedSubviews
                              renderItem={renderItem}
                          />
                      </View>
                  </View>
              </TouchableWithoutFeedback>
          </Modal>
      </>
  );
};

export default AppModalSelector;
