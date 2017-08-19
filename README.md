# NR-server
クライアントサイドからみたAPI  
送られてくるのはJSON

### emit "req_to_everyone"
data を送る  
on "to_everyone"で下の形式になって返ってくる  
{　　
  success: !err,　　
  msg: err ? err.message : null,　　
  data: data,　　
}
req_to_everyone', (data) => { // socketに繋がってる全員
  console.log('to_everyone', withError(data, null))
  socket.emit('to_everyone', withError(data, null))
})
socket.on('req_to_self', (data) => { // 送った本人のみ
  console.log('to_self', withError(data, null))
  io.to(socket.id).emit('to_self', withError(data, null))
})
socket.on('req_to_room', (data) => { // (roomが使われてる時のみ) 自分の所属するroomの全員
  console.log('to_room'

### emit "rm_access"
data を送る  
on "wait"か on "start_battle"がくる  
disconnect後復帰した場合を後で実装  

### on "rm_wait"
人が揃うのを待っている状態を描画してねー

### on "btl_start"
JSON形式[相手のname, 相手のcharaNum, stage番号]を受け取る  
バトル開始だよーページ遷移してねー

### on "btl_return"
復帰の実装。後で

## BattleManager
playerそれぞれのIDと、一つ前のコマンドを保持する

### emit "cmd_mine"
commandを送る (0~3)

### emit "cmd_timeup"
時間切れ。特に何も送らない

### on "cmd_enemy"
コマンドが双方出揃う、または一定時間経過で相手のコマンドが送られてくる  
時間切れ、通信が切れはランダム

### emit "btl_end"
バトルが終了したらこれを送ろう  
ルームを消す

## SocketIO標準
### socket.connect()
これをやるとはじまる予感
### on "connect"
接続したら自動的に返ってくる
### data
JSONが入ってるんじゃないかなー。たぶん  
でも配列っぽい？
