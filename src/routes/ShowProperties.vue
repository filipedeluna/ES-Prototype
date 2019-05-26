<template>
  <div class="showproperties">
    <div class="mainBody">
      <div class="propertiestitle">
        Showing {{ totalRows }} accomodations near {{ searchData.destination }}.
      </div>
      <div class="propertyfilters">
        <b-form-checkbox button class="propertyfilters2" v-model="filters.wifi" size="lg">Wifi</b-form-checkbox>
        <b-form-checkbox button class="propertyfilters2" v-model="filters.pets" size="lg">Pets</b-form-checkbox>
        <b-form-checkbox button class="propertyfilters2" v-model="filters.smokers" size="lg">Smokers</b-form-checkbox>
        <b-form-checkbox button class="propertyfilters2" v-model="filters.cleaning" size="lg">Cleaning</b-form-checkbox>
        <b-form-select class="propertyfilters2" size="lg" v-model="filters.order" :options="['Price ascending', 'Price descending']">
          <option slot="first" :value="null">Sort results</option>  
        </b-form-select>        
        <b-form-select class="propertyfilters2" size="lg" v-model="filters.rooms" :options="['1+', '2+', '3+', '4+','5+']">
          <option slot="first" :value="null">Number of rooms</option>  
        </b-form-select>       
        <b-form-select class="propertyfilters2" size="lg" v-model="filters.score" :options="['1+', '2+', '3+', '4+','5']">
          <option slot="first" :value="null">Score</option>  
        </b-form-select>  
        <b-form-select class="propertyfilters2" size="lg" v-model="filters.distance" :options="['5km', '10km', '15km','+15km']">
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
              {{ property.name }} in {{ searchData.destination }}
            </div>
              <ul class="propertylist">
                <li class="propertylistitem">{{ property.distance }} km from {{ searchData.destination }} center.</li>
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
              <b-button @click="verifyLogged(property)" size="lg">Book now!</b-button>
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
    <!-- BOOK MODAL -->
    <b-modal id="book-modal" title="Book Accomodation" centered>

      <span class="bookModalTitle"> {{chosenProperty.name }} in {{ searchData.destination }}.</span>

      <div class="modalpropertypic">
        <b-img :src="chosenProperty.picture" fluid rounded></b-img>
      </div>

      <div class="bookModalPropertylist">
        <span class="bookModalDetails">Accomodation details:</span>
        <ul>
          <li class="bookModalPropertylistItem">{{ chosenProperty.distance }} km from {{ searchData.destination }} center.</li>
          <li class="bookModalPropertylistItem">{{ chosenProperty.rooms }} rooms.</li>
          <li class="bookModalPropertylistItem" v-if="chosenProperty.wifi">Wi-fi access.</li>
          <li class="bookModalPropertylistItem" v-if="chosenProperty.pets">Pets allowed.</li>
          <li class="bookModalPropertylistItem" v-if="chosenProperty.smokers">Smokers allowed.</li>
          <li class="bookModalPropertylistItem" v-if="chosenProperty.cleaning">Cleaning included.</li>
          <li class="bookModalPropertylistItem" v-if="chosenProperty.guests">Guests allowed.</li>
          <li class="bookModalPropertylistItem" v-if="chosenProperty.garage">Garage.</li>
        </ul>
      </div>

      <div class="bookModalOrderlist">

        <div class="material-icons propertyscore">
          <div  v-for="index in chosenProperty.score" v-bind:key="index+'c'">
            <i class="material-icons propertystar">star</i>
          </div>
          <div  v-for="index in 5 - chosenProperty.score" v-bind:key="index+'d'">
            <i class="material-icons propertystar">star_border</i>
          </div>
          <div class="propertyreviewnumber">
            Based on {{ chosenProperty.reviews }} reviews.
          </div>
        </div>

        <span class="bookModalDetails">Order details:</span>
        <ul>
          <li class="bookModalOrderlistItem">Checkin date: {{ searchData.checkin.format('L') }}.</li>
          <li class="bookModalOrderlistItem">Checkout date: {{ searchData.checkOut.format('L') }}.</li>
          <li class="bookModalOrderlistItem">Number of adults: {{ searchData.adults }}.</li>
          <li class="bookModalOrderlistItem">Number of children: {{ searchData.children }}.</li>
          <li class="bookModalOrderlistItem">Total days: {{ searchData.checkOut.diff(searchData.checkin, 'days') + 1 }}.</li>
        </ul>
      </div>

      <div class="bookModalTotal">
        Total:
        <br>
        <span class="bookModalTotalPrice">{{ calculateTotalPrice(searchData.adults, searchData.children, chosenProperty.price, searchData.checkOut.diff(searchData.checkin, 'days') + 1) }} €</span>        
      </div>

      <template slot="modal-footer" slot-scope="{ ok }">
        <b-button size="lg" @click="verifyProperty(ok, { chosenProperty, searchData })">
          Add to cart
        </b-button>
      </template>
    </b-modal>
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
    if (!this.$store.getters.wasPropertySearched)
      this.$router.push('/');
  },
  data() {
    return {
      currentPage: 1,
      perPage: 5,
      searchData: this.$store.getters.lastPropertySearched,
      properties: this.$store.getters.generateProperties,
      filteredProperties: this.$store.getters.generateProperties,
      filters,
      chosenProperty: {
        score: 3
      }
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
      
      return (costPerDay * adultsFix + costPerDay * 0.5 * children) * days;
    }
  },
  computed: {
    getFilteredProperties() {
      this.filteredProperties = R.filter(property => 
        (!this.filters.wifi     || property.wifi ===     this.filters.wifi)     &&
        (!this.filters.pets     || property.pets ===     this.filters.pets)     &&
        (!this.filters.smokers  || property.smokers ===  this.filters.smokers)  &&
        (!this.filters.cleaning || property.cleaning === this.filters.cleaning) &&
        checkRooms(this.filters.rooms, property.rooms) &&
        checkScore(this.filters.score, property.score) &&
        checkDistance(this.filters.distance, property.distance)
      , this.properties);

      if(this.filters.order != null) {
        if (this.filters.order == 'Price ascending')
          this.filteredProperties = 
            R.sort((a, b) => a.price - b.price, this.filteredProperties);

        if (this.filters.order == 'Price descending')
          this.filteredProperties = 
            R.sort((a, b) => b.price - a.price, this.filteredProperties);
      }

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
  formValue == '+15km' && propertyDistance > 15 ||
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

.modalpropertypic {
  width: 280px;
  float: left;
}

.bookModalPropertylist {
  float: left;
  margin-left: 10px;
}

#book-modal .modal-dialog {
  max-width: 600px; 
}

.bookModalDetails {
  float: left;
  font-size: 26px;
  width: 100%;
}

.bookModalPropertylistItem {
  margin-left: -10px;
  line-height: 30px;
}

.bookModalTitle {
  float: left;
  font-size: 26px;
  width: 100%;
  font-weight: 700;
  margin-bottom: 15px;
}

.bookModalOrderlist {
  float: left;
}

.bookModalOrderlistItem {
  margin-left: -10px;
  line-height: 30px;
}

.bookModalTotal {
  font-size: 30px;
  color: #007bff;
  float: left;
  line-height: 35px;
  margin-right: 50px;
  margin-top: 200px;
}

.bookModalTotalPrice {
  font-size: 42px;
  font-weight: 700;
  color: #007bff;
  margin-left: 10px;
}
</style>
