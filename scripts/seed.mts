import 'dotenv/config'

import { createLocalReq, getPayload } from 'payload'

import { seed } from '../src/endpoints/seed/index.js'
import config from '../src/payload.config.js'

async function main(): Promise<void> {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  try {
    await seed({ payload, req })
    payload.logger.info('Seed completed successfully.')
    process.exit(0)
  } catch (error) {
    payload.logger.error({ err: error, message: 'Seed failed' })
    process.exit(1)
  }
}

void main()
