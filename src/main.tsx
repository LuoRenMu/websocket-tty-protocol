import { createRoot } from 'react-dom/client'
import "./styles/tailwind.css"
import "./styles/global.css"
import router from './routers'


import { RouterProvider } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
