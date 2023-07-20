import { Heading, SectionList, VStack, Text, useToast } from 'native-base'
import { useCallback, useState } from 'react'

import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { useFocusEffect } from '@react-navigation/native'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

export function History() {
  // Loading //
  const [isLoading, setIsLoading] = useState(true)

  const [exercises, setExercises] = useState([
    {
      title: '26.08.22',
      data: ['Puxada frontal', 'Remada unilateral'],
    },
    {
      title: '27.08.22',
      data: ['Puxada frontal'],
    },
  ])

  // Toast //
  const toast = useToast()

  // Realizando o Fetch do Histórico //
  async function fetchHistory() {
    try {
      setIsLoading(true)
      const response = await api.get('/history')

      console.log(response.data)
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

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
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
    </VStack>
  )
}
