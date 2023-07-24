/* eslint-disable react-native/no-inline-styles */
import {Image} from 'react-native';

export const NumberOfTheBeast = ({barcodeData}) => {
  if (barcodeData === '666666666666666666') {
    return (
      <Image
        source={require('../../../public/images/iron-maiden-run-to-the-hills.gif')}
        style={{
          width: '100%',
          marginTop: -5,
        }}
        resizeMode="contain"
      />
    );
  }
  return null;
};
