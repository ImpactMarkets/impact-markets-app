import { permissionMiddleware } from './permissionMiddleware'
import { router } from './router'

export function createProtectedRouter() {
  return router.middleware(permissionMiddleware)
}
