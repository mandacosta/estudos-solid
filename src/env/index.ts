import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3000),
})

const env_ = envSchema.safeParse(process.env)

if (env_.success === false) {
  console.error('Variáveis de ambiente inválidas 🛑', env_.error.format())

  // O throw new Error sendo executado no alto nível da aplicação
  // derruba tudo e não deixa ela rodar, exatamente o que queremos caso não sejam fornecidas
  // as variáveis ambiente
  throw new Error('🛑 Variáveis de ambiente inválidas')
}

export const env = env_.data
