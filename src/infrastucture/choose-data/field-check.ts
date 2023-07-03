/* eslint-disable react-hooks/rules-of-hooks */
import {useState} from 'react';

export const handleCheckBoxChange = ({name, value}) => {
  const [checkGlassThread, setCheckGlassThread] = useState(false);
  const [checkStabilizerTubeDiameter, setCheckStabilizerTubeDiameter] =
    useState(false);
  const [checkConditionStabilizerWings, setCheckConditionStabilizerWings] =
    useState(false);
  const [checkStabilizerTubeGluten, setCheckStabilizerTubeGluten] =
    useState(false);
  const [checkStabilizerWingBeating, setCheckStabilizerWingBeating] =
    useState(false);
  const [checkAlignment, setCheckAlignment] = useState(false);
  const [stabilizerWingBeatСontrol, setStabilizerWingBeatСontrol] =
    useState(false);
  const [isWater, setIsWater] = useState(false);

  switch (name) {
    case 'checkGlassThread':
      setCheckGlassThread(value);
      break;
    case 'checkStabilizerTubeDiameter':
      setCheckStabilizerTubeDiameter(value);
      break;
    case 'checkConditionStabilizerWings':
      setCheckConditionStabilizerWings(value);
      break;
    case 'checkStabilizerTubeGluten':
      setCheckStabilizerTubeGluten(value);
      break;
    case 'checkStabilizerWingBeating':
      setCheckStabilizerWingBeating(value);
      break;
    case 'checkAlignment':
      setCheckAlignment(value);
      break;
    case 'isWater':
      setIsWater(value);
      break;
    case 'stabilizerWingBeatСontrol':
      setStabilizerWingBeatСontrol(value);
      break;
    default:
      break;
  }

  return (
    checkGlassThread,
    checkStabilizerTubeDiameter,
    checkConditionStabilizerWings,
    checkStabilizerTubeGluten,
    checkStabilizerWingBeating,
    checkAlignment,
    isWater,
    stabilizerWingBeatСontrol
  );
};
