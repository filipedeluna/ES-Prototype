<template>
  <div class="cart">
    <div class="cartBody">
      <div class="cartBodyTitle"> 
        Shopping cart
      </div>
      <div class="cartItems">
        <template>
          <div>
            <b-table striped outlined bordered tdClass="danger" :items="events">
              <th> hitas</th>
            </b-table>
          </div>
        </template>
        <div class="cartItem" v-for="event in events" v-bind:key="event.id">
          <div class="cartItemData">
            <div class="cartItemTitle">
              {{ 1 }}
            </div>
          </div>
        </div>
        <span class="cartTotal">TOTAL: 8000 €</span>
        <br>
        <div class="cartPay">
          <b-button @click="verifyEvent(event)" size="lg" >Confirm and pay.</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Events } from '../data/eventData';

export default {
  name: 'Cart',
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
.cartBody {
  min-height: 92vh;
  background-color:#f7f7f7;
  margin-top: 14px;
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  margin-left: 15%;
  margin-right: 15%;
}

.cartBodyTitle {
  font-weight: 700;
  font-size: 32px;
  margin-bottom: 10px;
}

.cartItem {
   height: 50px;
  background-color:#e6e6e6;
  padding-left: 30px;
  margin-bottom: 5px;
  border-radius: 10px;
}

.cartItemPic {
  width: 200px;
  float: left;
  margin-top: 20px;
}

.cartItemData {

}

.cartItemTitle {

}

.cartItemPrice {

}

.cartTotal {
  float: right;
}

.cartPay {
  float: right;
}
</style>
