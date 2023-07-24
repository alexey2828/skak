import {useEffect, useState} from 'react';
import {RouteProps} from '../../../domains/projectile-and-mine-120/interface/route-interface';
import {Text, View} from 'react-native';
import { styles } from '../../../../styles';
import { IndexStyle } from '../../../../public/styles/index.style';

export const Header = ( route ) => {
    console.log(route)
  return (
    <>
      <View style={{width: '100%', height: 65, backgroundColor: '#44454F'}}>
        <View style={{marginLeft: 10}}>
            <Text style={IndexStyle.TopTitle}>header</Text>
        </View>
      </View>
    </>
  );
};
