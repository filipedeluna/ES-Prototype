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
    id: 1
  }, 
  {
    path: '/createtrip',
    name: 'Create Itinerary',
    component: CreateTrip,
    id: 2
  }, 
  {
    path: '/searchevent',
    name: 'Search Events',
    component: SearchEvent,
    id: 3
  },
  {
    path: '/searchproperty',
    name: 'Search Accomodation',
    component: SearchProperty,
    id: 4
  },
  { // Se nao estiver logged, pede para registar
    path: '/registerproperty',
    name: 'Register Property',
    component: RegisterProperty,
    id: 5
  },
  { // Se nao estiver logged, pede para registar
    path: '/showProperties/:location',
    name: 'Show Properties',
    component: ShowProperties,
    id: 6
  }
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