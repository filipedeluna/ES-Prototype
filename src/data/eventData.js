const PICPATH = 'pictures/events/';

export const Events = [
  {
    id: 1,
    name: 'Tomorrowland',
    location: 'Belgium',
    tickets: 424,
    price: 600,
    days: 7,
    date: new Date(2019, 10, 5),
    picture: PICPATH + 'tomorrowland.jpg',
    site: 'https://www.tomorrowland.com'
  },
  {
    id: 2,
    name: 'Coachella',
    location: 'California',
    tickets: 4223,
    price: 900,
    days: 4,
    date: new Date(2019, 8, 16),
    picture: PICPATH + 'coachella.jpg',
    site: 'https://live.coachella.com'
  },
  {
    id: 3,
    name: 'Lollapalooza',
    location: 'Chicago',
    tickets: 30,
    price: 1500,
    days: 2,
    date: new Date(2019, 5, 20),
    picture: PICPATH + 'lollapalooza.jpg',
    site: 'https://www.lollapalooza.com'
  },
  {
    id: 4,
    name: 'Burning Man',
    location: 'Nevada',
    tickets: 870,
    price: 300,
    days: 10,
    date: new Date(2019, 8, 25),
    picture: PICPATH + 'burningman.jpg',
    site: 'https://burningman.org'
  },
  {
    id: 5,
    name: 'Carnaval',
    location: 'Rio de Janeiro',
    tickets: '-',
    price: '-',
    days: 6,
    date: new Date(2019, 1, 18),
    picture: PICPATH + 'carnaval.jpg',
    site: 'http://www.camara.rj.gov.br'
  },
  {
    id: 6,
    name: 'Electric Daisy Carnival',
    location: 'Las Vegas',
    tickets: 0,
    price: 760,
    days: 3,
    date: new Date(2019, 4, 3),
    picture: PICPATH + 'edc.jpg',
    site: 'https://lasvegas.electricdaisycarnival.com'
  },
]