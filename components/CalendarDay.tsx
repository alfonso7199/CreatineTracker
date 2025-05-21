import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';
import { useTheme } from '../constants/Theme';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

interface CalendarDayProps {
  day: number;
  key?: string;
  inMonth: boolean;
  taken: boolean;
  onPress?: () => void;
  isToday?: boolean;
}

export function CalendarDay({
  day,
  inMonth,
  taken,
  onPress,
  isToday = false
}: CalendarDayProps) {
  const { colors, radius } = useTheme();

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        taken
          ? colors.primary
          : isToday
            ? colors.primaryLight
            : 'transparent',
        { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
      ),
      transform: [
        {
          scale: taken
            ? withSpring(1, { damping: 12, stiffness: 120 })
            : withSpring(1)
        }
      ]
    };
  }, [taken, isToday]);

  const checkStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(taken ? 1 : 0, { duration: 200 }),
      transform: [
        {
          scale: taken
            ? withSpring(1, { damping: 12, stiffness: 120 })
            : withSpring(0)
        }
      ]
    };
  }, [taken]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!inMonth}
      style={styles.touchable}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.dayContainer,
          { borderRadius: radius.round },
          backgroundStyle
        ]}
      >
        <Typography
          variant="body2"
          color={
            !inMonth
              ? colors.colors.gray[400]
              : taken
                ? colors.colors.white
                : isToday
                  ? colors.primary
                  : colors.text
          }
          style={isToday && !taken ? styles.todayText : null}
        >
          {day}
        </Typography>

        <Animated.View style={[styles.checkContainer, checkStyle]}>
          <Feather name="check" size={14} color={colors.colors.white} />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: 40,
    height: 40,
    margin: 2,
  },
  dayContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkContainer: {
    position: 'absolute',
    right: 2,
    bottom: 2,
  },
  todayText: {
    fontWeight: 'bold',
  }
});