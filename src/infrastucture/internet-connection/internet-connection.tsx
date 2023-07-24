import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {IndexStyle} from '../../../public/styles/index.style';

const InternetConnectionComponent = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleRefresh = () => {
    // Ваша логика запроса данных здесь
    // Например, использование fetch или другого HTTP-клиента
    // При успешном ответе с кодом 200 можно сделать setIsConnected(false);
  };

  const renderMessage = () => {
    if (!isConnected) {
      return (
        <View
          style={{
            backgroundColor: '#44454F',
            borderRadius: 10,
            marginLeft: 20,
          }}>
          <View style={[IndexStyle.RowFlexCenter, {margin: 10}]}>
            <Image
              source={require('../../../public/images/warningpng.png')}
              style={{width: 25, height: 25, marginTop: 3}}
            />
            <Text style={styles.errorText}> Нема доступу до мережі</Text>
          </View>
        </View>
      );
    } else {
      // Здесь можно разместить другое сообщение или информацию, когда все в порядке
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleRefresh}>
        {renderMessage()}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    margin: 10,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
});

export default InternetConnectionComponent;
