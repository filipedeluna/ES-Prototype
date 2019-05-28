<template>
  <div class="cart">
    <div class="cartBody">
      <div class="cartBodyTitle"> 
        Shopping cart
      </div>

      <div class="cartItems">
        <template>
            <b-table striped hover :items="cartItems" :fields="cartItemFields">
              <template slot="remove" slot-scope="row">
                <b-button @click="removeCartItem(row.item.remove)" size="sm" >Remove</b-button>
             </template> 
            </b-table>
        </template>
      </div>

      <div class="cartDetails">
        <template>
          <div class="cartDetails2">
            <b-table striped hover tdClass="danger" :items="cartDetails">
            </b-table>
          </div>
        </template>
      </div>
      <br>
      <div class="cartPay">
          <b-input type="range" v-model="pointsUsed" min="0" :max="maxPoints" style="radiocartpay" placeholder="Discount Code"/> 
          Points used {{ pointsUsed }} / {{ maxPoints }}
        <b-form inline>
          <br>
          <b-input size="lg" v-model="discountCode" style="float: right; margin-top: 20px;" placeholder="Discount Code"/>
          <b-button size="lg" variant="primary" @click="validateDiscount()" style="float: right; margin-top: 20px;">Validate</b-button>
        </b-form>
        <br>
        <b-button style="float: right;" @click="validatePayment(calculateFinalPrice())" size="lg" >Confirm and pay</b-button>
      </div>
    </div>
  </div>
</template>

<script>
// import moment from 'moment';
import * as R from 'ramda';

const cartItemFields = [
  { key: 'name', label: 'Accomodation' },
  { key: 'adults', label: 'Nr. of adults', class: 'text-center' },
  { key: 'children', label: 'Nr. of children', class: 'text-center' },
  { key: 'checkIn', label: 'Check-in date', class: 'text-center' },
  { key: 'checkOut', label: 'Check-out date', class: 'text-center' },
  { key: 'days', label: 'Nr. of days', class: 'text-center' },
  { key: 'pricePerNight', label: 'Price per night', class: 'text-center' },
  { key: 'totalPrice', label: 'Total price', class: 'text-center' },
  { key: 'remove', label: 'Remove from cart', class: 'text-center' }
];

export default {
  name: 'Cart',
  data() {
    return {
      currentPage: 1,
      perPage: 3,
      discount: 0,
      discountCode: null,
      cartItemFields,
      pointsUsed: 0
    }
  },
  methods: {
    verifyEvent(event) {
      if (event.tickets <= 0)
        createToast(this.$bvToast, 'Event is at full capacity.', 'danger');
        
      const now = new Date();
      if (event.date <= now)
        createToast(this.$bvToast, 'Event is not active anymore.', 'danger');
    },
    removeCartItem(cartId) {
      this.$store.commit('removeFromCart', cartId);

      createToast(this.$bvToast, 'Item removed from cart..', 'success');
    },
    validateDiscount() {
      if (this.discountCode != null) {
        switch(this.discountCode) {
          case 'BOOKINGPLUS20': 
            this.discount = 20;
            createToast(this.$bvToast, 'Discount code validated.', 'success');
            return;
          case 'BOOKINGPLUS40': 
            this.discount = 40;
            createToast(this.$bvToast, 'Discount code validated.', 'success');
          return;
          case 'BOOKINGPLUS60': 
            this.discount = 60;
            createToast(this.$bvToast, 'Discount code validated.', 'success');
          return;
        }
      }
      createToast(this.$bvToast, 'Invalid discount code.', 'danger');
    },
    calculateFinalPrice() {
      let totalPrice = R.reduce((acc, cartItem) => acc + cartItem.totalPrice, 0, this.$store.getters.getCart);
      let discountPrice = totalPrice * this.discount / 100;

      return totalPrice - discountPrice - this.pointsUsed;
    },
    async validatePayment(totalSpent) {
      let pointsFixed = this.pointsUsed != null ? this.pointsUsed : 0;
      let totalFixed = totalSpent != null ? totalSpent : 0;

      let message = `Successfully paid ${totalFixed} €. You won ${Math.floor(totalFixed / 10)} points with this purchase.`;
      
      createToast(this.$bvToast, message, 'success');
      
      this.$store.commit('payCart', { pointsSpent: pointsFixed , totalSpent: totalFixed });
      this.$router.push('/');
    }
  },
  computed: {
    cartItems() {
      let cart = this.$store.getters.getCart;
      let cartFiltered = [];

      for (let i = 0; i < cart.length; i++) {
        cartFiltered.push({
          name: cart[i].fixedName,
          adults: cart[i].adults,
          children: cart[i].children,
          checkIn: cart[i].checkin.format('L'),
          checkOut: cart[i].checkOut.format('L'),
          days: cart[i].checkOut.diff(cart[i].checkin, 'days') + 1,
          pricePerNight: cart[i].price,
          totalPrice: cart[i].totalPrice,
          remove: cart[i].cartId
        });
      }

      return cartFiltered;
    },
    cartDetails() {
      let totalPrice = R.reduce((acc, cartItem) => acc + cartItem.totalPrice, 0, this.$store.getters.getCart);
      let discountPrice = totalPrice * this.discount / 100;
      let finalPrice = totalPrice - discountPrice - this.pointsUsed;

      let details = [
        {
          ' ': `Subtotal (${this.$store.getters.getCart.length} items)`,
          '  ': `${totalPrice} €`,
        },
        {
          ' ': `Discount Code (${this.discount}%)`,
          '  ': `${-discountPrice} €`
        },
        {
          ' ': `Points Discount (${this.pointsUsed})`,
          '  ': `${-this.pointsUsed} €`
        },
        {
          ' ': 'Final price',
          '  ': `${finalPrice < 0 ? 0 : finalPrice} €`,
        }
      ];

      return details;
    },
    maxPoints() {
      return this.$store.getters.loggedClient.points != null ? this.$store.getters.loggedClient.points : 0
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

.radiocartpay {

}

.cartDetails {
  float: right;
  width: 100%;

}

.cartDetails2 {
  float: right;
  width: 400px;

}

.cartPay {
  float: right;
}
</style>
