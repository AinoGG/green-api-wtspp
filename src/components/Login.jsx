import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';

function Login({ onLogin }) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [apiUrl, setApiUrl] = useState('');
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!idInstance || !apiTokenInstance) {
      setError('Пожалуйста, заполните все поля')
      return
    }
    setError('')
    onLogin({ idInstance, apiTokenInstance, apiUrl })
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Card sx={{ width: 400, padding: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom textAlign="center" fontWeight="bold">
            GREEN-API Вход
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="apiUrl"
              placeholder="https://####.api.green-api.com"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="idInstance"
              variant="outlined"
              fullWidth
              value={idInstance}
              onChange={(e) => setIdInstance(e.target.value)}
            />
            <TextField
              label="apiTokenInstance"
              type="password"
              variant="outlined"
              fullWidth
              value={apiTokenInstance}
              onChange={(e) => setApiTokenInstance(e.target.value)}
            />
            <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
              Войти в чат
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login;
