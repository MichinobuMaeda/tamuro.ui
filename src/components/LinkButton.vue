<template>
  <v-btn
    text
    :color="color"
    @click="$emit('click')"
    :disabled="disabled"
  >
    <v-icon v-if="icon" :class="label ? 'mr-1' : ''">{{ icon }}</v-icon>
    <span class="text-decoration-underline">{{ label }}</span>
  </v-btn>
</template>

<script>
export default {
  name: 'LinkButton',
  props: {
    icon: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    }
  }
}
</script>
