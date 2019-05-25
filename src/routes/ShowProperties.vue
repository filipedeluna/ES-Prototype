<template>
  <div class="showproperties">
    <div class="mainBody">
      <div class="propertiestitle">
        Showing {{ totalRows }} accomodations near {{ /* searchData.destination */ }}.
      </div>
      <div class="propertyfilters">
        <b-form-checkbox button class="propertyfilters2" v-model="filters.wifi" size="lg">Wifi</b-form-checkbox>
        <b-form-checkbox button class="propertyfilters2" v-model="filters.pets" size="lg">Pets</b-form-checkbox>
        <b-form-checkbox button class="propertyfilters2" v-model="filters.smokers" size="lg">Smokers</b-form-checkbox>
        <b-form-checkbox button class="propertyfilters2" v-model="filters.cleaning" size="lg">Cleaning</b-form-checkbox>
        <b-form-select class="propertyfilters2" size="lg" v-model="filters.order" :options="['Price ascending', 'Price Descending']">
          <option slot="first" :value="null">Sort results</option>  
        </b-form-select>        
        <b-form-select class="propertyfilters2" size="lg" v-model="filters.rooms" :options="['1+', '2+', '3+', '4+','5+']">
          <option slot="first" :value="null">Number of rooms</option>  
        </b-form-select>       
        <b-form-select class="propertyfilters2" size="lg" v-model="filters.score" :options="['1+', '2+', '3+', '4+','5']">
          <option slot="first" :value="null">Score</option>  
        </b-form-select>  
        <b-form-select class="propertyfilters2" size="lg" v-model="filters.distance" :options="['5km', '10km', '15km','+20km']">
          <option slot="first" :value="null">Distance</option>  
        </b-form-select>   
      </div>
      <div class="properties">
        <div class="property" v-for="property in getFilteredProperties" v-bind:key="property.id">
          <div class="propertypic">
              <b-img :src="property.picture" fluid rounded></b-img>
          </div>
          <div class="propertydata">
            <div class="propertytitle">
              {{ property.name }} in {{ /* searchData.destination */ }}
            </div>
              <ul class="propertylist">
                <li class="propertylistitem">{{ property.distance }} km from {{ /* searchData.destination */ }} center.</li>
                <li class="propertylistitem">Rooms: {{ property.rooms }}</li>
                <li class="propertylistitem">Wi-fi Access: {{ getYesOrNo(property.wifi) }}</li>
                <li class="propertylistitem">Pets Allowed: {{ getYesOrNo(property.pets) }}</li>
                <li class="propertylistitem">Smokers Allowed: {{ getYesOrNo(property.smokers) }}</li>
                <li class="propertylistitem">Cleaning Included: {{ getYesOrNo(property.cleaning) }}</li>
                <li class="propertylistitem">Guests allowed: {{ getYesOrNo(property.guests) }}</li>
                <li class="propertylistitem">Garage: {{ getYesOrNo(property.garage) }}</li>
              </ul>
          </div>
         
          <div style="float: right;"> 
            <div class="material-icons propertyscore">
              <div  v-for="index in property.score" v-bind:key="index+'a'">
                <i class="material-icons propertystar">star</i>
              </div>
              <div  v-for="index in 5 - property.score" v-bind:key="index+'b'">
                <i class="material-icons propertystar">star_border</i>
              </div>
              <div class="propertyreviewnumber">
                Based on {{ property.reviews }} reviews.
              </div>
            </div>
            <div class="propertybook">
              <b-button @click="verifyProperty(property)" size="lg" >Book now!</b-button>
            </div>
          </div>
           <div class="propertyPrice">
            {{ property.price }} €<span style="font-size: 20px;">/day</span>
          </div>
        </div>

         <b-pagination
          :total-rows="totalRows" 
          v-model="currentPage"
          :per-page="perPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import * as R from 'ramda';

let filters = {
  wifi: false,
  pets: false,
  smokers: false,
  cleaning: false,
  order: null,
  rooms: null,
  score: null,
  distance: null
}

export default {
  name: 'ShowProperties',
  beforeMount(){
    //if (!this.$store.getters.wasPropertySearched)
      //this.$router.push('/');
  },
  data() {
    return {
      currentPage: 1,
      perPage: 5,
      searchData: this.$store.getters.lastPropertySearched,
      properties: this.$store.getters.generateProperties,
      filteredProperties: this.$store.getters.generateProperties,
      filters
    }
  },
  methods: {
    verifyProperty(property) {
      if (!this.$store.getters.isLogged) {
        createToast(this.$bvToast, 'Please login to book an accomodation.', 'danger');
        return;
      }
    },
    getYesOrNo(val) {
      return val ? 'Yes' : 'No';
    }
  },
  computed: {
    getFilteredProperties() {
      console.log(JSON.stringify(filters, null, 2));
      this.filteredProperties = R.filter(property => 
        (!this.filters.wifi     || property.wifi ===     this.filters.wifi)     &&
        (!this.filters.pets     || property.pets ===     this.filters.pets)     &&
        (!this.filters.smokers  || property.smokers ===  this.filters.smokers)  &&
        (!this.filters.cleaning || property.cleaning === this.filters.cleaning) &&
        checkRooms(this.filters.rooms, property.rooms) &&
        checkScore(this.filters.score, property.score) &&
        checkDistance(this.filters.distance, property.distance)
      , this.properties);

      return this.filteredProperties.slice(
        (this.currentPage - 1) * this.perPage, 
        this.currentPage * this.perPage
        );
    },
    location() {
      return this.$route.params.location;
    },
    totalRows() {
      return this.filteredProperties.length;
    },
  }
}

const checkRooms = (formValue, propertyRooms) =>
  formValue == '1+' && propertyRooms >= 1 ||
  formValue == '2+' && propertyRooms >= 2 ||
  formValue == '3+' && propertyRooms >= 3 ||
  formValue == '4+' && propertyRooms >= 4 ||
  formValue == '5+' && propertyRooms >= 5 ||
  formValue == null;

const checkScore = (formValue, propertyScore) =>
  formValue == '1+' && propertyScore >= 1 ||
  formValue == '2+' && propertyScore >= 2 ||
  formValue == '3+' && propertyScore >= 3 ||
  formValue == '4+' && propertyScore >= 4 ||
  formValue == '5'  && propertyScore == 5 ||
  formValue == null;

const checkDistance = (formValue, propertyDistance) =>
  formValue == '5km'  && propertyDistance <= 5  ||
  formValue == '10km' && propertyDistance <= 10 ||
  formValue == '15km' && propertyDistance <= 15 ||
  formValue == '20km' && propertyDistance >= 20 ||
  formValue == null;

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
.propertyfilters2 {
  margin-right: 10px;
  margin-left: 10px;
}

.propertyfilters {
  display: flex;
  margin-bottom: 10px;
}
</style>
