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
                <li>Date: {{ event.date.toISOString().split('T')[0] }}</li>
                <li>Tickets Left: {{ event.tickets }}</li>
                <li>Ticket Price: {{ event.price }}$</li>
                <li>Website: <a :href="event.site">{{ event.site }}</a></li>
              </ul>
          </div>
          <div class="eventbook">
            <b-button @click="verifyEvent(event)" size="lg" >Book now!</b-button>
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
import { Events } from '../data/eventData';

export default {
  name: 'SearchEvent',
  data() {
    return {
      Events,
      currentPage: 1,
      perPage: 3,
    }
  },
  methods: {
    verifyEvent(event) {
      if (event.tickets <= 0)
        createToast(this.$bvToast, 'Event is at full capacity.', 'danger');
        
      const now = new Date();
      if (event.date <= now)
        createToast(this.$bvToast, 'Event is not active anymore.', 'danger');

      
    }
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
</style>
