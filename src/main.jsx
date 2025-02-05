import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter , RouterProvider  } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AllPosts from './pages/AllPosts.jsx'
import AddPost from './pages/AddPost.jsx'
import EditPost from './pages/EditPost.jsx'
import Post from './pages/Post.jsx'
import Protected from './components/AuthLayout.jsx'


// We can use the below way of routing which will create a sandwich method that is clearly explained in 07ReactRouter folder
// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path='/' element={<App/>}/>
//   )
// )

const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
    children : [ // These routes will render inside the App component, which is the parent element for this route configuration.
      { 
        path : '/',
        element : <Home/>
      },
      {
        path : '/login',
        element : (
          <Protected authentication={false}>
            <Login/>
          </Protected>
        )
      },
      {
        path : '/signup',
        element : (
          <Protected authentication={false}>
            <Signup/>
          </Protected>
        )
      },
      {
        path : '/all-posts',
        element : (
          <Protected authentication={true}>
            <AllPosts/>
          </Protected>
        )
      },
      {
        path : '/add-post',
        element : (
          <Protected authentication={true}>
            <AddPost/>
          </Protected>
        )
      },
      {
        path : '/edit-post/:slug',
        element : (
          <Protected authentication={true}>
            <EditPost/>
          </Protected>
        )
      },
      {
        path : '/post/:slug',
        element : (
          <Protected authentication={true}>
            <Post/>
          </Protected>
        )
      }
    ]
  },

])


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  // </StrictMode>,
)
