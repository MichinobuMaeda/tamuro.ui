<template>
  <v-row justify="center">
    <v-col class="col-12">
      <PageTitle
        text-color="h2--text"
        icon-color="h2"
        :icon="conf.icon('Administration')"
      >
        <template v-slot:title>{{ $t('Administration') }}</template>
      </PageTitle>

      <v-card v-for="item in items" :key="item.target">
        <v-card-title
          class="h3--text text-h3 my-2 pa-2"
          @click="goPage(target === item.target ? { name: 'admin' } : { name: 'admin', params: { target: item.target } })"
        >
          <v-icon color="h3" class="mr-1">{{ conf.icon(item.icon) }}</v-icon>
          {{ $t(item.label) }}
          <v-spacer />
          <v-icon>{{ conf.icon(target === item.target ? 'Shrink' : 'Expand') }}</v-icon>
        </v-card-title>
        <v-card-text v-if="target === item.target">
          <FormattedTextEditor
            v-if="target === 'aboutAdmin'"
            v-model="aboutAdmin"
            :placeholder="$t(item.label)"
            :editable="me.priv.manager || me.priv.admin"
            :disabled="!!state.waitProc"
          />
          <Users v-else-if="target === 'users'" />
          <Categories v-if="target === 'categories'" />
          <FormattedTextEditor
            v-else-if="target === 'aboutProfile'"
            v-model="aboutProfile"
            :placeholder="$t(item.label)"
            :editable="me.priv.manager || me.priv.admin"
            :disabled="!!state.waitProc"
          />
          <div v-else-if="target === 'invitationTemplate'">
            <p class="info--text">[[NAME]] : {{ $t('Display name') }} / [[URL]] : {{ $t('URL for invitation') }}</p>
            <TextEditor
              type="multiline"
              v-model="invitationTemplate"
              :label="$t('Template of invitation')"
              :placeholder="$t('Template of invitation')"
              :editable="me.priv.manager || me.priv.admin"
              :disabled="!!state.waitProc"
            />
          </div>
          <div v-else-if="target === 'aboutInvitation'">
            <FormattedTextEditor
              v-model="aboutInvitation"
              :placeholder="$t(item.label)"
              :editable="me.priv.manager || me.priv.admin"
              :disabled="!!state.waitProc"
            />
            <LinkButton
              :icon="conf.icon('Preview')"
              :label="$t('Preview')"
              @click="goPage({ name: 'prevwInvitation' })"
            />
          </div>
          <Invitation v-else-if="target === 'invitation'" />
          <UiPreferences v-else-if="target === 'defaults'" class="my-2" :entity="state.service.conf" />
          <Authentication v-else-if="target === 'auth'" />
          <Notifications v-else-if="target === 'notifications'" />
          <Service v-else-if="target === 'service'" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { computed } from '@vue/composition-api'
import { useStore } from '../store'
import PageTitle from '../components/PageTitle'
import TextEditor from '../components/TextEditor'
import FormattedTextEditor from '../components/FormattedTextEditor'
import LinkButton from '../components/LinkButton'
import Users from '../parts/admin/Users'
import Categories from '../parts/admin/Categories'
import Invitation from '../parts/admin/Invitation'
import UiPreferences from '../parts/UiPreferences'
import Authentication from '../parts/admin/Authentication'
import Notifications from '../parts/admin/Notifications'
import Service from '../parts/admin/Service'

export default {
  name: 'PageAdmin',
  components: {
    PageTitle,
    TextEditor,
    FormattedTextEditor,
    LinkButton,
    Users,
    Categories,
    Invitation,
    UiPreferences,
    Authentication,
    Notifications,
    Service
  },
  setup () {
    const store = useStore()
    const { state, waitFor, update } = store

    return {
      ...store,
      target: computed(() => state.route.params ? state.route.params.target : ''),
      items: [
        {
          target: 'aboutAdmin',
          icon: 'Description',
          label: 'About administration'
        },
        {
          target: 'users',
          icon: 'Users',
          label: 'Users'
        },
        {
          target: 'categories',
          icon: 'Categories',
          label: 'Categories'
        },
        {
          target: 'aboutProfile',
          icon: 'Description',
          label: 'About profile editing'
        },
        {
          target: 'invitationTemplate',
          icon: 'Description',
          label: 'Template of invitation'
        },
        {
          target: 'aboutInvitation',
          icon: 'Description',
          label: 'About invitation'
        },
        {
          target: 'invitation',
          icon: 'Invitation',
          label: 'Invitation'
        },
        {
          target: 'defaults',
          icon: 'Defaults',
          label: 'Defaults'
        },
        {
          target: 'auth',
          icon: 'Sign in',
          label: 'Authentication'
        },
        {
          target: 'notifications',
          icon: 'Notifications',
          label: 'Notifications'
        },
        {
          target: 'service',
          icon: 'Service settings',
          label: 'Service settings'
        }
      ],
      aboutAdmin: computed({
        get: () => state.service.conf && state.service.conf.aboutAdmin,
        set: str => waitFor(() => update(state.service.conf, { aboutAdmin: str }))
      }),
      aboutProfile: computed({
        get: () => state.service.conf && state.service.conf.aboutProfile,
        set: str => waitFor(() => update(state.service.conf, { aboutProfile: str }))
      }),
      invitationTemplate: computed({
        get: () => state.service.conf.invitationTemplate,
        set: str => waitFor(() => update(state.service.conf, { invitationTemplate: str }))
      }),
      aboutInvitation: computed({
        get: () => state.service.conf.aboutInvitation,
        set: str => waitFor(() => update(state.service.conf, { aboutInvitation: str }))
      })
    }
  }
}
</script>
