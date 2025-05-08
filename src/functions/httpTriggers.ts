import { app } from '@azure/functions'
import { azureHonoHandler } from '@marplex/hono-azurefunc-adapter'
import honoApp from './app'

app.http('storeCommit', {
    methods: ['POST'],
    authLevel: 'admin',
    route: '{*proxy}',
    handler: azureHonoHandler(honoApp.fetch),
})