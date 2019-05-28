<template>
  <div class="showitinerary">
    <div class="mainBody">
      <div class="propertiestitle">
        Choose what attractions  you wish to visit in {{ searchData.destination }}.
      </div>
      <div class="showItineraries">
        <b-card
          :img-src="attraction.picture"
          img-top
          tag="article"
          style="max-width: 17rem;"
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
            {{ attraction.name }}
            <br>
            <div class="showItinerariesCardSore">
              <div  v-for="index in attraction.score" v-bind:key="index+'a'">
                  <i class="material-icons itinerariesstar">star</i>
                </div>
                <div  v-for="index in 5 - attraction.score" v-bind:key="index+'b'">
                  <i class="material-icons itinerariesstar">star_border</i>
              </div>
              <br>
            </div>
          </b-card-text>
        </b-card>
      </div>

      <b-pagination
        :total-rows="randomAttractions.length" 
        v-model="currentPage"
        :per-page="perPage"
        />
        <br>
      <div class="propertiestitle">
        ... or check out our discounted packs.
      </div>
    </div>
  </div>
</template>

<script>
import * as R from 'ramda';

import { Attractions } from '../data/attractionData';
import { Cities } from '../data/appData';

let dummySearch = { 
  destination: 'Paris',
  budget: 9000
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
      perPage: 8,
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
  width: 270px;
  height: 270px;
  background-color: #6c757da2;
  position: absolute;
  border-radius: 2px;
  top: 0;
  left: 0;
}

.itineraryPickedOverlayImage {
  width: 150px;
  margin-left: 60px;
  margin-top: 60px;
}

.showItinerariesCardSore {
  width: 60%;
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

</style>
