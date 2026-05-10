import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { toObservable } from '@angular/core/rxjs-interop'
import { filter, map, take } from 'rxjs'

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)

  return toObservable(auth.loading).pipe(
    filter(loading => !loading),   // espera a que loading sea false
    take(1),
    map(() => {
      if (auth.isAdmin()) return true
      router.navigate(['/'])
      return false
    })
  )
}