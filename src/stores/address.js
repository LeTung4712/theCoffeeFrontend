import { defineStore } from "pinia";

export const useAddressStore = defineStore("address", {
  state: () => ({
    address: localStorage.getItem("oldAddress")
      ? JSON.parse(localStorage.getItem("oldAddress"))
      : {
          address: "",
          address_type: "",
          created_at: "",
          district_code: "",
          id: null,
          is_default: false,
          mobile_no: "",
          province_code: "",
          updated_at: "",
          user_id: null,
          user_name: "",
          ward_code: "",
        },
    addressNote: localStorage.getItem("addressNote")
      ? JSON.parse(localStorage.getItem("addressNote"))
      : [],
  }),

  actions: {
    updateAddress(newAddress) {
      this.address = {
        ...this.address,
        ...newAddress,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem("oldAddress", JSON.stringify(this.address));
    },

    setAddressNote(addresses) {
      this.addressNote = addresses;
      localStorage.setItem("addressNote", JSON.stringify(addresses));
    },

    removeAddressNoteById(id) {
      this.addressNote = this.addressNote.filter(
        (address) => address.id !== id
      );
      localStorage.setItem("addressNote", JSON.stringify(this.addressNote));
    },

    setDefaultAddress(id) {
      this.addressNote = this.addressNote.map((address) => ({
        ...address,
        is_default: address.id === id,
      }));
      localStorage.setItem("addressNote", JSON.stringify(this.addressNote));
    },
  },
});
