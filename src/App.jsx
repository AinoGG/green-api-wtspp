import React, { useState } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import Login from './components/Login'
import ChatList from './components/ChatList'
import ChatWindow from './components/ChatWindow'

function App() {
  const [credentials, setCredentials] = useState(() => {
    const savedId = localStorage.getItem('idInstance')
    const savedToken = localStorage.getItem('apiTokenInstance')
    const savedUrl = localStorage.getItem('apiUrl')

    if (savedId && savedToken && savedUrl) {
      return { idInstance: savedId, apiTokenInstance: savedToken, apiUrl: savedUrl }
    }
    return null
  })


  const [activeChat, setActiveChat] = useState(() => {
    return localStorage.getItem('activeChatPhone') || ''
  })

  const handleSelectChat = (phoneNumber) => {
    localStorage.setItem('activeChatPhone', phoneNumber)
    setActiveChat(phoneNumber)
  }


  const handleLogin = (authData) => {
    localStorage.setItem('idInstance', authData.idInstance)
    localStorage.setItem('apiTokenInstance', authData.apiTokenInstance)
    localStorage.setItem('apiUrl', authData.apiUrl)
    setCredentials(authData)
  }

  const handleLogout = () => {
    localStorage.removeItem('idInstance')
    localStorage.removeItem('apiTokenInstance')
    localStorage.removeItem('apiUrl')
    localStorage.removeItem('activeChatPhone')
    setCredentials(null)
    setActiveChat('')
  }

  if (!credentials) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Paper
        elevation={3}
        sx={{
          width: 320,
          height: '100%',
          borderRadius: 0,
          borderRight: '1px solid #e0e0e0',
          boxSizing: 'border-box'
        }}
      >
        <ChatList
          onSelectChat={handleSelectChat}
          activeChat={activeChat}
          onLogout={handleLogout}
        />
      </Paper>
      <Box sx={{ flexGrow: 1, height: '100%', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column' }}>
        {activeChat ? (
          <ChatWindow credentials={credentials} phoneNumber={activeChat} />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="textSecondary">
              Введите номер телефона слева, чтобы начать чат
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default App;
