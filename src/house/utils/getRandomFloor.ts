const getRandomFloor = (totalFloors: number) => {
  return Math.floor(Math.random() * totalFloors);
};

const getRandomDestinationFloor = (currentFloor: number, totalFloors: number) => {
    let destinationFloor = Math.floor(Math.random() * totalFloors);

    while (destinationFloor === currentFloor) {
      destinationFloor = Math.floor(Math.random() * totalFloors);
    }

    return destinationFloor;
}

export default (totalFloors:number) => {
    const currentFloor = getRandomFloor(totalFloors);
    
    return {
        currentFloor: getRandomFloor(totalFloors),
        destinationFloor: getRandomDestinationFloor(currentFloor, totalFloors),
    }
}