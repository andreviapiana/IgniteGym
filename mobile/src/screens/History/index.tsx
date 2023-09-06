import { Heading, SectionList, VStack, Text, useToast } from 'native-base'
import { useCallback, useEffect, useState } from 'react'

import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { Loading } from '@components/Loading'

import { useFocusEffect, useRoute } from '@react-navigation/native'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO'

import { tagWeeklyExercisesAmount } from '../../notifications/notificationsTags'

type RouteParamsProps = {
  createWeekExercisesAmount?: boolean
}

export function History() {
  // Recebendo o createWeekExercisesAmount pela Rota p/ Disparar o useEffect //
  const route = useRoute()

  const params = route.params as RouteParamsProps

  // Loading //
  const [isLoading, setIsLoading] = useState(true)

  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

  // Toast //
  const toast = useToast()

  // Realizando o Fetch do Histórico //
  async function fetchHistory() {
    try {
      setIsLoading(true)
      const response = await api.get('/history')

      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os detalhes do exercício'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, []),
  )

  useEffect(() => {
    if (params?.createWeekExercisesAmount && exercises) {
      const amount = exercises.flatMap((day) => {
        const days = day.data.filter(
          (exercise) =>
            new Date(exercise.created_at).getMonth() === new Date().getMonth(),
        )
        return days
      }).length

      tagWeeklyExercisesAmount(amount)
    }
  }, [exercises, params])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading
              color="gray.200"
              fontSize="md"
              mt={10}
              mb={3}
              fontFamily="heading"
            >
              {section.title}
            </Heading>
          )}
          px={8}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: 'center' }
          }
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign="center">
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          )}
        />
      )}
    </VStack>
  )
}
