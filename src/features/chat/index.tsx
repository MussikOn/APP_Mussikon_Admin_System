import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress
} from '@mui/material';
import { useChat } from '../../hooks/useChat';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import NewConversationModal from './components/NewConversationModal';
import ChatHeader from './components/ChatHeader';

const Chat: React.FC = () => {
  const {
    conversations,
    selectedConversation,
    conversationsLoading,
    conversationsError,
    messages,
    messagesLoading,
    messagesError,
    hasMoreMessages,
    fetchConversations,
    selectConversation,
    createConversation,
    deleteConversation,
    sendMessage,
    deleteMessage,
    editMessage,
    uploadFile,
    createGroup,
    searchConversations,
    clearErrors
  } = useChat();

  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Manejar búsqueda de conversaciones
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchConversations(query);
    } else {
      fetchConversations();
    }
  };

  // Manejar creación de nueva conversación
  const handleCreateConversation = async (participants: string[], isGroup = false, groupName?: string) => {
    const conversation = await createConversation(participants, isGroup, groupName);
    if (conversation) {
      selectConversation(conversation);
      setShowNewConversationModal(false);
    }
  };

  // Manejar eliminación de conversación
  const handleDeleteConversation = async (conversationId: string) => {
    await deleteConversation(conversationId);
  };

  // Limpiar errores
  const handleClearErrors = () => {
    clearErrors();
  };

  if (conversationsLoading && conversations.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <ChatHeader
        onNewConversation={() => setShowNewConversationModal(true)}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        selectedConversation={selectedConversation}
      />

      {/* Contenido principal */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Lista de conversaciones */}
          <Grid 
            item 
            xs={12} 
            md={4} 
            lg={3}
            sx={{ 
              display: { xs: selectedConversation ? 'none' : 'block', md: 'block' },
              height: '100%',
              borderRight: { md: 1 },
              borderColor: { md: 'divider' }
            }}
          >
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              loading={conversationsLoading}
              error={conversationsError}
              onSelectConversation={selectConversation}
              onDeleteConversation={handleDeleteConversation}
              onClearError={handleClearErrors}
            />
          </Grid>

          {/* Ventana de chat */}
          <Grid 
            item 
            xs={12} 
            md={8} 
            lg={9}
            sx={{ 
              display: { xs: selectedConversation ? 'block' : 'none', md: 'block' },
              height: '100%'
            }}
          >
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                messages={messages}
                loading={messagesLoading}
                error={messagesError}
                hasMoreMessages={hasMoreMessages}
                onSendMessage={sendMessage}
                onDeleteMessage={deleteMessage}
                onEditMessage={editMessage}
                onUploadFile={uploadFile}
                onLoadMoreMessages={() => {
                  // Implementar carga de más mensajes
                }}
                onClearError={handleClearErrors}
              />
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  color: 'text.secondary'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Selecciona una conversación
                </Typography>
                <Typography variant="body2">
                  Elige una conversación de la lista para comenzar a chatear
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Modal para nueva conversación */}
      <NewConversationModal
        open={showNewConversationModal}
        onClose={() => setShowNewConversationModal(false)}
        onCreateConversation={handleCreateConversation}
        onCreateGroup={async (participants, groupName, groupAvatar) => {
          await createGroup(participants, groupName, groupAvatar);
        }}
      />
    </Box>
  );
};

export default Chat; 