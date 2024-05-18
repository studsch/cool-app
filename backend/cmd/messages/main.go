package main

import (
	"fmt"
	"log"
	"sync"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

//
// import (
// 	"flag"
// 	"log"
//
// 	"github.com/gofiber/contrib/websocket"
// 	"github.com/gofiber/fiber/v2"
// )
//
// type miniClient map[string]map[string]*websocket.Conn
//
// type ClientObject struct {
// 	GROUP string
// 	USER  string
// 	conn  *websocket.Conn
// }
//
// type BroadcastObject struct {
// 	MSG  string
// 	FROM ClientObject
// }
//
// var (
// 	clients    = make(miniClient)
// 	register   = make(chan ClientObject)
// 	broadcast  = make(chan BroadcastObject)
// 	unregister = make(chan ClientObject)
// )
//
// func removeClient(org string, user string) {
// 	if conn, ok := clients[org][user]; ok {
// 		delete(clients[org], user)
// 		conn.Close()
// 		if len(clients[org]) == 0 {
// 			delete(clients, org)
// 		}
// 	}
// }
//
// func socketHandler() {
// 	for {
// 		select {
// 		case client := <-register:
// 			if clients[client.GROUP] == nil {
// 				clients[client.GROUP] = make(map[string]*websocket.Conn)
// 			}
// 			clients[client.GROUP][client.USER] = client.conn
// 			log.Println("client registered:", client.GROUP, client.USER)
//
// 		case message := <-broadcast:
// 			for org, users := range clients {
// 				if org == message.FROM.GROUP {
// 					for user, conn := range users {
// 						if org != message.FROM.GROUP || user != message.FROM.USER {
// 							if err := conn.WriteMessage(websocket.TextMessage, []byte(message.MSG)); err != nil {
// 								log.Println("write error:", err)
// 								removeClient(org, user)
// 								conn.WriteMessage(websocket.CloseMessage, []byte{})
// 								conn.Close()
// 							}
// 						}
// 					}
// 				}
// 			}
//
// 		case client := <-unregister:
// 			removeClient(client.GROUP, client.USER)
// 			log.Println("client unregistered:", client.GROUP, client.USER)
// 		}
// 	}
// }
//
// func main() {
// 	app := fiber.New()
// 	app.Use("/ws", func(c *fiber.Ctx) error {
// 		if websocket.IsWebSocketUpgrade(c) {
// 			c.Locals("allowed", true)
// 			c.Locals("GROUP", string(c.Request().Header.Peek("GROUP")))
// 			c.Locals("USER", string(c.Request().Header.Peek("USER")))
// 			return c.Next()
// 		}
// 		return fiber.ErrUpgradeRequired
// 	})
//
// 	go socketHandler()
//
// 	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
// 		clientObj := ClientObject{
// 			GROUP: c.Locals("GROUP").(string),
// 			USER:  c.Locals("USER").(string),
// 			conn:  c,
// 		}
// 		defer func() {
// 			unregister <- clientObj
// 			c.Close()
// 		}()
//
// 		register <- clientObj
//
// 		for {
// 			messageType, message, err := c.ReadMessage()
// 			if err != nil {
// 				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
// 					log.Println("read error:", err)
// 				}
//
// 				return
// 			}
//
// 			if messageType == websocket.TextMessage {
// 				broadcast <- BroadcastObject{
// 					MSG:  string(message),
// 					FROM: clientObj,
// 				}
// 			} else {
// 				log.Println("websocket mesage received of type", messageType)
// 			}
// 		}
// 	}))
//
// 	addr := flag.String("addr", ":8080", "http service address")
// 	flag.Parse()
// 	app.Listen(*addr)
// }

type Message struct {
	ChatID   string
	SenderID string
	Content  []byte
	MsgType  int
}

var (
	clients   = make(map[string]map[*websocket.Conn]string)
	broadcast = make(chan Message)
	mutex     = &sync.Mutex{}
)

func handl(c *websocket.Conn) {
	fmt.Println(c.Locals("allowed"))
	fmt.Println(c.Locals("accessToken"))
	fmt.Println(c.Params("chatId"))
	fmt.Println("ctx", c)

	chatID := c.Params("chatId")
	userID := c.Locals("userId").(string)

	mutex.Lock()
	if _, ok := clients[chatID]; !ok {
		clients[chatID] = make(map[*websocket.Conn]string)
	}
	clients[chatID][c] = userID
	mutex.Unlock()

	var (
		mt  int
		msg []byte
		err error
	)

	for {
		if mt, msg, err = c.ReadMessage(); err != nil {
			mutex.Lock()
			delete(clients[chatID], c)
			mutex.Unlock()

			fmt.Println("read:", err)
			break
		}
		m := &Message{
			ChatID:   chatID,
			SenderID: userID,
			Content:  msg,
			MsgType:  mt,
		}
		fmt.Println(mt, userID, string(msg))

		broadcast <- *m
	}
}

func handleMessages() {
	for {
		msg := <-broadcast
		mutex.Lock()
		for client, userID := range clients[msg.ChatID] {
			if userID != msg.SenderID {
				// if err := client.WriteMessage(msg.MsgType, msg.Content); err != nil {
				if err := client.WriteJSON(msg); err != nil {
					client.Close()
					delete(clients[msg.ChatID], client)
				}
			}
		}
		mutex.Unlock()
		fmt.Println(msg)
	}
}

func main() {
	app := fiber.New()

	app.Use("/chat", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			c.Locals("accessToken", string(c.Request().Header.Peek("token")))
			c.Locals("userId", string(c.Request().Header.Peek("userId")))
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/chat/:chatId", websocket.New(handl))
	go handleMessages()

	log.Fatal(app.Listen(":3000"))
}
