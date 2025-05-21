import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';
import { useTheme } from '../constants/Theme';
import { Feather } from '@expo/vector-icons';
import { format, Locale } from 'date-fns';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import i18n from '@/services/i18n';
import { enUS, es } from 'date-fns/locale';

interface MonthPickerProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  locale?: Locale;

}

export function MonthPicker({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  locale
}: MonthPickerProps) {
  const { colors, spacing } = useTheme();
  const [direction, setDirection] = React.useState<'left' | 'right' | null>(null);
  const formattedDate = format(new Date(), 'EEEE, MMMM d, yyyy', {
    locale: i18n.language === 'es' ? es : enUS
  });
  const handlePrevMonth = () => {
    setDirection('left');
    onPrevMonth();
    setTimeout(() => setDirection(null), 500);
  };

  const handleNextMonth = () => {
    setDirection('right');
    onNextMonth();
    setTimeout(() => setDirection(null), 500);
  };

  const monthTextStyle = useAnimatedStyle(() => {
    if (!direction) return { opacity: 1 };

    return {
      opacity: withSequence(
        withTiming(0.5, { duration: 100, easing: Easing.ease }),
        withTiming(1, { duration: 200, easing: Easing.ease })
      ),
      transform: [
        {
          translateX: withSequence(
            withTiming(direction === 'left' ? -10 : 10, {
              duration: 100,
              easing: Easing.ease
            }),
            withTiming(0, {
              duration: 200,
              easing: Easing.ease
            })
          )
        }
      ]
    };
  }, [direction]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePrevMonth}
        style={styles.button}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Feather name="chevron-left" color={colors.text} size={24} />
      </TouchableOpacity>

      <Animated.View style={[styles.monthLabelContainer, monthTextStyle]}>
        <Typography variant="h4" align="center">
          {currentMonth.toLocaleDateString('default', {
            month: 'long',
            year: 'numeric'
          })}
        </Typography>
      </Animated.View>

      <TouchableOpacity
        onPress={handleNextMonth}
        style={styles.button}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Feather name="chevron-right" color={colors.text} size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  button: {
    padding: 8,
  },
  monthLabelContainer: {
    flex: 1,
  }
});