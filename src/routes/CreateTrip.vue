<template>
  <div class="createtrip">
    <div class="mainBody">
      <div class="searchpropertytitle"> 
        Choose where to start you itinerary.
      </div>
      <br>
      <div class="createtripForm">
        <b-form inline>
          <b-input size="lg" v-model="formData.destination" class="searchPropertyinput" placeholder="Destination"/>
          <b-input size="lg" v-model="formData.checkIn" type="date" class="searchPropertyinput"/>
          <b-input size="lg" v-model="formData.checkOut" type="date" class="searchPropertyinput"/>
          <b-input-group append="€" style="width: 150px;">
            <b-input size="lg" v-model="formData.budget" placeholder="Budget" min="0"/>
          </b-input-group>
          <b-form-select         
            class="searchPropertyinput"
            placeholder="Username"
            :options="[1, 2, 3, 4, 5]"
            required
            size="lg"
            v-model="formData.adults"
            >
              <option slot="first" :value="null">Adults</option>
            </b-form-select>
            <b-form-select         
              class="searchPropertyinput"
              placeholder="Username"
              :options="[0, 1, 2, 3, 4, 5]"
              :value="null"
              required
              v-model="formData.children"
              size="lg" 
            >
              <option slot="first" :value="null">Children</option>
            </b-form-select>
          <b-button size="lg" variant="primary" @click="verifyData()">Start itinerary</b-button>
        </b-form>
      </div>
      <div class="searchpropertytitle2"> 
        Check out some of the top attractions:
      </div>
      <div class="searchpropertyrecommendations">
        <b-card
          :img-src="attraction.picture"
          img-top
          tag="article"
          style="max-width: 15rem;"
          class="searchpropertyrecommendationscard"
          v-for="attraction in randomAttractions"
          v-bind:key="attraction.id"
        >
          <b-card-text class="searchpropertyrecommendationscardtext" >
            {{ attraction.city }} {{ attraction.name }}
          </b-card-text>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import { Cities } from '../data/appData';
import { Attractions } from '../data/attractionData';

const formData = {
    destination: null,
    checkIn: null,
    checkOut: null,
    adults: null,
    children: null,
    budget: 0
  };

export default {
  name: 'CreateTrip',
  data() {
    return {
      Cities,
      Attractions,
      formData
    } 
  },
  methods: {
    verifyData() {
      if (formData.destination == null || 
          formData.destination.length < 3 || 
          formData.destination.length > 15) {
        createToast(this.$bvToast, 'Invalid destination.', 'danger');
        return;
      }
      
      if (formData.checkIn == null) {
        createToast(this.$bvToast, 'Invalid checkin date.', 'danger');
        return;
      }

      if (formData.checkOut == null) {
        createToast(this.$bvToast, 'Invalid checkout date.', 'danger');
        return;
      }

      if (formData.budget <= 0) {
        createToast(this.$bvToast, 'Invalid budget.', 'danger');
        return;
      }

      const now = moment();
      const fixedCheckInDate = moment(formData.checkIn);
      const fixedCheckOutDate = moment(formData.checkOut);

      
      if (fixedCheckInDate.isBefore(now)) {
        createToast(this.$bvToast, 'Invalid checkin date.', 'danger');
        return;
      }

      if (fixedCheckInDate.isBefore(now)) {
        createToast(this.$bvToast, 'Invalid checkout date.', 'danger');
        return;
      }

      if (fixedCheckOutDate.isBefore(fixedCheckInDate)) {
        createToast(this.$bvToast, 'Invalid checkin and checkout interval.', 'danger');
        return;
      }

      let fixedChildren = formData.children != null ? formData.children : 0;
      let fixedAdults = formData.adults != null ? formData.adults : 1;

      if (fixedAdults.adults > 5 || fixedAdults.adults < 1) {
        createToast(this.$bvToast, 'Invalid number of adullts.', 'danger');
        return;
      }

      if (fixedChildren.children > 5 || fixedChildren.children < 0) {
        createToast(this.$bvToast, 'Invalid number of children.', 'danger');
        return;
      }
      
      this.$store.commit('propertySearch', { 
        destination: formData.destination,
        checkin: fixedCheckInDate,
        checkOut: fixedCheckOutDate,
        children: fixedChildren,
        adults: fixedAdults,
        budget: formData.budget
      });

      this.$router.push('/showItinerary');
    }
  },
  computed: {
    randomAttractions() {
      let pickedCities = [];
      let blacklistedCities = [];

      let pickedAttractions  = [];
      let blacklistedAttractions = [];
      
      let random;

      for (let i = 0; i < 10; i++) {
        do
          random = Math.floor(Math.random() * Cities.length);
        while (blacklistedCities.includes(random));

        blacklistedCities.push(random);
        pickedCities.push({ city: Cities[random] });
      }

      for (let i = 0; i < 10; i++) {
        do
          random = Math.floor(Math.random() * Attractions.length);
        while (blacklistedAttractions.includes(random));

        blacklistedAttractions.push(random);
        pickedAttractions.push( { ...Attractions[random], ...pickedCities[random] });
      }
      return pickedAttractions;
    },
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
.searchproperty {
  margin-top: 14px;
}

.createtripForm {
  width: 100%;
  display: flex;
  justify-content: center;
}

.searchpropertytitle {
  font-size: 30px;
  padding-left: 60px;
}

.searchpropertytitle2 {
  font-size: 30px;
  padding-left: 60px;
  margin-top: 43px;
}

.searchpropertyrecommendations {
  margin-top: 50px;
  margin-left: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.searchpropertyrecommendationscard {
  margin-right: 40px;
  margin-bottom: 40px;
}

.searchpropertyrecommendationscardtext {
  text-align: center;
  font-size: 26px;
  font-weight: 500;
}
</style>
