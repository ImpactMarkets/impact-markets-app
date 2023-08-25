import { permissionMiddleware } from './permissionMiddleware'
import { publicProcedure } from './router'

export { publicProcedure } // To keep both procedures in the same file – can’t be router.ts
// because of a circular dependency
export const protectedProcedure = publicProcedure.use(permissionMiddleware)
