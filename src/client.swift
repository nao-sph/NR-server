// NR-serverでは実装しないので、必要な機能の一覧として

import Foundation
import SocketIO

let socket = SocketIOClient(socketURL: URL(string: "http://localhost:3000")!, config: [.forceWebsockets(true)])

let name = "hoge"

socket.on("connect") { data, ack in
    print("socket connected")

    print("send message")
    socket.emit("access", name)
}
socket.on("waiting2P") { data, ack in
  print("waiting")
}

socket.on("from_server") { data, ack in
    if let msg = data[0] as? String {
        print("receive: " + msg)
    }
}

socket.connect()

CFRunLoopRun()
