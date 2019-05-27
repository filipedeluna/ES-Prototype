<template>
  <div class="searchproperty">
    <div class="mainBody">
      <div class="searchpropertytitle"> 
        Pick where you wish to go.
      </div>
      <br>
      <div class="searchPropertyForm">
        <b-form inline>
          <b-input size="lg" v-model="formData.destination" class="searchPropertyinput" placeholder="Destination"/>
          <b-input size="lg" v-model="formData.checkIn" type="date" class="searchPropertyinput"/>
          <b-input size="lg" v-model="formData.checkOut" type="date" class="searchPropertyinput"/>
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
          <b-button size="lg" variant="primary" @click="verifyData()">Search Acommodations</b-button>
        </b-form>
      </div>
      <div class="searchpropertytitle2"> 
        Check out some of the hottest destinations:
      </div>
      <div class="searchpropertyrecommendations">
        <b-card
          :img-src="property.picture"
          img-top
          tag="article"
          style="max-width: 15rem;"
          class="searchpropertyrecommendationscard"
          v-for="property in properties"
          v-bind:key="property.id"
        >
          <b-card-text class="searchpropertyrecommendationscardtext" >
            {{ randomCities[property.id] }}
          </b-card-text>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import { Cities } from '../data/appData';

const formData = {
    destination: null,
    checkIn: null,
    checkOut: null,
    adults: null,
    children: null
  };

export default {
  name: 'SearchProperty',
  data() {
    return {
      Cities,
      formData
    } 
  },
  methods: {
    verifyData() {
      if (formData.destination == null || 
          formData.destination.length < 3 || 
          formData.destination.length > 10) {
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
        checkin: fixedCheckInDate,
        checkOut: fixedCheckOutDate,
        destination: formData.destination,
        children: fixedChildren,
        adults: fixedAdults
        });

        this.$router.push('/showProperties');
    }
  },
  computed: {
    properties() {
      return this.$store.getters.getProperties;
    },
    randomCities() {
      let pickedCities = [];
      let blacklisted = [];

      for (let i = 0; i < 25; i++) {
        let random = Math.floor(Math.random() * Cities.length);
        while (blacklisted.includes(random)) {
          random = Math.floor(Math.random() * Cities.length);
        }

        blacklisted.push(random);
        pickedCities.push(Cities[random])
      }

      return pickedCities;
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

.searchPropertyForm {
  width: 100%;
  display: flex;
  justify-content: center;
}

.searchPropertyinput {
}

.searchpropertytitle {
  font-size: 30px;
  padding-left: 60px;
}

.searchpropertytitle2 {
  font-size: 30px;
  padding-left: 60px;
  margin-top: 50px;
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
