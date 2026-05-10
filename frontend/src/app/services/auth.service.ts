import { Injectable, signal } from '@angular/core'
import { supabase } from '../core/supabase.client'

export interface AuthUser {
  id: string
  email: string | null
  full_name: string | null
  role: string | null
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<AuthUser | null>(null)
  loading = signal(true)
  error = signal('')

  constructor() {
    supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        this.user.set(this.buildUser(session.user))
      } else {
        this.user.set(null)
      }
      this.loading.set(false)
    })
  }

  private buildUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
      role: user.app_metadata?.role ?? user.user_metadata?.role ?? 'user',
    }
  }

  async login(email: string, password: string): Promise<void> {
    this.error.set('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.session?.user) {
      const message = error?.message ?? 'No se pudo iniciar sesión.'
      this.error.set(message)
      throw new Error(message)
    }
    this.user.set(this.buildUser(data.session.user))
  }

  async register(fullName: string, email: string, password: string): Promise<void> {
    this.error.set('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: 'user' } },
    })
    if (error || !data.user) {
      const message = error?.message ?? 'No se pudo crear la cuenta.'
      this.error.set(message)
      throw new Error(message)
    }
    this.user.set(this.buildUser(data.user))
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut()
    this.user.set(null)
  }

  isLoggedIn(): boolean {
    return !!this.user()
  }

  isAdmin(): boolean {
    return this.user()?.role === 'admin'
  }
}