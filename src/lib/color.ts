  // Color for the Customer Name
  export const getRandomColor = () => {
    const colors = [
      '#93c5fd', // blue-300
      '#86efac', // green-300
      '#d8b4fe', // purple-300
      '#f9a8d4', // pink-300
      '#a5b4fc', // indigo-300
      '#fde047', // yellow-300
      '#fca5a5', // red-300
      '#5eead4', // teal-300
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }