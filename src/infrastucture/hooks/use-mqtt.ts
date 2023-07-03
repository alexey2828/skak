/* eslint-disable @typescript-eslint/no-shadow */
import {useEffect, useState} from 'react';
import MQTT from 'sp-react-native-mqtt';
import {auth} from './const/mqtt-auth';

type UseMqtt<T> = {
  msgFromServer: string;
  mqttError: Error | null;
  onConnect: boolean;
  updateResponse: (uri: string, topic: string) => void;
  password?: string;
  userName?: string;
  clientId?: string;
};

export function useMqtt<T>(): UseMqtt<T> {
  const [msgFromServer, setMsgFromServer] = useState('{}'); //TMP VALUE
  const [mqttError, setError] = useState<any>();
  const [onConnect, setOnConnect] = useState<boolean>(false);
  const [uri, setUri] = useState<string>('');
  const [topic, setTopic] = useState<any>('TestPent');

  const updateResponse: UseMqtt<T>['updateResponse'] = (
    uri: string,
    topic: string,
  ) => {
    setUri(uri);
    setTopic(topic);
  };

  useEffect(() => {
    MQTT.createClient({
      uri: uri,
      clientId: auth.clientId,
      auth: true,
      user: auth.userName,
      pass: auth.password,
    })
      .then(function (client) {
        client.on('closed', function () {
          console.log('mqtt.event.closed');
        });

        client.on('error', function (msg) {
          setError(msg);
        });

        client.on('message', function (msg) {
          console.log('axxxxxx-->', msg.data);
          console.log('mqtt.event.message', msg);
          console.log('aaaaaaa', msg.data);
          setMsgFromServer(msg.data);
        });

        client.on('connect', function () {
          setOnConnect(true);
          client.subscribe(topic, 0);
        });
        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [uri, topic]);

  return {msgFromServer, mqttError, onConnect, updateResponse};
}
