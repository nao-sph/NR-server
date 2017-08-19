# NR-server
クライアントサイドからみたAPI  
送られてくるのはJSON

### emit "req_to_everyone"
data を送る  
**on "to_everyone"** で下の形式になって、*socketに繋がってる全員* に送られる  
{  
  "success": !err,  
  "msg": err ? err.message : null,  
  "data": data　
}  

### emit "req_to_self"
data を送る  
**on "to_self"** で下の形式になって、*自分自身のみ* に送られる  
{  
  "success": !err,  
  "msg": err ? err.message : null,  
  "data": data　
}  

### emit "req_to_room"
(roomが使われてる時のみ)   
data を送る  
**on "to_room"** で下の形式になって、*自分の所属するroomの全員* に送られる  
{  
  "success": !err,  
  "msg": err ? err.message : null,  
  "data": data　
}  

### emit "rm_access"
data を送る  
満員になった時のみ、**on "rm_full"** に送られる　　
{  
  "success": !err,  
  "msg": err ? err.message : null,  
  "data": data　
}  

## SocketIO標準(swift io client)
### socket.connect()
これを実行すると通信が始まる　　

### on "connect"
接続したら自動的に送られる　　

### data
JSONが入ってるんじゃないかなー。たぶん  
でも配列っぽい？
