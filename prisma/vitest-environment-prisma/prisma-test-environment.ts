import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('SetUp')

    return {
      teardown() {
        console.log('TearDown')
      },
    }
  },
}
