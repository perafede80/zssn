// Response Example
//[
// {"id":28,"name":"Survivor 4","age":59,"gender":"M","latitude":-79.2979,"longitude":-120.2295,"is_infected":false,"reports_count":0,"inventory":[{"item":"FOOD","quantity":22},{"item":"AMMUNITION","quantity":2},{"item":"WATER","quantity":3}]},
// {"id":30,"name":"Survivor 6","age":71,"gender":"M","latitude":69.9353,"longitude":55.2817,"is_infected":false,"reports_count":0,"inventory":[{"item":"MEDICATION","quantity":6},{"item":"WATER","quantity":10}]},
// {"id":31,"name":"Survivor 7","age":61,"gender":"O","latitude":54.2814,"longitude":124.735,"is_infected":false,"reports_count":0,"inventory":[{"item":"MEDICATION","quantity":4},{"item":"WATER","quantity":13}]},
// {"id":32,"name":"Survivor 8","age":42,"gender":"O","latitude":-22.0097,"longitude":-124.1504,"is_infected":false,"reports_count":0,"inventory":[{"item":"AMMUNITION","quantity":3},{"item":"WATER","quantity":20}]},
// {"id":33,"name":"Survivor 9","age":29,"gender":"O","latitude":63.0821,"longitude":77.7897,"is_infected":false,"reports_count":0,"inventory":[{"item":"AMMUNITION","quantity":6},{"item":"FOOD","quantity":9}]},
// {"id":34,"name":"Survivor 10","age":48,"gender":"F","latitude":14.887,"longitude":141.9497,"is_infected":false,"reports_count":0,"inventory":[{"item":"WATER","quantity":10},{"item":"AMMUNITION","quantity":7},{"item":"FOOD","quantity":5}]},
// {"id":27,"name":"Survivor 3","age":64,"gender":"O","latitude":1.7438,"longitude":89.0317,"is_infected":false,"reports_count":0,"inventory":[{"item":"AMMUNITION","quantity":6},{"item":"FOOD","quantity":2},{"item":"WATER","quantity":1}]},
// {"id":26,"name":"Survivor 2","age":65,"gender":"O","latitude":31.2115,"longitude":137.0103,"is_infected":false,"reports_count":1,"inventory":[{"item":"AMMUNITION","quantity":1},{"item":"FOOD","quantity":10},{"item":"WATER","quantity":8}]},
// {"id":29,"name":"Survivor 5","age":75,"gender":"O","latitude":33.4102,"longitude":30.271,"is_infected":false,"reports_count":0,"inventory":[{"item":"FOOD","quantity":0},{"item":"AMMUNITION","quantity":6},{"item":"WATER","quantity":3}]},
// {"id":25,"name":"Survivor 1","age":48,"gender":"F","latitude":74.4807,"longitude":-51.6802,"is_infected":false,"reports_count":1,"inventory":[{"item":"MEDICATION","quantity":5},{"item":"AMMUNITION","quantity":7}]}
// ]

export const mockFetchSurvivors = [
  {
    id: 28,
    name: 'Survivor 4',
    age: 59,
    gender: 'M',
    latitude: -79.2979,
    longitude: -120.2295,
    is_infected: false,
    reports_count: 0,
    inventory: [
      { item: 'FOOD', quantity: 22 },
      { item: 'AMMUNITION', quantity: 2 },
      { item: 'WATER', quantity: 3 },
    ],
  },
  {
    id: 30,
    name: 'Survivor 6',
    age: 71,
    gender: 'M',
    latitude: 69.9353,
    longitude: 55.2817,
    is_infected: false,
    reports_count: 0,
    inventory: [
      { item: 'MEDICATION', quantity: 6 },
      { item: 'WATER', quantity: 10 },
    ],
  },
];

export const mockCreateSurvivor = {
  id: 35,
  name: 'Fred',
  age: 45,
  gender: 'M',
  latitude: 78,
  longitude: 87,
  inventory: [
    { item: 'WATER', quantity: 1 },
    { item: 'FOOD', quantity: 1 },
    { item: 'MEDICATION', quantity: 1 },
    { item: 'AMMUNITION', quantity: 1 },
  ],
};

export const mockSurvivorTradeItems = {
  survivor_b_id: '2',
  items_from_a: { FOOD: 1, AMMUNITION: 1 },
  items_from_b: { WATER: 1 },
};

export const mockReportSurvivor = {
  reporter_id: '1',
  comments: 'Suspicious behavior',
};
