import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ImageSourcePropType } from 'react-native';
import { useTheme } from '../constants/Theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { Typography } from './Typography';

interface TrackingButtonProps {
  taken: boolean;
  onToggle: () => void;
  takenText?: string;
  notTakenText?: string;
}

export function TrackingButton({ taken, onToggle}: TrackingButtonProps) {
  const { colors, radius } = useTheme();

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const progress = useSharedValue(taken ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(taken ? 1 : 0, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    scale.value = 1;
    rotation.value = 0;
  }, [taken]);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.9, { damping: 8, stiffness: 300 }),
      withSpring(1.1, { damping: 8, stiffness: 300 }),
      withSpring(1, { damping: 8, stiffness: 300 })
    );

    rotation.value = withSequence(
      withTiming(taken ? 0 : -15, { duration: 200 }),
      withTiming(taken ? 0 : 15, { duration: 200 }),
      withTiming(0, { duration: 200 })
    );

    onToggle();
  };

  const buttonAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
      backgroundColor: withTiming(
        taken ? colors.success : colors.primary,
        { duration: 300 }
      )
    };
  });

  const circleAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withTiming(1 + progress.value * 0.1, { duration: 300 }) }
      ],
      opacity: withTiming(0.15 + progress.value * 0.1, { duration: 300 })
    };
  });

  const contentAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1, { duration: 200 }),
      transform: [
        { scale: withTiming(0.9 + progress.value * 0.1, { duration: 300 }) }
      ]
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.circleBackground,
        { backgroundColor: taken ? colors.success : colors.primary },
        circleAnimStyle
      ]} />

      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View style={[
          styles.button,
          { shadowColor: taken ? colors.success : colors.primary },
          buttonAnimStyle
        ]}>
          <Animated.Image
            source={{ uri: '../../assets/images/LogoPre.png' }}
            style={[
              styles.image,
              { tintColor: colors.colors.white },
              contentAnimStyle
            ]}
            resizeMode="contain"
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={contentAnimStyle}>
        <Typography
          variant="button"
          align="center"
          style={styles.label}
          color={taken ? colors.success : colors.primary}
        >
          {taken ? "TAKEN TODAY" : "TAP TO TRACK"}
        </Typography>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 20,
  },
  circleBackground: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.15,
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  image: {
    width: 70,
    height: 70,
  },
  label: {
    marginTop: 16,
    fontWeight: '700',
  }
});