import { CalendarIcon, HomeIcon } from '@/src/components/icons'
import { useStyle } from '@/src/lib/styles'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  const { colors } = useStyle()

  return (
    <Tabs
      screenOptions={{
        // For now set different tint colors to differentiate between tabs
        tabBarActiveTintColor: colors.primary600,
        //tabBarActiveBackgroundColor: colors.text3,
        tabBarInactiveTintColor: colors.text2,
        tabBarInactiveBackgroundColor: colors.tabBar,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <HomeIcon
              fill={color}
              height={size ? size : 24}
              width={size ? size : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused, color, size }) => (
            <CalendarIcon
              fill={color}
              height={size ? size : 24}
              width={size ? size : 24}
            />
          ),
        }}
      />
    </Tabs>
  )
}
