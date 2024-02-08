<template>
  <v-dialog
    v-model="dialog"
    width="700px"
  >
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text>
        <slot name="viewer"></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Close"
          @click="closeDialog"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>

  const props = defineProps({
    modelValue: Boolean
  })

  const emit = defineEmits(['update:modelValue'])

  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  const closeDialog = () => {
    dialog.value = false;
  }

  // CLEAN NGL HERE ??????
  /*watch(dialog, (newVal, oldVal) => {
    if (!newVal && oldVal) {
      // CLEAN NGL HERE ??????
      // plotDialogRef.value.removeRepresentation(selectBP);
      console.log('Dialog closed');
    }
  })*/

  const title = ref('')
  const updateTitle = (t) => {
    title.value = t
  }

  defineExpose({
		updateTitle
	});

</script>

<style scoped>

</style>
