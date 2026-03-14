import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminRoute from './components/AdminRoute'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import QuestionDetailPage from './pages/QuestionDetailPage'
import QuestionFormPage from './pages/QuestionFormPage'
import QuestionListPage from './pages/QuestionListPage'
import QuizBatchAddPage from './pages/QuizBatchAddPage'
import QuizDetailPage from './pages/QuizDetailPage'
import QuizFormPage from './pages/QuizFormPage'
import QuizListPage from './pages/QuizListPage'
import QuizPerformPage from './pages/QuizPerformPage'
import SignupPage from './pages/SignupPage'
import UsersPage from './pages/UsersPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="quizzes" element={<QuizListPage />} />
          <Route path="quizzes/:quizId" element={<QuizDetailPage />} />
          <Route path="quizzes/:quizId/perform" element={<QuizPerformPage />} />
          <Route path="quizzes/:quizId/batch" element={<QuizBatchAddPage />} />

          <Route path="questions" element={<QuestionListPage />} />
          <Route path="questions/:questionId" element={<QuestionDetailPage />} />
          <Route path="questions/create" element={<QuestionFormPage />} />
          <Route path="questions/:questionId/edit" element={<QuestionFormPage />} />

          <Route element={<AdminRoute />}>
            <Route path="quizzes/create" element={<QuizFormPage />} />
            <Route path="quizzes/:quizId/edit" element={<QuizFormPage />} />
            <Route path="admin/users" element={<UsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
