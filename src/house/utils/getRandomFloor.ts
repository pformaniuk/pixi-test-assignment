const getRandomFloor = (totalFloors: number) => {
  return Math.floor(Math.random() * totalFloors);
};

const getRandomDestinationFloor = (
  currentFloor: number,
  totalFloors: number,
) => {
  return (
    (currentFloor + 1 + Math.floor(Math.random() * (totalFloors - 1))) %
    totalFloors
  );
};

export default (totalFloors: number) => {
  const currentFloor = getRandomFloor(totalFloors);

  return {
    currentFloor,
    destinationFloor: getRandomDestinationFloor(currentFloor, totalFloors),
  };
};