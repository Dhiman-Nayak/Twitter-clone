import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient } from "@tanstack/react-query"

// const qurreyClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <BrowserRouter>

      {/* <QueryClient client={qurreyClient}> */}
        <App />
      {/* </QueryClient> */}

    </BrowserRouter>

  </React.StrictMode>,
)
