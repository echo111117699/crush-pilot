import { AppProvider, useApp } from './context/AppContext'
import Welcome from './screens/Welcome'
import QuickContext from './screens/QuickContext'
import MainLayout from './screens/MainLayout'
import PrivacyModal from './components/shared/PrivacyModal'

function AppScreens() {
  const { screen, privacyAccepted, setPrivacyAccepted } = useApp()

  if (!privacyAccepted) {
    return <PrivacyModal onAccept={() => setPrivacyAccepted(true)} />
  }

  switch (screen) {
    case 'welcome': return <Welcome />
    case 'quickContext': return <QuickContext />
    case 'main': return <MainLayout />
    default: return <Welcome />
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="h-screen w-screen overflow-hidden bg-crush-bg">
        <AppScreens />
      </div>
    </AppProvider>
  )
}
