<template>
  <v-dialog
    v-model="dialog"
    width="700px"
  >
    <v-card>
      <v-card-title v-html="title"></v-card-title>
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

<style>
  span.frm1 { background: #f00; color: #fff; padding: 3px 7px; border-radius: 4px; }
  span.frm0 { background: #ccc; color: #555; padding: 3px 7px; border-radius: 4px; }
</style>
