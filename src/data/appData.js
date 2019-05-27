import Cart from '../routes/Cart';
import CreateTrip from '../routes/CreateTrip';
import SearchEvent from '../routes/SearchEvent';
import SearchProperty from '../routes/SearchProperty';
import RegisterProperty from '../routes/RegisterProperty';
import ShowProperties from '../routes/ShowProperties';

export const Routes = [
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    banner: false,
    id: 1
  }, 
  {
    path: '/createtrip',
    name: 'Create Itinerary',
    component: CreateTrip,
    banner: true,
    id: 2
  }, 
  {
    path: '/searchevent',
    name: 'Search Events',
    component: SearchEvent,
    banner: true,
    id: 3
  },
  {
    path: '/searchproperty',
    name: 'Search Accomodation',
    component: SearchProperty,
    banner: true,
    id: 4
  },
  { // Se nao estiver logged, pede para registar
    path: '/registerproperty',
    name: 'Register Property',
    component: RegisterProperty,
    banner: true,
    id: 5
  },
  { // Se nao estiver logged, pede para registar
    path: '/showProperties',
    name: 'Show Properties',
    component: ShowProperties,
    banner: false,
    id: 6
  },
  { // Redirect all garbage to home
    path: '*',
    redirect: '/searchproperty',
    component: ShowProperties,
    banner: false,
    id: 7
  },
]

export const DefaultCartItems = [
  {
    itemName: 'Airplane trip to Oslo',
    itemQuantity: 3,
    itemDate: new Date(),
    itemDetails: '',
    itemPrice: ''
  }
]

export const Cities = [
  'Hong Kong',
  'Bangkok',
  'London',
  'Singapore',
  'Macau',
  'Dubai',
  'Paris',
  'New York',
  'Shenzhen',
  'Kuala Lumpur',
  'Delhi',
  'Tokyo',
  'Rome',
  'Mumbai',
  'Mecca',
  'Istanbul',	 
  'Prague',
  'Miami',
  'Seoul',
  'Barcelona ',
  'Pattaya',
  'Shanghai',
  'Milan',
  'Cancún',
  'Agra',
  'Las Vegas', 
  'Amsterdam',
  'Antalya',
  'Denpasar',
  'Osaka',
  'Los Angeles',
  'Vienna',
  'Berlin',
  'Madrid',
  'Johor Bahru ',
  'Johannesburg',
  'Riyadh',
  'Ho Chi Minh',
  'Venice',
  'Orlando',
  'Chennai',
  'Jaipur',
  'Athens',
  'Dublin',
  'Florence',
  'Moscow',
  'Toronto',
  'Hanoi',
  'Beijing',
  'Ha Long',
  'Sydney',
  'Budapest',
  'Punta Cana',
  'San Francisco',
  'Jakarta',
  'Dammam',
  'Lisbon',
  'Zhuhai',
  'Heraklion',
  'Penang Island',
  'Cairo',
  'Copenhagen',
  'Kyoto',
  'Phnom Penh',
  'Munich',
  'Doha',
  'Chiang Mai',
  'Edirne',
  'Jerusalem'
];