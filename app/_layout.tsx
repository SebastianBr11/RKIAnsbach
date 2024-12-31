import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
})

export default function RootLayout() {
	useEffect(() => {
		SplashScreen.hide()
	})
	return <Stack />
}
