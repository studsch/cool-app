package main

import (
	"flag"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

type miniClient map[string]map[string]*websocket.Conn

type ClientObject struct {
	GROUP string
	USER  string
	conn  *websocket.Conn
}

type BroadcastObject struct {
	MSG  string
	FROM ClientObject
}

var (
	clients    = make(miniClient)
	register   = make(chan ClientObject)
	broadcast  = make(chan BroadcastObject)
	unregister = make(chan ClientObject)
)

func removeClient(org string, user string) {
	if conn, ok := clients[org][user]; ok {
		delete(clients[org], user)
		conn.Close()
		if len(clients[org]) == 0 {
			delete(clients, org)
		}
	}
}

func socketHandler() {
	for {
		select {
		case client := <-register:
			if clients[client.GROUP] == nil {
				clients[client.GROUP] = make(map[string]*websocket.Conn)
			}
			clients[client.GROUP][client.USER] = client.conn
			log.Println("client registered:", client.GROUP, client.USER)

		case message := <-broadcast:
			for org, users := range clients {
				if org == message.FROM.GROUP {
					for user, conn := range users {
						if org != message.FROM.GROUP || user != message.FROM.USER {
							if err := conn.WriteMessage(websocket.TextMessage, []byte(message.MSG)); err != nil {
								log.Println("write error:", err)
								removeClient(org, user)
								conn.WriteMessage(websocket.CloseMessage, []byte{})
								conn.Close()
							}
						}
					}
				}
			}

		case client := <-unregister:
			removeClient(client.GROUP, client.USER)
			log.Println("client unregistered:", client.GROUP, client.USER)
		}
	}
}

func main() {
	app := fiber.New()
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			c.Locals("GROUP", string(c.Request().Header.Peek("GROUP")))
			c.Locals("USER", string(c.Request().Header.Peek("USER")))
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	go socketHandler()

	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		clientObj := ClientObject{
			GROUP: c.Locals("GROUP").(string),
			USER:  c.Locals("USER").(string),
			conn:  c,
		}
		defer func() {
			unregister <- clientObj
			c.Close()
		}()

		register <- clientObj

		for {
			messageType, message, err := c.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Println("read error:", err)
				}

				return
			}

			if messageType == websocket.TextMessage {
				broadcast <- BroadcastObject{
					MSG:  string(message),
					FROM: clientObj,
				}
			} else {
				log.Println("websocket mesage received of type", messageType)
			}
		}
	}))

	addr := flag.String("addr", ":8080", "http service address")
	flag.Parse()
	app.Listen(*addr)
}
