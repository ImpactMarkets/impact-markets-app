import { permissionMiddleware } from './permission-middleware'
import { router } from './router'

export function createProtectedRouter() {
  return router.middleware(permissionMiddleware)
}
