import Cart from '../routes/Cart';
import CreateTrip from '../routes/CreateTrip';
import SearchEvent from '../routes/SearchEvent';
import SearchProperty from '../routes/SearchProperty';
import RegisterProperty from '../routes/RegisterProperty';

export const Routes = [
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    id: 1
  }, 
  {
    path: '/createtrip',
    name: 'Create Trip',
    component: CreateTrip,
    id: 2
  }, 
  {
    path: '/searchevent',
    name: 'Search Event',
    component: SearchEvent,
    id: 3
  },
  {
    path: '/searchproperty',
    name: 'Search Property',
    component: SearchProperty,
    id: 4
  },
  {
    path: '/registerproperty',
    name: 'Register Property',
    component: RegisterProperty,
    id: 5
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