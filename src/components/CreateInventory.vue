<template>
  <div>
    <b-form @submit="submit">
      <b-form-group label="Nguyên liệu:" label-for="ingredient">
        <b-form-select id="ingredient" @change="ingredientChange" v-model="chosenIngredient._id" :options="ingredients" required></b-form-select>
      </b-form-group>
      <div v-if="chosenIngredient._id && chosenIngredient.unit" style="text-align: right;font-style: italic">
          {{chosenIngredient.unit.storage}}/{{chosenIngredient.defaultPrice.toLocaleString('VND')}}
      </div>
      <b-form-group label="Loại:" label-for="type">
        <b-form-select id="type" v-model="form.type" :options="typeOptions" required></b-form-select>
      </b-form-group>
      <b-form-group label="Số lượng:" label-for="quantity">
        <b-form-input id="quantity" @change="quantityChange" v-model="form.quantity" required type="number"></b-form-input>
      </b-form-group>
      <b-form-group label="Ngày:" label-for="date">
        <b-form-input id="date" v-model="form.date" type="date"></b-form-input>
      </b-form-group>
      <b-form-group label="Giá:" label-for="price">
        <b-form-input id="price" v-model="form.price" type="number"></b-form-input>
      </b-form-group>
      <b-form-group label="Nội dung:" label-for="note">
        <b-form-input id="note" v-model="form.note"></b-form-input>
      </b-form-group>
      <b-button type="submit">Tạo nhập/xuất mới</b-button>
    </b-form>
  </div>
</template>
<script>
import axios from "axios";
import { showSuccessAlert, showErrorAlert } from "../helpers/helpers";
import { format } from "date-fns";
import store from "../data/store";
import { request } from 'http';
export default {
  data: function() {
    return {
      initForm: {
        quantity: 0,
        type: "in",
        date: format(new Date(), "YYYY-MM-DD"),
        price: 0,
        note: ""
      },
      form: null,
      ingredients: [],
      chosenIngredient: {_id: null},
      typeOptions: [
        {
          text: "Nhập",
          value: "in"
        },
        {
          text: "Xuất",
          value: "out"
        }
      ]
    };
  },
  beforeMount() {
    this.form = { ...this.initForm };
  },
  mounted() {
    store.commit("setLoading", true);
    axios
      .get("/ingredients")
      .then(response => {
        var ingredients = [
          {
            text: "Chọn nguyên liệu",
            value: null
          }
        ];
        response.data.forEach(ingredient => {
          ingredients.push({
            text: `${ingredient.name}`,
            value: ingredient["_id"],
            fullInfo: ingredient
          });
        });
        this.ingredients = ingredients;
      }, showErrorAlert)
      .finally(store.commit("setLoading", false));
  },
  methods: {
      ingredientChange(){
          this.chosenIngredient = this.ingredients
                                .find(ingredient => ingredient.value === this.chosenIngredient._id)
                                .fullInfo
          this.form = {...this.initForm}
          
      },
      quantityChange(){
          this.form.price = this.form.quantity*this.chosenIngredient.defaultPrice
      },
      submit(evt){
          evt.preventDefault()
          store.commit("setLoading", true)
          var resquestBody = {...this.form}
          resquestBody.ingredient = this.chosenIngredient
          axios.post('/inventories', resquestBody).then(response => {
              showSuccessAlert(response)
              this.form = {...this.initForm}
              this.chosenIngredient._id = null
          }, showErrorAlert).finally(store.commit("setLoading", false))
      }
  }
};
</script>