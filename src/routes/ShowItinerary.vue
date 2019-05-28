<template>
  <div class="showitinerary">
    <div class="mainBody">
      <div class="itinerariestitle">
        Choose what attractions you wish to visit in {{ searchData.destination }}.
      </div>
      <div class="itineraryTotalCost">
        Total Cost: <span class="itineraryTotalCostPrice" v-bind:class="{ itineraryTotalCostPriceRed: overBudget }"> {{ totalCost }} €. </span>
      </div>
      <div class="showItineraries">
        <b-card
          :img-src="attraction.picture"
          img-top
          tag="article"
          style="max-width: 16rem;"
          class="showItinerariesCard"
          v-for="attraction in paginate(randomAttractions)"
          v-bind:key="attraction.id"
          @click="pickAttraction(attraction.id)"
          v-bind:class="{ attractionPicked: isPicked(attraction.id) }"
        >
          <div v-if="isPicked(attraction.id)" class="itineraryPickedOverlay">
            <b-img class="itineraryPickedOverlayImage" src="checkedImage.png"/>
          </div>

          <b-card-text class="showItinerariesCardText" >
            <div style="font-size: 22px; margin-botom: 25px;">{{ attraction.name }}</div>
            <div class="showItinerariesCardSore">
              <div  v-for="index in attraction.score" v-bind:key="index+'a'">
                  <i class="material-icons itinerariesstar">star</i>
                </div>
                <div  v-for="index in 5 - attraction.score" v-bind:key="index+'b'">
                  <i class="material-icons itinerariesstar">star_border</i>
              </div>
              <br>
              <span class="itineraryPrice">
                <span style="color: black; font-size: 20px;">
                  {{attraction.price}} € * {{searchData.adults + searchData.children * 0.5}}
                </span>
                <br>
                {{actualPrice(attraction.price)}} €
              </span>
            </div>
          </b-card-text>
        </b-card>
      </div>

  
      <b-pagination
        :total-rows="randomAttractions.length" 
        v-model="currentPage"
        :per-page="perPage"
        style="width: 10%; margin: auto;"
      />

      <b-button class="itineraryLeftBtn" variant="success" size="lg" @click="() => this.$bvModal.show('premadeItinerary-modal')"> 
        Check out our discounted itineraries
      </b-button> 

      <b-button 
        class="itineraryRightBtn"
        v-if="!overBudget"
        variant="primary" size="lg"
        @click="addItineraryToCart(ok)"
      > 
        Build itinerary with chosen attractions
      </b-button> 
      <b-button 
        class="itineraryRightBtn"
        v-if="overBudget"
        variant="danger" size="lg"
        @click="() => this.$bvModal.show('confirmItinerary-modal')"
      > 
        Build itinerary with chosen attractions
      </b-button> 
    </div>

    <!-- confirm BUY ITINERARY MODAL -->
    <b-modal id="confirmItinerary-modal" title="Confirm Itinerary" size="lg" centered>
        The total cost of the chosen itinerary is {{ totalCost }}€.
        <br>
        <br>
        This amount is {{ totalCost - searchData.budget }}€ over your initial budget of {{  searchData.budget }}€.
        <br>
        <br>
        Do you wish to continue and add it to your cart?
      <template slot="modal-footer" slot-scope="{ ok }">
        <b-button @click="addItineraryToCart(ok)">
          Book itinerary
        </b-button>
      </template>
    </b-modal>

      <!-- BUY PACK MODAL -->
    <b-modal id="premadeItinerary-modal" title="Buy discounted itinerary" size="xl" centered>
      <div class="premadeItineraries">
        <div class="premadeItinerary" v-for="pack in buildPacks" v-bind:key="pack.discount"> 
          <b-img class="premadeItineraryPic" :src="pack.pic"/>
          <ul class="premadeItineraryAttractions">
            <li v-for="attraction in pack.attractions" v-bind:key="attraction+pack.discount">
              {{ Attractions[attraction].name }}
            </li>
          </ul>

          <div class="premadeItinerartTitleAndPrice">
            <div class="premadeItinerartTitle">
              {{ pack.name }}
            </div>
            <div class="premadeItineraryPrice">
              <span style="text-decoration: line-through;font-size: 22px;"> {{ pack.price }} €</span>
              <span style="font-size: 44px; color: #007bff;"> {{ applyDiscountOnPack(pack) }} €</span>
              <br>
              <br>
              <span style="font-size: 28px;"> {{ pack.discount }}% OFF</span>
            </div>
          </div>
          <div class="premadeItineraryBuy">
            <b-button @click="addPremadeItineraryToCart(pack)" v-if="applyDiscountOnPack(pack) > searchData.budget" block variant="danger" size="lg">Buy now</b-button>
            <b-button @click="addPremadeItineraryToCart(pack)" v-if="applyDiscountOnPack(pack) <= searchData.budget" block variant="success" size="lg">Buy now</b-button>
          </div>
        </div>
        
        
        
          <!--
          <b-card
          :img-src="attraction.picture"
          img-top
          tag="article"
          style="max-width: 8rem;"
          class="showItinerariesCard"
          v-for="attraction in paginate(randomAttractions)"
          v-bind:key="attraction.id"
          @click="pickAttraction(attraction.id)"
          v-bind:class="{ attractionPicked: isPicked(attraction.id) }"
        -->
      </div>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-button @click="close()">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import * as R from 'ramda';

import { Attractions } from '../data/attractionData';
import { Cities } from '../data/appData';

let dummySearch = { 
  destination: 'Paris',
  budget: 100,
  adults: 3,
  children: 1
}

let pickedAttractions = [];

export default {
  name: 'ShowItinerary',
  beforeMount(){
    //if (!this.$store.getters.wasPropertySearched)
      //this.$router.push('/');
  },
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      searchData: this.$store.getters.lastPropertySearched || dummySearch,
      chosenProperty: {
        score: 3
      },
      pickedAttractions,
      Attractions
    }
  },
  methods: {
    verifyLogged(property) {
      if (!this.$store.getters.isLogged) {
        createToast(this.$bvToast, 'Please login to book an itinerary.', 'danger');
        return;
      }

      this.chosenProperty = property;
      this.$bvModal.show('book-modal');
    },
    verifyProperty(ok, property) {
      this.$store.commit('addToCart', property);

      createToast(this.$bvToast, 'Itinerary added to cart.', 'success');
      this.$router.push('/');      
      ok();
    },
    getYesOrNo(val) {
      return val ? 'Yes' : 'No';
    },
    calculateTotalPrice(adults, children, costPerDay, days) {
      let adultsFix = adults != null ? adults : 0;
      let childrenFix = children != null ? children : 0;
      
      return (costPerDay * adultsFix + costPerDay * 0.5 * childrenFix) * days;
    },
    paginate(attractions) {
      return attractions.slice(
        (this.currentPage - 1) * this.perPage, 
        this.currentPage * this.perPage);
    },
    pickAttraction(attractionId) {
      if (!R.includes(attractionId, this.pickedAttractions))
        this.pickedAttractions.push(attractionId);
      else
        this.pickedAttractions = R.filter(id => id !== attractionId, this.pickedAttractions);
    },
    isPicked(attractionId) {
      return R.includes(attractionId, this.pickedAttractions);
    }, 
    actualPrice(base) {

      return base * (this.searchData.adults + this.searchData.children * 0.5);
    },
    addItineraryToCart(ok) {
      if (!this.$store.getters.isLogged) {
        createToast(this.$bvToast, 'Please login to book an itinerary.', 'danger');
        return;
      }

      this.$store.commit('addToCart', {
        fixedName: this.searchData.destination + ' custom itinerary',
        totalPrice: this.totalCost,
        price: 'N/A',
        ...this.searchData
      });

      createToast(this.$bvToast, 'Itinerary added to cart.', 'success');
      this.$router.push('/');      
      ok();
    },
    addPremadeItineraryToCart(pack) {
      if (!this.$store.getters.isLogged) {
        createToast(this.$bvToast, 'Please login to book an itinerary.', 'danger');
        return;
      }

      this.$store.commit('addToCart', {
        fixedName: this.searchData.destination + ' ' + pack.name,
        totalPrice: this.applyDiscountOnPack(pack),
        price: 'N/A',
        ...this.searchData
      });

      createToast(this.$bvToast, 'Itinerary added to cart.', 'success');
      this.$router.push('/');      
    }, 
    applyDiscountOnPack(pack) {
      return (pack.price - pack.price * pack.discount / 100).toFixed(0)
    }
  },
  computed: {
    location() {
      return this.$route.params.location;
    },
    totalRows() {
      return this.filteredProperties.length;
    },
    randomAttractions() {
      let cities = [];
      let blacklistedCities = [];

      let attractions  = [];
      let blacklistedAttractions = [];

      let random;

      for (let i = 0; i < 20; i++) {
        do
          random = Math.floor(Math.random() * Cities.length);
        while (blacklistedCities.includes(random));

        blacklistedCities.push(random);
        cities.push({ city: Cities[random] });
      }

      for (let i = 0; i < 20; i++) {
        do
          random = Math.floor(Math.random() * Attractions.length);
        while (blacklistedAttractions.includes(random));

        blacklistedAttractions.push(random);
        attractions.push( { ...Attractions[random], ...cities[random] });

      }
      
      return attractions;
    },
    totalCost() {
      return R.reduce(
        (a, attraction) => 
          a + fixPrice(this.searchData, Attractions[attraction - 1].price)
        , 0
        , this.pickedAttractions);
    },
    overBudget() {
      return this.totalCost > this.searchData.budget
    },
    buildPacks() {
      const PICFOLDER = 'pictures/itineraries/';

      const adventurerAttractions = getRandomEntries(Attractions, 4);
      const conquerorAttractions = getRandomEntries(Attractions, 3);
      const explorerAttractions = getRandomEntries(Attractions, 5);

      const adventurerOriginalPrice = R.reduce((a, entry) => a + Attractions[entry].price, 0, adventurerAttractions); 
      const conquerorOriginalPrice = R.reduce((a, entry) => a + Attractions[entry].price, 0, conquerorAttractions); 
      const explorerOriginalPrice = R.reduce((a, entry) => a + Attractions[entry].price, 0, explorerAttractions); 

      const adventurerFixed = fixPrice(this.searchData, adventurerOriginalPrice);
      const conquerorFixed = fixPrice(this.searchData, conquerorOriginalPrice);
      const explorerFixed = fixPrice(this.searchData, explorerOriginalPrice);
      
      const packs = [
        {
          name: 'Adventurer Pack',
          pic: PICFOLDER + 'adventurer.jpg',
          discount: 33,
          attractions: getRandomEntries(Attractions, 4),
          price: adventurerFixed
        },
        {
          name: 'Conqueror Pack',
          pic: PICFOLDER + 'conqueror.jpg',
          discount: 25,
          attractions: getRandomEntries(Attractions, 3),
          price: conquerorFixed
        },
        {
          name: 'Explorer Pack',
          pic: PICFOLDER + 'explorer.jpg',
          discount: 40,
          attractions: getRandomEntries(Attractions, 5),
          price: explorerFixed
        }
      ];

      return packs;
    }
  }
}

const getRandomEntries = (array, quantity) => {
  const result = [];
  let random;

  for (let i = 0; i < quantity; i++) {
    do
      random = Math.floor(Math.random() * array.length);
    while (result.includes(random));

    result.push(random);
  }

  return result;
};

const fixPrice = (data, base) =>
  base * (data.adults + data.children * 0.5)

// HELPER 
const createToast = (bv, text, type) => {
  bv.toast(text, {
    autoHideDelay: 3000,
    variant: type,
    solid: true
  });
}
</script>

<style>
.showItineraries {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  width: 90%;
  flex-direction: row;
  align-items: center;
  margin: auto;
  justify-content: center;
}

.showItinerariesCard {
  margin-right: 15px;
  margin-left: 15px;
  margin-bottom: 30px;
}

.showItinerariesCardText {
  text-align: center;
  font-size: 18px;
}

.itineraryPickedOverlay {
  z-index: 1000;
  width: 255px;
  height: 255px;
  background-color: #6c757da2;
  position: absolute;
  border-radius: 2px;
  top: 0;
  left: 0;
}

.itineraryPickedOverlayImage {
  width: 130px;
  margin-left: 65px;
  margin-top: 65px;
}

.showItinerariesCardSore {
  width: 70%;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;

}

.itinerariesstar {
  font-size: 8px;
  color: rgb(236, 201, 0);
  text-shadow:
   -1px -1px 0 #000,  
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}

.itineraryPrice {
  font-size: 26px;
  color: #007bff;
}

.itinerariestitle {
  padding-left: 60px;  
  font-size: 32px;
  margin-bottom: 30px;
  width: 60%;
  float: left;
}

.itineraryTotalCost{
  float: right;
  font-size: 32px;
  padding-right: 60px;  
}

.itineraryTotalCostPrice {
  color: #28a745;

}

.itineraryTotalCostPriceRed {
  color: #dc3545;
}

.itineraryRightBtn {
  float: right;
  margin-right: 80px;
  position: relative;
  top: -40px;
}

.itineraryLeftBtn {
  float: left;
  margin-left: 80px;
  position: relative;
  top: -40px;
}

.premadeItineraries {
  width: 100%;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.premadeItineraryPic {
  width: 140px;
  float: left;
}

.premadeItinerary { 
  width: 1200px;;
  height: 180px;
  background-color:#e6e6e6;
  padding-left: 20px;
  padding-top: 20px;
  margin-bottom: 20px;
  margin-left: 70px;
  margin-right: 70px;
  border-radius: 10px;
}

.premadeItineraryAttractions{
  float: left;
  font-size: 16px;
  width: 190px;
}

.premadeItinerartTitleAndPrice {
  float: left;
  padding-left: 40px;
  width: 300px;
}

.premadeItinerartTitle {
  width: 100%;
  font-size: 30px;
  font-weight: 700;
  line-height: 10px;
  margin-bottom: 20px;
}

.premadeItineraryPrice {
  padding-top: 20px;
  line-height: 24px;
  font-size: 18px;
}

.premadeItineraryBuy {
  float: right;
  width: 200px;
  padding-right: 40px;
  padding-top: 90px;
}
</style>
