<template>
  <v-row> 
    <v-col cols="12">
      <v-table id="tbl-fluct" class="bg-red-lighten-4 pa-2">
        <tr>
          <td class="text-right"><strong>mean (Å):</strong></td>
          <td class="text-left pl-2">{{ mean }}</td>
          <td class="text-right"><strong>standard deviation (Å):</strong></td>
          <td class="text-left pl-2">{{ stdev }}</td>
        </tr>
      </v-table>
    </v-col>
  </v-row>
</template>

<script setup>

  const mean = ref(0)
  const stdev = ref(0)

  const updateData = (m, s) => {
    mean.value = m
    stdev.value = s
  }

  defineExpose({
    updateData
  });

</script>

<style scoped>

</style>
  