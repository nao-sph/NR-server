# NR-server
クライアントサイドからみたAPI
## SocketIO標準
### socket.connect()
これをやるとはじまるっぽい
### on "connect"
接続したら自動的に返ってくる
### data
配列になってるっぽい

## RoomManager
### emit "access"
nameを送る
on "waiting2P"か on "start_battle"で返ってくる
disconnect後復帰した場合を後で実装

### on "waiting2P"
人が揃うのを待っている状態を描画してねー

### on "start_battle"
バトル開始でページ遷移してねー

### on "return_to_battle"
後で

## BattleManager
基本的に体力の管理しかしない

### emit "command" //TODO
commandを送る (0:Atk, 1:Magi, 2:Brr, 3:Chrg)
両方揃ったら（？） on "turn_result"

### on "turn_result" //TODO
バトルステータス (0:continue, 1:p1 lose, 2:p2 lose, 3:draw)とともに
現在の敵味方の体力を返す
0以外のときはリザルト画面に遷移してねー
