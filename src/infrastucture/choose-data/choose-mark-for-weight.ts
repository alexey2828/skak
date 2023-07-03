import {useEffect, useState} from 'react';

export const ChooseMarkForWeight = (weight: number) => {
  const [weightSign, setWeightSign] = useState('');
  useEffect(() => {
    if (weight > 15.98) {
      setWeightSign('+++++');
    } else if (weight >= 15.88 && weight < 15.98) {
      setWeightSign('++++');
    } else if (weight >= 15.78 && weight < 15.88) {
      setWeightSign('+++');
    } else if (weight >= 15.68 && weight < 15.78) {
      setWeightSign('++');
    } else if (weight >= 15.58 && weight < 15.68) {
      setWeightSign('+');
    } else if (weight >= 15.48 && weight < 15.58) {
      setWeightSign('Норма');
    } else if (weight >= 15.38 && weight < 15.48) {
      setWeightSign('-');
    } else if (weight >= 15.28 && weight < 15.38) {
      setWeightSign('- -');
    } else if (weight >= 15.18 && weight < 15.28) {
      setWeightSign('- - -');
    } else if (weight >= 15.08 && weight < 15.18) {
      setWeightSign('- - - -');
    } else if (weight < 15.08) {
      setWeightSign('- - - - -');
    }
  }, [weight]);

  return weightSign;
};
