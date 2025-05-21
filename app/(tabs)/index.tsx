import React, { useEffect, useState } from 'react';
import {
	Platform,
	StyleSheet,
	View,
	ScrollView,
	TouchableOpacity,
	useColorScheme,
	StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, addMonths, isSameDay } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/Theme';
import { Typography } from '../../components/Typography';
import { CalendarDay } from '../../components/CalendarDay';
import { MonthPicker } from '../../components/MonthPicker';
import { TrackingButton } from '../../components/TrackingButton';
import { Card } from '../../components/Card';
import Reminders from '../../components/Reminders';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	startOfMonth,
	startOfWeek,
	isSameMonth,
} from 'date-fns';
import { DarkTheme, ThemeContext } from '@react-navigation/native';


const STORAGE_KEY = 'creatine_log';

export default function HomeScreen() {
	const { colors, spacing } = useTheme();
	const colorScheme = useColorScheme();
	const today = format(new Date(), 'yyyy-MM-dd');
	const [monthDate, setMonthDate] = useState(new Date());
	const [takenToday, setTakenToday] = useState(false);
	const [log, setLog] = useState<string[]>([]);
	const router = useRouter();
	const { t, i18n } = useTranslation();

	const dateLocale = i18n.language === 'es' ? es : enUS;

	useEffect(() => {
		const loadData = async () => {
			await loadLogData();

			const interval = setInterval(() => {
				const newToday = format(new Date(), 'yyyy-MM-dd');
				if (today !== newToday) {
					loadLogData();
				}
			}, 60000);

			return () => clearInterval(interval);
		};

		loadData();
	}, []);


	const loadLogData = async () => {
		try {
			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			const parsed = stored ? JSON.parse(stored) : [];
			const currentDate = format(new Date(), 'yyyy-MM-dd');

			setLog(parsed);
			setTakenToday(parsed.includes(currentDate));
		} catch (error) {
			console.error('Error loading log data:', error);
		}
	};

	const toggleToday = async () => {
		try {
			const currentDate = format(new Date(), 'yyyy-MM-dd');
			let newLog = [...log];

			newLog = newLog.filter(date => date !== currentDate);

			if (!takenToday) {
				newLog.push(currentDate);
			}

			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLog));
			setLog(newLog);
			setTakenToday(!takenToday);
		} catch (error) {
			console.error('Error saving log data:', error);
		}
	};

	const toggleSpecificDate = async (date: string) => {
		try {
			let newLog = [...log];

			if (newLog.includes(date)) {
				newLog = newLog.filter(d => d !== date);
			} else {
				newLog.push(date);
			}

			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLog));
			setLog(newLog);

			if (date === format(new Date(), 'yyyy-MM-dd')) {
				setTakenToday(!takenToday);
			}
		} catch (error) {
			console.error('Error updating specific date:', error);
		}
	};

	const handlePrevMonth = () => {
		setMonthDate(prevDate => addMonths(prevDate, -1));
	};

	const handleNextMonth = () => {
		setMonthDate(prevDate => addMonths(prevDate, 1));
	};

	const calendarDays = getCalendarDays(monthDate);

	const daysTrackedThisMonth = calendarDays.filter(
		day => day.inMonth && log.includes(day.key)
	).length;

	const daysInMonth = calendarDays.filter(day => day.inMonth).length;
	const completionRate = daysInMonth > 0
		? Math.round((daysTrackedThisMonth / daysInMonth) * 100)
		: 0;

	const DAYS_OF_WEEK = t('calendar.weekdays', { returnObjects: true });

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
			<StatusBar
				barStyle={useColorScheme() === 'dark' ? 'light-content' : 'dark-content'}
				backgroundColor={colors.background}
			/>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.header}>
					<Typography variant="h2" align="center">
						{t('app.title')}
					</Typography>
					<Typography
						variant="subtitle1"
						align="center"
						color={colors.textSecondary}
						style={styles.dateText}
					>
						{format(new Date(), t('app.dateFormat'), { locale: dateLocale })}
					</Typography>
				</View>

				<TrackingButton
					taken={takenToday}
					onToggle={toggleToday}
				/>
				<Card style={styles.calendarCard}>
					<Typography
						variant="h3"
						style={styles.sectionTitle}
					>
						{t('home.monthlyProgress')}
					</Typography>

					<View style={styles.statsRow}>
						<View style={styles.statItem}>
							<Typography
								variant="h4"
								color={colors.primary}
								align="center"
							>
								{daysTrackedThisMonth}
							</Typography>
							<Typography
								variant="body2"
								color={colors.textSecondary}
								align="center"
							>
								{t('home.daysTracked')}
							</Typography>
						</View>

						<View style={styles.statItem}>
							<Typography
								variant="h4"
								color={daysTrackedThisMonth > 0 ? colors.success : colors.textSecondary}
								align="center"
							>
								{completionRate}%
							</Typography>
							<Typography
								variant="body2"
								color={colors.textSecondary}
								align="center"
							>
								{t('home.completion')}
							</Typography>
						</View>
					</View>

					<MonthPicker
						currentMonth={monthDate}
						onPrevMonth={handlePrevMonth}
						onNextMonth={handleNextMonth}
					/>

					<View style={styles.weekdaysRow}>
						{DAYS_OF_WEEK.map((day: string) => (
							<View key={day} style={styles.weekdayCell}>
								<Typography
									variant="caption"
									color={colors.textSecondary}
									align="center"
								>
									{day}
								</Typography>
							</View>
						))}
					</View>

					<View style={styles.calendarGrid}>
						{calendarDays.map(({ key, day, inMonth }) => {
							const isCurrentDay = isSameDay(new Date(key), new Date());
							return (
								<CalendarDay
									key={key}
									day={day}
									inMonth={inMonth}
									taken={log.includes(key)}
									isToday={isCurrentDay}
									onPress={() => {
										const selectedDate = format(new Date(key), 'yyyy-MM-dd');
										const isPastDate = new Date(key) < new Date();

										if (isPastDate) {
											toggleSpecificDate(selectedDate);
										}
									}}
								/>
							);
						})}
					</View>
				</Card>

				<Card style={styles.remindersCard}>
					<Typography
						variant="h3"
						style={styles.sectionTitle}
					>
						{t('home.reminders')}
					</Typography>
					<Reminders />
				</Card>

				<TouchableOpacity
					onPress={() => router.push('/about')}
					style={styles.infoButton}
				>
					<Feather name="info" size={34} color={colorScheme === 'dark' ? colors.white : colors.black} />
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
}

function getCalendarDays(date: Date) {
	const monthStart = startOfMonth(date);
	const monthEnd = endOfMonth(date);
	const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
	const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

	const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

	return days.map(day => ({
		key: format(day, 'yyyy-MM-dd'),
		day: parseInt(format(day, 'd')),
		inMonth: isSameMonth(day, date),
	}));
}

const styles = StyleSheet.create({
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 16,
		paddingBottom: 32,
	},
	header: {
		marginTop: Platform.OS === 'ios' ? 12 : 24,
		marginBottom: 16,
	},
	dateText: {
		marginTop: 8,
	},
	sectionTitle: {
		marginBottom: 16,
		alignSelf: 'center'
	},
	calendarCard: {
		marginTop: 16,
		marginBottom: 24,
		padding: 16,
	},
	remindersCard: {
		marginBottom: 24,
		padding: 16,
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 16,
		paddingHorizontal: 16,
	},
	statItem: {
		alignItems: 'center',
	},
	weekdaysRow: {
		flexDirection: 'row',
		marginBottom: 8,
		marginTop: 8,
	},
	weekdayCell: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 8,
	},
	calendarGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	infoButton: {
		alignSelf: 'center',
		padding: 12,
		marginTop: 16,
	},
});