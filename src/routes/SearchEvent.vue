<template>
  <div class="searchevent">
    <div class="mainBody">
      <div class="searcheventstitle"> 
        Pick from hundreds of events.
      </div>
      <div class="events">
        <div class="event" v-for="event in events" v-bind:key="event.id">
          <div class="eventpic">
              <b-img :src="event.picture" fluid rounded></b-img>
          </div>
          <div class="eventdata">
            <div class="eventtitle">
              {{ event.name }}
            </div>
              <ul>
                <li>Location: {{ event.location }}</li>
                <li>Date: {{ toMoment(event.date).format('L') }} to {{ toMoment(event.date).add(event.days, 'days').format('L') }} </li>
                <li>Tickets Left: {{ event.tickets }}</li>
                <li>Ticket Price: {{ event.price }}$</li>
                <li>Website: <a :href="event.site">{{ event.site }}</a></li>
              </ul>
          </div>
          <div class="eventbook">
            <b-button @click="verifyEvent(event)" size="lg" >Find accomodation</b-button>
          </div>
        </div>
         <b-pagination
          :total-rows="totalRows" 
          v-model="currentPage"
          :per-page="perPage"
        />
      </div>
    </div>
    <!-- EVENT MODAL -->
    <b-modal id="event-modal" title="Choose how many participants" centered>
    <b-form-select         
      class="eventModalInput"
      :options="[1, 2, 3, 4, 5]"
      size="lg"
      v-model="formData.adults"
      >
        <option slot="first" :value="null">Adults</option>
      </b-form-select>
      <b-form-select         
        class="eventModalInput"
        :options="[0, 1, 2, 3, 4, 5]"
        :value="null"
        v-model="formData.children"
        size="lg" 
      >
        <option slot="first" :value="null">Children</option>
      </b-form-select>
      <template slot="modal-footer" slot-scope="{ ok }">
        <b-button @click="findPropertyForEvent(ok)">
          Confirm
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment';

import { Events } from '../data/eventData';

export default {
  name: 'SearchEvent',
  data() {
    return {
      Events,
      currentPage: 1,
      perPage: 3,
      formData: {
        adults: null,
        children: null
      },       
      pickedEvent: null
    }
  },
  methods: {
    verifyEvent(event) {
      if (event.tickets <= 0)
        createToast(this.$bvToast, 'Event is at full capacity.', 'danger');

      const now = moment();
      if (event.date <= now)
        createToast(this.$bvToast, 'Event is not active anymore.', 'danger');

      this.pickedEvent = event;

      this.$bvModal.show('event-modal');
    
    },
    findPropertyForEvent() {
      let fixedChildren = this.formData.children == null ? 0 : this.formData.children;
      let fixedAdults = this.formData.adults == null ? 1 : this.formData.adults;

      this.$store.commit('propertySearch', { 
        checkin: moment(this.pickedEvent.date).subtract(1, 'days'),
        checkOut: moment(this.pickedEvent.date).add(this.pickedEvent.days + 1, 'days'),
        destination: this.pickedEvent.location,
        children: fixedChildren,
        adults: fixedAdults
      });
      
      this.$router.push('/showProperties');

    },
    toMoment(date) {
      return moment(date);
    }

  },
  toMoment(date) {
    return moment(date);
  },
  computed: {
    events() {
      return Events.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      )
    },
    totalRows() {
      return Events.length
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
.searcheventstitle {
  font-size: 30px;
  padding-left: 60px;
  margin-bottom: 20px;
}

.eventModalInput {
  margin-bottom: 20px;
}
</style>
