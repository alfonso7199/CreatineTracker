import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../constants/Theme';
import { Typography } from './Typography';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false,
  }),
});

const getDefaultTime = (hours: number, minutes = 0) => {
  const date = new Date(0);
  date.setHours(hours, minutes);
  return date.getTime();
};

const DEFAULT_REMINDERS = [
  { id: '1', time: getDefaultTime(8), enabled: false, title: 'Tomar creatina' },
  { id: '2', time: getDefaultTime(13), enabled: false, title: 'Tomar creatina' },
  { id: '3', time: getDefaultTime(19), enabled: false, title: 'Tomar creatina' },
];
export default function Reminders() {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const [reminders, setReminders] = useState(DEFAULT_REMINDERS);
  const [showPicker, setShowPicker] = useState<string | null>(null);


  useEffect(() => {
    const loadReminders = async () => {
      const saved = await AsyncStorage.getItem('reminders');
      if (saved) setReminders(JSON.parse(saved));
    };
    loadReminders();
  }, []);

  useEffect(() => {
    const saveReminders = async () => {
      await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
      await updateNotifications();
    };

    const debounce = setTimeout(saveReminders, 500);
    return () => clearTimeout(debounce);
  }, [reminders]);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder =>
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const updateNotifications = async () => {
    // Cancelar todas primero
    await Notifications.cancelAllScheduledNotificationsAsync();

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    // Solo reprogramar las que están activas
    for (const reminder of reminders) {
      if (!reminder.enabled) continue;

      try {
        // Extraer hora y minutos del timestamp
        const timeDate = new Date(reminder.time);
        const hour = timeDate.getHours();
        const minute = timeDate.getMinutes();

        let trigger: Notifications.NotificationTriggerInput;
        if (Platform.OS === 'ios') {
          trigger = {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour,
            minute,
            repeats: true,
          } as Notifications.CalendarTriggerInput;
        } else {
          trigger = {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
            channelId: 'reminders'
          } as Notifications.DailyTriggerInput;
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: reminder.title,
            body: '¡Es hora de tomar tu creatina!',
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger
        });

        console.log(`Notificación programada ${notificationId} para las ${hour}:${minute.toString().padStart(2, '0')}`);

      } catch (error) {
        console.error('Error al programar notificación:', error);
      }
    }
  };

  useEffect(() => {
    const checkScheduledNotifications = async () => {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Notificaciones programadas:', scheduled);
    };

    checkScheduledNotifications();
  }, [reminders]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    return () => subscription.remove();
  }, []);

  const handleTimeChange = (id: string, newTime: number) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id ? { ...reminder, time: newTime } : reminder
    ));
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {reminders.map(reminder => (
        <ReminderItem
          key={reminder.id}
          id={reminder.id}
          time={reminder.time}
          enabled={reminder.enabled}
          onToggle={toggleReminder}
          onTimeChange={handleTimeChange}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
        />
      ))}
    </ScrollView>
  );
}

interface ReminderItemProps {
  id: string;
  time: number;
  enabled: boolean;
  onToggle: (id: string) => void;
  onTimeChange: (id: string, newTime: number) => void;
  showPicker: string | null;
  setShowPicker: (id: string | null) => void;
}

function ReminderItem({ id, time, enabled, onToggle, onTimeChange, showPicker, setShowPicker }: ReminderItemProps) {
  const theme = useTheme();
  const { colors, spacing } = useTheme();
  const [date, setDate] = useState(new Date(time));

  useEffect(() => {
    setDate(new Date(time));
  }, [time]);

  const handleTimePicker = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      // Guardar solo la hora y minutos como timestamp desde epoch 0
      const newTime = new Date(0);
      newTime.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);

      onTimeChange(id, newTime.getTime());
    }
    setShowPicker(null);
  };
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const bellAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: enabled
            ? withSequence(
              withTiming('15deg', { duration: 100 }),
              withTiming('-15deg', { duration: 100 }),
              withTiming('10deg', { duration: 100 }),
              withTiming('-10deg', { duration: 100 }),
              withTiming('5deg', { duration: 100 }),
              withTiming('0deg', { duration: 100 })
            )
            : withTiming('0deg')
        }
      ]
    };
  }, [enabled]);

  const cardAnimStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        enabled ? colors.primaryLight : colors.card,
        { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
      ),
      shadowOpacity: withTiming(enabled ? 0.2 : 0.1, { duration: 300 }),
      transform: [
        {
          scale: enabled
            ? withSpring(1.02, {
              damping: 12,
              stiffness: 120,
              mass: 0.6
            })
            : withSpring(1)
        }
      ]
    };
  }, [enabled, colors.primaryLight, colors.card, theme.colorScheme]);
  return (
    <Animated.View style={[styles.reminderContainer, cardAnimStyle]}>
      <View style={styles.reminderContent}>
        <Animated.View style={[styles.iconContainer, bellAnimStyle]}>
          <Feather
            name="bell"
            size={24}
            color={enabled ? colors.primary : colors.textSecondary}
            strokeWidth={2}
          />
        </Animated.View>

        <View style={styles.timeContainer}>
          <TouchableOpacity onPress={() => setShowPicker(id)}>
            <Typography variant="subtitle2">
              {formatTime(time)}
            </Typography>
          </TouchableOpacity>

          {showPicker === id && (
            <DateTimePicker
              value={date}
              mode="time"
              display="clock"
              onChange={handleTimePicker}
              is24Hour={true}
            />
          )}
        </View>
      </View>

      <Switch
        style={styles.switch}
        value={enabled}
        onValueChange={() => onToggle(id)}
        trackColor={{ false: colors.colors.gray[400], true: colors.colors.gray[400] }}
        thumbColor={enabled ? colors.primary : colors.colors.gray[100]}
      />
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    marginRight: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
  },
  timeContainer: {
    flex: 1,
  },
  switch: {
    marginLeft: -45,
  },
});