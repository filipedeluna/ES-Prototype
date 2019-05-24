<template>
  <div class="searchevent">
    <div class="mainBody">
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
            <b-button size="lg" >Book now!</b-button>
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
</script>