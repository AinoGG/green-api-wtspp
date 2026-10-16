import React, { useState } from 'react';
import { Box, TextField, Button, Typography, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';

function ChatList({ onSelectChat, activeChat, onLogout }) {
  const [phoneInput, setPhoneInput] = useState('')

  const handleCreateChat = (e) => {
    e.preventDefault()
    const cleanPhone = phoneInput.replace(/\D/g, '')
    if (cleanPhone.length >= 10) {
      onSelectChat(cleanPhone)
      setPhoneInput('')
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f0f2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
        <Typography variant="h6" fontWeight="medium">Чат-интерфейс</Typography>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{ textTransform: 'none' }}
        >
          Выйти
        </Button>
      </Box>

      <Box component="form" onSubmit={handleCreateChat} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <TextField
          label="Номер получателя"
          placeholder="Например, 79991112233"
          size="small"
          fullWidth
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
        />
        <Button variant="contained" color="success" size="small" type="submit" fullWidth>
          Создать / Открыть чат
        </Button>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {activeChat ? (
          <List disablePadding>
            <ListItemButton selected={true}>
              <ChatIcon sx={{ color: '#666', mr: 2 }} />
              <ListItemText
                primary={`+${activeChat}`}
                secondary="Текущий собеседник"
              />
            </ListItemButton>
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
            Нет активных чатов
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default ChatList;
