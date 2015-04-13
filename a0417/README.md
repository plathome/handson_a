AWS Hand-On session programs
============================

Target device = TI sensorTag (CC2541)

Node.jsを動かし、BLE経由でTI sensor tagのデータをKinesisへアップロードを体験できるハンズオンセッション用プログラムファイル

Requirements
------------

* curl >= 7.18
* node.js >= 0.11
* libbluetooth-dev >= 4.101
* aws-cli >= 1.7.19
* jq >= 1.3

INDEX
-----

`node-sensortag` `moment-timezone` を使います。 `npm install sandeepmistry/node-sensortag moment-timezone` を実行した上で、各プログラムを起動してください

※特にnode-sensortagはgithub上の最新版をインストールするようにしてください

* ti\_simplebutton.js : 上部ボタンのON/OFFを検知して表示
* ti\_simplebutton2kinesis.js : 上部ボタンのON/OFF状態をAWS Kinesisへアップロードする
* ti\_simplebutton\_and\_gyroscope.js : 上部ボタンのON/OFFと共に、ジャイロスコープ情報を表示しつづける

* diff/ : ti\_simplebutton.jsに対してのdiff

### decode\_kinesis\_records.js ###

`aws-cli kinesis get-records` のJSON出力を標準入力から読み込み、Base64decode等整形して表示する

Using: (stream-name = stub2の場合)

```
$ aws kinesis get-records --shard-iterator $(aws kinesis get-shard-iterator --stream-name stub2 --shard-id $(aws kinesis describe-stream --stream-name stub2 | jq -r ".StreamDescription.Shards[0].ShardId") --shard-iterator-type TRIM_HORIZON | jq -r ".ShardIterator") | node decode_kinesis_records.js
```

