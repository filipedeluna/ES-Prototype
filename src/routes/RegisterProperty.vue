<template>
  <div class="registerproperty">
    <div class="mainBody">
      <div class="searcheventstitle"> 
        Register your property
      </div>
      <div class="registerPropertyForm">
        <div class="regPropInputLabel">Property title:</div>
        <div><b-input size="lg" v-model="formData.name" type="text" placeholder="Property title"/></div>
        <br>
        <div class="regPropInputLabel">Property location:</div>
        <div><b-input  size="lg" v-model="formData.location" type="text" placeholder="Property location" min="0"/></div>
        <br>
        <div class="regPropInputLabel">Price per night:</div>
        <div style="min-width: 100%;">
          <b-input-group append="€">
            <b-input  size="lg" v-model="formData.price" type="number" placeholder="Price" min="0"/>
          </b-input-group>
        </div>
        <br>
        <div class="regPropInputLabel">Number of rooms:</div>
        <div><b-input  size="lg" v-model="formData.rooms" type="number" placeholder="Rooms" min="0"/></div>
        <br>
        <div class="regPropInputLabel">Features:</div>
        <div style="margin: auto; width: 95%;">
          <div class="regPropCBox"><b-form-checkbox button size="md" v-model="formData.wifi">Wi-fi</b-form-checkbox></div>
          <div class="regPropCBox"><b-form-checkbox button size="md" v-model="formData.pets">Pets allowed</b-form-checkbox></div>
          <div class="regPropCBox"><b-form-checkbox button size="md" v-model="formData.smokers">Smokers allowed</b-form-checkbox></div>
          <div class="regPropCBox"><b-form-checkbox button size="md" v-model="formData.cleaning">Cleaning included</b-form-checkbox></div>
          <div class="regPropCBox"><b-form-checkbox button size="md" v-model="formData.guests">Guests allowed</b-form-checkbox></div>
          <div class="regPropCBox"><b-form-checkbox button size="md" v-model="formData.garage">Garage included</b-form-checkbox></div>
        </div>
        <br>
        <br>
        <br>
        <b-button @click="registerProperty()" variant="primary" size="lg" style="float: right;">Register my property now!</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'RegisterProperty',
  data() {
    return {
      formData: {
        name: '',
        location: '',
        price: 0,
        rooms: 0,
        wifi: false,
        pets: false,
        smokers: false,
        cleaning: false,
        guests: false,
        garage: false,
      }
    }
  },
  methods: {
    registerProperty() {
      if (!this.$store.getters.isLogged) {
        createToast(this.$bvToast, 'You must be logged in.', 'danger');
        return;
      }

      if (this.formData.name == null || this.formData.name.length < 3 || this.formData.name.length > 50) {
        createToast(this.$bvToast, 'Invalid property name.', 'danger');
        return;
      }

      if (this.formData.location == null || this.formData.location.length < 3 || this.formData.location.length > 50) {
        createToast(this.$bvToast, 'Invalid property location.', 'danger');
        return;
      }

      if (this.formData.price == null || this.formData.price <= 0) {
        createToast(this.$bvToast, 'Invalid price.', 'danger');
        return;
      }

      if (this.formData.rooms == null || this.formData.rooms <= 0) {
        createToast(this.$bvToast, 'Invalid number of rooms.', 'danger');
        return;
      }

      this.formData.wifi = this.formData.wifi == true;
      this.formData.pets = this.formData.pets == true;
      this.formData.smokers = this.formData.smokers == true;
      this.formData.cleaning = this.formData.cleaning == true;
      this.formData.guests = this.formData.guests == true;
      this.formData.garage = this.formData.garage == true;

      createToast(this.$bvToast, 'Property registered.', 'success');

      this.$store.commit('insertProperty', this.formData);
      
      this.$router.push('/');
    }
  },
  computed: {
    
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
.floatInputRegProp {
  float: left;
  width: 200px;
  margin-right: 20px;
}

.registerPropertyForm {
  width: 65%;
  margin: auto;
}

.regPropInputLabel {
  line-height: 26px;
  font-size: 18px;
}

.regPropCBox {
  float: left;
  margin-right: 5px;
}
</style>
