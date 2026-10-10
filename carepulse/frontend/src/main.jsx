import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LangProvider } from './i18n.jsx'
import { auth } from './api.js'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <LangProvider initial={auth.user?.language || localStorage.getItem('cp_lang') || 'EN'}><App /></LangProvider>
)
