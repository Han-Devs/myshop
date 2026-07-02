import { Navigate } from 'react-router-dom'

function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) {
    alert('Please login to continue')
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute