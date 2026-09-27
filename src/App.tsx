import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import Dashboard from './components/app/Dashboard'
import NewResident from './components/app/NewResident'
import ResidentRecord from './components/app/ResidentRecord'
import Residents from './components/app/Residents'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/residentes"
          element={<Residents />}
        />

        <Route
          path="/residentes/novo"
          element={<NewResident />}
        />

        <Route
          path="/residentes/:id"
          element={<ResidentRecord />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App