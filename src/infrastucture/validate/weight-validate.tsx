export const weightValidate = (
  weight: number,
  minWeight: number,
  maxWeight: number,
) => {
  if (weight > maxWeight) {
    return 'Вага вища за норму';
  } else if (weight < minWeight) {
    return 'Вага нижче за норму';
  } else {
    return null;
  }
};
