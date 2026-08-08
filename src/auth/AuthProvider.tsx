import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getFirebaseAuth, isFirebaseConfigured } from './firebase'

export type SocialProvider = 'google' | 'github' | 'microsoft' | 'apple'

type AuthContextValue = {
  user: User | null
  loading: boolean
  configured: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>
  signInWithSocial: (provider: SocialProvider) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function createSocialProvider(provider: SocialProvider) {
  switch (provider) {
    case 'google':
      return new GoogleAuthProvider()
    case 'github':
      return new GithubAuthProvider()
    case 'microsoft':
      return new OAuthProvider('microsoft.com')
    case 'apple':
      return new OAuthProvider('apple.com')
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(configured)

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })

    return unsubscribe
  }, [configured])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
  }, [])

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      const credential = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password,
      )

      if (displayName.trim()) {
        await updateProfile(credential.user, { displayName: displayName.trim() })
      }
    },
    [],
  )

  const signInWithSocial = useCallback(async (provider: SocialProvider) => {
    await signInWithPopup(getFirebaseAuth(), createSocialProvider(provider))
  }, [])

  const signOut = useCallback(async () => {
    await firebaseSignOut(getFirebaseAuth())
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      signInWithEmail,
      signUpWithEmail,
      signInWithSocial,
      signOut,
    }),
    [
      user,
      loading,
      configured,
      signInWithEmail,
      signUpWithEmail,
      signInWithSocial,
      signOut,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
