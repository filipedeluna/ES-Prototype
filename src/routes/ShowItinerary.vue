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
              <span class="itineraryPrice">{{attraction.price}} €</span>
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

      <b-button class="itineraryLeftBtn" variant="success" size="lg"> 
        Check out our discounted itineraries
      </b-button> 

      <b-button 
        class="itineraryRightBtn"
        v-if="!overBudget"
        variant="primary" size="lg"
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
        The total cost of itinerary pack is {{ totalCost }}€.
        <br>
        <br>
        This amount is {{ totalCost - searchData.budget }}€ over your initial budget of {{  searchData.budget }}€.
        <br>
        <br>
        Do you wish to continue and add it to your cart?
      <template slot="modal-footer" slot-scope="{ ok }">
        <b-button @click="ok()">
          Login
        </b-button>
      </template>
    </b-modal>

      <!-- BUY PACK MODAL -->
    <b-modal id="login-modal" title="Login" centered>
     
      <template slot="modal-footer" slot-scope="{ ok }">
        <b-button @click="ok()">
          Login
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
  budget: 100
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
      pickedAttractions
    }
  },
  methods: {
    verifyLogged(property) {
      if (!this.$store.getters.isLogged) {
        createToast(this.$bvToast, 'Please login to book an accomodation.', 'danger');
        return;
      }

      this.chosenProperty = property;
      this.$bvModal.show('book-modal');
    },
    verifyProperty(ok, property) {
      this.$store.commit('addToCart', property);

      createToast(this.$bvToast, 'Accomodation added to cart.', 'success');
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
    addItineraryToCart() {

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
      return R.reduce((a, attraction) => a + Attractions[attraction - 1].price, 0, this.pickedAttractions);
    },
    overBudget() {
      return this.totalCost > this.searchData.budget
    }
  }
}

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
}

.itineraryLeftBtn {
  float: left;
  margin-left: 80px;
}
</style>
