import { Fragment } from 'react';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PostsPage from './pages/PostsPage';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';



function App() {
  return (
    <Fragment>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route path='/posts' element={<PostsPage />} />
          </Route>

        </Routes>
      </Router>
    </Fragment >
  );
}

export default App
