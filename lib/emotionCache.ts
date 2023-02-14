import { createEmotionCache } from '@mantine/core'

// A custom emotion cache that somehow solves the problem with the ugly server-side rendering.
// Without it, the Mantime/emotion styles are somehow missing on the server-side.
export const emotionCache = createEmotionCache({
  key: 'mantine',
  prepend: true,
})
