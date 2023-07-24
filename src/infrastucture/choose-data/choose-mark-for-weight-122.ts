import {useEffect, useState} from 'react';

export const ChooseMarkForWeight122 = (weight: number) => {
  const [weightSign, setWeightSign] = useState('');
  useEffect(() => {
    if (weight > 21.92) {
      setWeightSign('+++++');
    } else if (weight >= 21.78 && weight < 21.92) {
      setWeightSign('++++');
    } else if (weight >= 21.64 && weight < 21.78) {
      setWeightSign('+++');
    } else if (weight >= 21.5 && weight < 21.64) {
      setWeightSign('++');
    } else if (weight >= 21.36 && weight < 21.5) {
      setWeightSign('+');
    } else if (weight >= 21.21 && weight < 21.36) {
      setWeightSign('Норма');
    } else if (weight >= 21.07 && weight < 21.21) {
      setWeightSign('-');
    } else if (weight >= 20.93 && weight < 21.07) {
      setWeightSign('- -');
    } else if (weight >= 20.79 && weight < 20.93) {
      setWeightSign('- - -');
    } else if (weight >= 20.65 && weight < 20.79) {
      setWeightSign('- - - -');
    } else if (weight < 20.79) {
      setWeightSign('- - - - -');
    }
  }, [weight]);

  return weightSign;
};
