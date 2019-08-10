import store from '../data/store'
var showAlert = (message, variant) => {
    store.commit('setAlert', {
        show: true,
        message: message,
        variant: variant
    })
}
var showSuccessAlert = (response) => {
    showAlert(response.data.message, 'success')
}
var showErrorAlert = (err) => {
    showAlert(err.response.data.message, 'danger')
}
export {showAlert, showSuccessAlert, showErrorAlert}