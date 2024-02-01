<template>
	<div id="sticky-enable">
    <v-tooltip text="Enable sticky" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn 
          v-bind="props" 
          density="compact" 
          id="btn-sticky-enable" 
          color="blue-grey-lighten-4" 
          icon="mdi-chevron-double-down"
          @click="controlSticky"
        ></v-btn>
      </template>
    </v-tooltip>
  </div>
</template>

<script setup>

  const emit = defineEmits(['cSticky']);

  const controlSticky = () => {
    emit('cSticky')
  }

</script>

<style scoped>
  #sticky-enable { position: fixed; top: 55px; right:0px; display: none; }
  #btn-sticky-enable { color: #fff!important; }
</style>
    