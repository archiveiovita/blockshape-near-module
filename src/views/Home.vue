<template>
  <div>
    <div v-if="!currentUser">
      <h1>Sign In</h1>
      <button @click="signIn">Login with Near</button>
    </div>
<!--    <div v-else>-->
<!--      <form action="">-->
<!--        <div>-->
<!--          <label for="name">Name *</label>-->
<!--          <input type="text" id="name" v-model="form.name">-->
<!--        </div>-->
<!--        <div>-->
<!--          <label for="message">Message *</label>-->
<!--          <input type="text" id="message" v-model="form.message">-->
<!--        </div>-->
<!--        <div>-->
<!--          <label for="donation">Donation (Near) *</label>-->
<!--          <input type="number" id="donation" v-model="form.donation">-->
<!--        </div>-->
<!--        <div>-->
<!--          <button @click="donate">Donate</button>-->
<!--        </div>-->
<!--      </form>-->

<!--      <h3>Donation List</h3>-->
<!--      <table class="donation-list">-->
<!--        <tr>-->
<!--          <td>ID</td>-->
<!--          <td>Account ID</td>-->
<!--          <td>Name</td>-->
<!--          <td>Message</td>-->
<!--          <td>Donation</td>-->
<!--        </tr>-->
<!--        <tr v-for="(message, key) in messages" :key="key">-->
<!--          <td>{{ key + 1 }}</td>-->
<!--          <td>{{ message.sender }}</td>-->
<!--          <td>-->
<!--            <b v-if=" message.name">{{ message.name }}</b>-->
<!--            <b v-else> &#45;&#45;&#45;&#45;</b>-->
<!--          </td>-->
<!--          <td>{{ message.text }}</td>-->
<!--          <td>-->
<!--            <b v-if=" message.donation">{{ message.donation }} N</b>-->
<!--            <b v-else> &#45;&#45;&#45;&#45;</b>-->
<!--          </td>-->
<!--        </tr>-->
<!--      </table>-->
<!--    </div>-->

  </div>
</template>

<script>
import Big from 'big.js';

export default {
  name: "Donate",
  props: ['contract', 'currentUser', 'nearConfig', 'walletConnection'],
  data() {
    return {
      messages: [],
      form: {
        name: '',
        message: '',
        donation: 0,
      }
    }
  },
  mounted() {
    this.parseNearResponse();

    if (!this.messages.length) {
      this.contract.getMessages().then(messages => {
        this.messages = messages.reverse();
      })
    }
  },
  methods: {
    parseNearResponse() {
      console.log(this.$route.query)
    },
    donate(e) {
      e.preventDefault();

      const SUGGESTED_DONATION = '0';
      const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

      this.contract.addMessage(
          {text: this.form.message, name: this.form.name, donation: parseFloat(this.form.donation).toFixed(2)},
          BOATLOAD_OF_GAS,
          Big(this.form.donation || '0').times(10 ** 24).toFixed()
      ).then(() => {
        this.contract.getMessages().then(messages => {
          this.setMessages(messages);
          this.form.message = '';
          this.form.donation = SUGGESTED_DONATION;
        });
      });
    },
    setMessages(messages) {
      this.messages = messages;
      console.log(messages)
    },
    signIn() {
      this.walletConnection.requestSignIn(
          {contractId: this.nearConfig.contractName, methodNames: [this.contract.addMessage.name]},
          'NEAR Prototype Vue',
          null, //optional URL to redirect to if the sign in was successful
          null,//optional URL to redirect to if the sign in was NOT successful
      )
    },
  }
}
</script>

<style scoped>
form {
  max-width: 400px;
  margin: 0 auto;
}

form label {
  display: block;
  text-align: left;
  font-weight: bold;
  color: #2c3e50;
}

form input {
  display: block;
  width: 100%;
  height: 30px;
  margin-bottom: 20px;
  border: 1px solid #2c3e50;
  padding: 5px 10px;
}

.donation-list {
  max-width: 600px;
  margin: 0 auto;
  text-align: left;
}

table td {
  border: 1px solid #EEE;
  padding: 10px 15px;
}

.donation-list h3 {
  text-align: center;
}
</style>