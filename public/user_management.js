var user_management_template = 
`
<div>
  <div
    v-if="is_ready === false"
  >
    <v-progress-circular
      :size="70"
      :width="7"
      indeterminate color="blue darken-2"
      class="ma-4"
    >
    </v-progress-circular>
  </div>
  <div
    v-else
  >
    <div
      class="title"
    >
      Current Users
    </div>
    <v-list>
      <v-list-tile
        v-for="(user, index) in list_of_users"
        :key="index"
      >
        <v-list-tile-title>
          {{
            user['emailAddress'] 
            + ' (' 
            + capitalizeFirstLetter(user['role']) 
            + ')'
          }}
        </v-list-tile-title>
        <v-btn 
          color="error"
          v-on:click="remove_user_from_organization(user['emailAddress'])"
        >
          Remove
        </v-btn>
      </v-list-tile>
    </v-list>
    <div>
      <br/>
      <div
        class="title"
      >
        Add Users
      </div>
      <v-text-field
        v-model="added_user_email_address"
        label="Email Address"
      ></v-text-field>
      <v-btn 
        color="success"
        v-on:click="add_user_to_organization()"
      >
        Invite
      </v-btn>
      <div
        v-if="add_user_to_organization_status !== undefined"
      >
        {{add_user_to_organization_status}}
      </div>
    </div>
    <div
      v-if="remove_user_from_organization_status !== undefined"
    >
      {{remove_user_from_organization_status}}
    </div>
  </div>
</div>
`

var user_management = {
  template: user_management_template,
  props: [
    "organizationName"
  ],
  data: function () {
    return {
      is_ready: false,
      list_of_users: undefined,
      number_of_users: undefined,
      added_user_email_address: '',
      add_user_to_organization_status: undefined,
      remove_user_from_organization_status: undefined,
      status: undefined
    }
  },
  computed: {
  },
  methods: {
    fetch_user_management_information: function () {
      var vue = this
      vue.list_of_users = undefined
      vue.is_ready = false
      console.log(vue['organizationName'])
      fetch("/organization/get_user_management_information", {
        body: JSON.stringify({
          'organizationName': vue['organizationName']
        }),
        method: "POST",
        headers: new Headers({'Content-Type': 'application/json'})
      }).then(function (response) {
        response.text().then(function (text) {
          var result = JSON.parse(text)
          console.log(result)
          if (result.error) {
            // TODO Handle this in some way.
          } else {
            vue.number_of_users = result['numberOfUsers']
            vue.list_of_users = result['listOfUsers']
            vue.is_ready = true
          }
        })
      })
    },
    capitalizeFirstLetter: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    add_user_to_organization: function () {
      var vue = this
      vue.add_user_to_organization_status = undefined
      fetch("/organization/add_user", {
        body: JSON.stringify({
          'newUserEmailAddress': vue.added_user_email_address,
          'organizationName': vue['organizationName']
        }),
        method: "POST",
        headers: new Headers({'Content-Type': 'application/json'})
      }).then(function (response) {
        response.text().then(function (text) {
          var result = JSON.parse(text)
          if (result.error) {
            vue.add_user_to_organization_status = result.error
          } else {
            alert(vue.added_user_email_address 
                  + ' added successfully.')
            vue.added_user_email_address = ''
            vue.fetch_user_management_information()
          }
        })
      })
    },
    remove_user_from_organization: function (removed_user_email_address) {
      var vue = this
      vue.remove_user_from_organization_status = undefined
      fetch("/organization/remove_user", {
        body: JSON.stringify({
          'removedUserEmailAddress': removed_user_email_address,
          'organizationName': vue['organizationName']
        }),
        method: "POST",
        headers: new Headers({'Content-Type': 'application/json'})
      }).then(function (response) {
        response.text().then(function (text) {
          var result = JSON.parse(text)
          if (result.error) {
            vue.remove_user_from_organization_status = result.error
          } else {
            alert(removed_user_email_address
                  + ' removed successfully.')
            vue.fetch_user_management_information()
          }
        })
      })
    }
  },
  created: function () {
  },
  mounted: function () {
    var vue = this
    vue.fetch_user_management_information()
  }
}
