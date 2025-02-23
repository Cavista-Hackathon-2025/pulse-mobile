import { Image, View } from 'react-native';
import React from 'react';
import Animated, { Extrapolation, SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { UserType } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '../global/AppText';
import { useColorScheme } from 'nativewind';

type Props = {
  item: UserType;
  width: number;
  height: number;
  marginHorizontal: number;
  fullWidth: number;
  x: SharedValue<number>;
  index: number;
};

const UserTypeCarouselItem = ({ item, width, height, marginHorizontal, fullWidth, x, index }: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(x.value, [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth], [20, 0, -20], Extrapolation.CLAMP);
    const translateY = interpolate(x.value, [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth], [60, 0, 60], Extrapolation.CLAMP);
    return {
      transform: [{ rotateZ: `${rotateZ}deg` }, { translateY: translateY }],
    };
  });

  const { colorScheme } = useColorScheme();

  return (
    <Animated.View
      className="overflow-hidden origin-bottom border-b-[3px] border-r-[3px] border-b-green-light/30 border-r-green-light/30"
      style={[{ width: width, height: height, marginHorizontal: marginHorizontal, borderRadius: 16 }, animatedStyle]}
    >
      <LinearGradient
        colors={colorScheme === 'light' ? ['#f9faf5', 'white', '#f0f2e9'] : ['#2a2a2a', '#2a2a2a', '#1a1a1a']}
        locations={[0.1, 0.2, 1]}
        start={{ x: 0.1, y: 0.5 }}
        className="absolute top-0 left-0 right-0 bottom-0"
      />
      <View className="flex-1">
        <Image source={item.image} className="flex-1 bg-transparent" style={{ width }} resizeMode="contain" />
      </View>
      <View className="mb-3 mx-3">
        <AppText customStyles="font-medium text-2xl mb-1">{item.verbose}</AppText>
        <AppText>{item.description}</AppText>
      </View>
    </Animated.View>
  );
};

export default UserTypeCarouselItem;
