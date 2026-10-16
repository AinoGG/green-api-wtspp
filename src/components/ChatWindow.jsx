import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { sendMessage, receiveNotification, deleteNotification } from '../api/greenApi';

function ChatWindow({ credentials, phoneNumber }) {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [error, setError] = useState('')

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    let isMounted = true

    const pollMessages = async () => {
      if (!isMounted) return

      try {
        const data = await receiveNotification(credentials)

        if (data && data.receiptId) {
          const { receiptId, body } = data

          if (
            body.typeWebhook === 'incomingMessageReceived' &&
            body.senderData?.chatId === `${phoneNumber}@c.us`
          ) {
            const incomingText = body.messageData?.textMessageData?.textMessage

            if (incomingText) {
              setMessages((prev) => [
                ...prev,
                {
                  id: body.idMessage || Date.now().toString(),
                  text: incomingText,
                  type: 'incoming',
                },
              ])
            }
          }

          await deleteNotification(credentials, receiptId)
        }
      } catch (err) {
        console.error('Ошибка при получении уведомлений:', err)
      }

      setTimeout(pollMessages, 3000)
    }

    pollMessages()

    return () => {
      isMounted = false
    }
  }, [credentials, phoneNumber])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const textToSend = inputText
    setInputText('')
    setError('')

    try {
      const result = await sendMessage(credentials, phoneNumber, textToSend)
      const newMessage = {
        id: result.idMessage || Date.now().toString(),
        text: textToSend,
        type: 'outgoing',
      }
      setMessages((prev) => [...prev, newMessage])
    } catch (err) {
      setError('Не удалось отправить сообщение. Проверьте консоль.')
      console.error(err)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, backgroundColor: '#f0f2f5', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Чат с: +{phoneNumber}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ borderRadius: 0 }}>{error}</Alert>}

      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {messages.map((msg) => {
          const isOutgoing = msg.type === 'outgoing'
          return (
            <Box
              key={msg.id}
              sx={{ display: 'flex', justifyContent: isOutgoing ? 'flex-end' : 'flex-start', mb: 0.5 }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  maxWidth: '70%',
                  borderRadius: isOutgoing ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  backgroundColor: isOutgoing ? '#d9fdd3' : '#ffffff',
                  color: '#000000',
                  wordBreak: 'break-word',
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
            </Box>
          )
        })}
        <div ref={messagesEndRef} />
      </Box>

      <Box component="form" onSubmit={handleSend} sx={{ p: 2, backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Введите текстовое сообщение..."
          variant="outlined"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
        />
        <IconButton type="submit" color="primary" disabled={!inputText.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatWindow;
