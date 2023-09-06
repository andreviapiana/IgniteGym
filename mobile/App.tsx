import { StatusBar } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import { THEME } from './src/theme'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { Routes } from '@routes/index'
import { Loading } from '@components/Loading'

import { AuthContextProvider } from '@contexts/AuthContext'

import OneSignal from 'react-native-onesignal'
import { REACT_APP_ONE_SIGNAL_APP_ID } from '@env'
import { useEffect } from 'react'

OneSignal.setAppId(String(REACT_APP_ONE_SIGNAL_APP_ID))

OneSignal.promptForPushNotificationsWithUserResponse()

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

useEffect(() => {
  const unsubscribe = OneSignal.setNotificationOpenedHandler(() => {
    console.log('Notificação aberta')
  })

  return () => unsubscribe
}, [])

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  )
}
