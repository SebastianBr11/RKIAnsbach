import { HomeIcon } from '@/src/components/icons'
import { useStyle } from '@/src/lib/styles'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  const { colors } = useStyle()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarText,
        tabBarActiveBackgroundColor: colors.text3,
        tabBarInactiveTintColor: colors.text,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <HomeIcon
              fill={focused ? color : colors.text3}
              height={size ? size : 24}
              width={size ? size : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <CalendarIcon
              fill={focused ? color : colors.text3}
              height={size ? size : 24}
              width={size ? size : 24}
            />
          ),
        }}
      />
    </Tabs>
  )
}
