<template>
  <div class="showproperties">
    <div class="mainBody">
      <div class="propertiestitle">
        Showing {{ totalRows }} accomodations near {{ searchData.destination }}.
      </div>
      <div class="properties">
        <div class="property" v-for="property in properties" v-bind:key="property.id">
          <div class="propertypic">
              <b-img :src="property.picture" fluid rounded></b-img>
          </div>
          <div class="propertydata">
            <div class="propertytitle">
              {{ property.name }} in {{ searchData.destination }}
            </div>
              <ul class="propertylist">
                <li class="propertylistitem">{{ Math.floor((Math.random() * 10 )) + 1 }} km from {{ searchData.destination }} center.</li>
                <li class="propertylistitem">Rooms: {{ property.rooms }}</li>
                <li class="propertylistitem">Wi-fi Access: {{ randomYesNo() }}</li>
                <li class="propertylistitem">Pets Allowed: {{ randomYesNo() }}</li>
                <li class="propertylistitem">Smokers Allowed: {{ randomYesNo() }}</li>
                <li class="propertylistitem">Cleaning Included: {{ randomYesNo() }}</li>
                <li class="propertylistitem">Guests allowed: {{ randomYesNo() }}</li>
                <li class="propertylistitem">Garage: {{ randomYesNo() }}</li>
              </ul>
          </div>
         
          <div style="float: right;"> 
            <div class="material-icons propertyscore">
              <div  v-for="index in property.score" v-bind:key="index">
                <i class="material-icons propertystar">star</i>
              </div>
              <div  v-for="index in 5 - property.score" v-bind:key="index">
                <i class="material-icons propertystar">star_border</i>
              </div>
              <div class="propertyreviewnumber">
                Based on {{ Math.floor((Math.random() * 950 )) + 50 }} reviews.
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
      searchData: this.$store.getters.lastPropertySearched  
    }
  },
  methods: {
    verifyProperty(property) {
     
    },
    randomYesNo() {
      return Math.floor((Math.random() * 10 )) >= 4 ? 'Yes' : 'No';
    }
  },
  computed: {
    properties() {
      let properties = this.$store.getters.getProperties;
      return properties.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
    totalRows() {
      return this.$store.getters.getProperties.length;
    },
    location() {
      return this.$route.params.location;
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