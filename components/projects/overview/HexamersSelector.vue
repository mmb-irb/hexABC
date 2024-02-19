<template>
	<div class="mt-6">
    <v-autocomplete
      label="Filter by Hexamers"
      :items="hexamersModel"
      v-model="selectedHexamer"
      @update:modelValue="selectHexamer"
    ></v-autocomplete>
  </div>
</template>

<script setup>
	
  import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'

  const { 
    calculateComplementaryStrand
  } = useInteractiveSequence()

	const { strands } = defineProps(['strands'])
  const emit = defineEmits(['selectHexamer']);

  const strand1 = strands.strand1.slice(2, -2)
  const strand2 = strands.strand2.reverse().slice(2, -2)

  const hexamers = ref([])
  // strand1 hexamers
  for (let i = 0; i < strand1.length - 5; i++) {
    const obj = { 
      string: strand1.slice(i, i + 6).join(''),
      index: i + 3,
      strand: 1
    }
    hexamers.value.push(obj)
  }
  // strand2 hexamers
  for (let i = 0; i < strand2.length - 5; i++) {
    const obj = { 
      string: strand2.slice(i, i + 6).join(''),
      index: i + 23,
      strand: 2
    }
    hexamers.value.push(obj)
  }

  const selectedHexamer = ref(null)
  const hexamersModel = ref(hexamers.value.map((hex) => hex.string))

  // watch for changes in hexamers
  const selectHexamer = (hexamer) => {
    // selected hexamer object
    const objHex1 = hexamers.value.find((hex) => hex.string === hexamer)
    // complementary hexamer object
    const objHex2 = hexamers.value.find((hex) => hex.string === calculateComplementaryStrand(hexamer.split('')).join('').split('').reverse().join(''))
    emit('selectHexamer', objHex1, objHex2);
  }

  const resetSelector = () => {
    selectedHexamer.value = null
  }

  defineExpose({
		resetSelector
	});

</script>

<style scoped>
	
</style>
    