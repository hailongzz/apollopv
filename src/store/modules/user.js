export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    organizationId: '',
    userObj: JSON.parse(window.sessionStorage.getItem('userObj')) || null
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateOrganizationId (state, organizationId) {
      state.organizationId = organizationId
    },
    updateUserObj (state, userObj) {
      state.userObj = userObj
    }
  }
}
