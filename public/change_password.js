var change_password_template = 
`
<div>
  <div>
    <v-text-field
      v-model="current_password"
      label="Current Password"
      :append-icon="e1 ? 'visibility' : 'visibility_off'"
      :append-icon-cb="() => (e1 = !e1)"
      :type="e1 ? 'password' : 'text'"
    ></v-text-field>
    <v-text-field
      v-model="new_password"
      label="New Password"
      :append-icon="e2 ? 'visibility' : 'visibility_off'"
      :append-icon-cb="() => (e2 = !e2)"
      :type="e2 ? 'password' : 'text'"
    ></v-text-field>
    <v-text-field
      v-model="new_password_confirm"
      label="Confirm New Password"
      :append-icon="e3 ? 'visibility' : 'visibility_off'"
      :append-icon-cb="() => (e3 = !e3)"
      :type="e3 ? 'password' : 'text'"
    ></v-text-field>
  </div>
  <v-btn 
    color="primary"
    v-on:click="try_change_password();"
  >
    Change Password
  </v-btn>
  <div
    v-if="status !== undefined"
  >
    {{status}}
  </div>
</div>
`

var change_password = {
  template: change_password_template,
  props: [
  ],
  data: function () {
    return {
      e1: true,
      e2: true,
      e3: true,
      current_password: '',
      new_password: '',
      new_password_confirm: '',
      status: undefined
    }
  },
  computed: {
  },
  methods: {
    try_change_password: function () {
      var vue = this
      vue.error = undefined
      if (vue.new_password === vue.new_password_confirm) {
        fetch("/user/change_password", {
          body: JSON.stringify({
            'currentPassword': vue.current_password,
            'newPassword': vue.new_password,
          }),
          method: "POST",
          headers: new Headers({'Content-Type': 'application/json'})
        }).then(function(response){
          response.text().then(function(text){
            var result = JSON.parse(text)
            if (result.error) {
              vue.status = result.error
            } else {
              vue.current_password = ''
              vue.new_password = ''
              vue.new_password_confirm = ''
              vue.status = 'Password changed successfully.'
            }
          })
        })
      } else {
        vue.status = 'New passwords do not match.'
      }
    }
  },
  created: function () {
  },
  mounted: function () {
  }
}
