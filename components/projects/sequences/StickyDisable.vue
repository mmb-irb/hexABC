<template>
	<div id="sticky-disable">
    <v-tooltip text="Disable sticky sequence" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn 
          v-bind="props" 
          density="compact" 
          id="btn-sticky-disable" 
          color="blue-grey-lighten-4" 
          variant="flat" 
          icon="mdi-arrow-expand-up"
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
  #sticky-disable { position: absolute; right: -.8rem; bottom: -.8rem; display: none; }
  #btn-sticky-disable { color: #fff!important; font-size: 12px!important; }
</style>
    