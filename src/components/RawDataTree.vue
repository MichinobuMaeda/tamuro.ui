<template>
  <v-bottom-sheet
    v-model="visible"
    scrollable
    fullscreen
  >
    <v-card>
      <v-card-title class="py-1">
        <span :class="titleColor + ' text-h2'">
          <v-icon large :color="iconColor">{{ icon }}</v-icon>
          {{ title }}
        </span>
        <v-spacer />
        <span class="text-body-2 pr-2">Developers only</span>
        <v-btn icon @click="visible = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-1">
        <v-treeview
          :items="tree"
          dense
          :open.sync="openIds"
        >
          <template v-slot:label="{ item }">
            <span :class="textColor">{{ item.name }}:</span> {{ item.value }}
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>

<style>
.v-treeview--dense .v-treeview-node__root {
  min-height: 24px;
}
.v-treeview-node__label {
  font-family: 'Lucida Console', Monaco, monospace;
  font-size: 14px;
}
</style>

<script>
import { computed, ref } from '@vue/composition-api'

export default {
  name: 'RawDataTree',
  model: {
    prop: 'show',
    event: 'showChange'
  },
  props: {
    show: Boolean,
    items: Object,
    icon: String,
    title: String,
    defaultOpenDepth: {
      type: Number,
      default: 2
    },
    iconColor: {
      type: String,
      default: 'blue darken-3'
    },
    titleColor: {
      type: String,
      default: 'blue--text text--darken-3'
    },
    textColor: {
      type: String,
      default: 'blue--text text--darken-3'
    }
  },
  setup (props, { emit }) {
    return {
      visible: computed({
        get: () => props.show,
        set: v => emit('showChange', v)
      }),
      tree: computed(() => Object.keys(props.items).map(key => obj2RawTree('top', key, props.items[key]))),
      openIds: ref(Object.keys(props.items).map(key => `top_${key}`))
    }
  }
}

const obj2RawTree = (parent, key, val) => typeof val === 'undefined'
  ? {
    id: `${parent}_${key}`,
    name: key,
    value: 'undefined'
  }
  : typeof val === 'function'
    ? {
      id: `${parent}_${key}`,
      name: key,
      value: 'function () {...}'
    }
    : val instanceof Date || typeof val === 'symbol'
      ? {
        id: `${parent}_${key}`,
        name: key,
        value: val instanceof Date ? val.toISOString() : val.toString()
      }
      : (
        typeof val === 'boolean' ||
        typeof val === 'number' ||
        typeof val === 'bigint' ||
        typeof val === 'string' ||
        !val
      ) ? {
          id: `${parent}_${key}`,
          name: key,
          value: JSON.stringify(val)
        }
        : Array.isArray(val)
          ? val.length
            ? {
              id: `${parent}_${key}`,
              name: key,
              value: `[ ${val.length} ]`,
              children: val.map((item, index) => obj2RawTree(
                `${parent}_${key}`,
                (item && item.id) ? item.id : index,
                item
              ))
            }
            : {
              id: `${parent}_${key}`,
              name: key,
              value: '[ 0 ]'
            }
          : Object.keys(val).length
            ? {
              id: `${parent}_${key}`,
              name: key,
              value: (key === '_ref' && val.firestore) ? '{ ... firestore }' : '{...}',
              children: (key === '_ref' && val.firestore)
                ? []
                : [...Object.keys(val).filter(item => item !== 'id' || val[item] !== key)].sort().map(
                  item => obj2RawTree(
                    `${parent}_${key}`,
                    item,
                    val[item]
                  )
                )
            }
            : {
              id: `${parent}_${key}`,
              name: key,
              value: '{ }'
            }
</script>
