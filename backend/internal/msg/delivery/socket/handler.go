package socket

import (
	"context"
	"log/slog"
	"sync"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/google/uuid"
	"github.com/studsch/cool-app/backend/internal/models"
	"github.com/studsch/cool-app/backend/internal/msg"
)

type msgHandlers struct {
	msgUC     msg.UseCase
	clients   map[uuid.UUID]map[*websocket.Conn]uuid.UUID
	broadcast chan models.Message
	mutex     *sync.Mutex
}

func NewMsgHandlers(
	msgUC msg.UseCase, broadcast chan models.Message,
	clients map[uuid.UUID]map[*websocket.Conn]uuid.UUID,
	mutex *sync.Mutex,
) *msgHandlers {
	return &msgHandlers{
		msgUC:     msgUC,
		clients:   clients,
		broadcast: broadcast,
		mutex:     mutex,
	}
}

func (h *msgHandlers) Chat(c *websocket.Conn) {
	var (
		err error
		msg []byte
	)

	userID := c.Locals("userID").(uuid.UUID)
	chatID, err := uuid.Parse(c.Params("chatID"))
	if err != nil {
		slog.Error("can't parse chat id")
		return
	}

	isUserChat, err := h.msgUC.CheckIsUserChat(context.Background(), chatID, userID)
	if err != nil {
		slog.Error(
			"check is user chat", "chatID", chatID,
			"userID", userID, "error", err.Error(),
		)
		return
	}
	if !isUserChat {
		return
	}

	h.mutex.Lock()
	if _, ok := h.clients[chatID]; !ok {
		h.clients[chatID] = make(map[*websocket.Conn]uuid.UUID)
	}
	h.clients[chatID][c] = userID
	h.mutex.Unlock()

	for {
		if _, msg, err = c.ReadMessage(); err != nil {
			h.mutex.Lock()
			delete(h.clients[chatID], c)
			h.mutex.Unlock()

			slog.Error("read", "chatID", chatID, "senderID", userID, "error", err)
			break
		}
		inMsg := &models.Message{
			Time:     time.Now(),
			Body:     string(msg),
			SenderID: userID,
			ChatID:   chatID,
		}
		slog.Debug("read message", "userId", userID, "msg", inMsg)

		h.broadcast <- *inMsg
		h.msgUC.CreateMessage(context.Background(), inMsg)
	}
}

func (h *msgHandlers) WriteMessages() {
	for {
		inMsg := <-h.broadcast
		h.mutex.Lock()
		for client, userID := range h.clients[inMsg.ChatID] {
			if userID != inMsg.SenderID {
				if err := client.WriteJSON(inMsg); err != nil {
					client.Close()
					delete(h.clients[inMsg.ChatID], client)
				}
			}
		}
		h.mutex.Unlock()
		slog.Debug("write message", "senderId", inMsg.SenderID, "msg", inMsg.Body)
	}
}
