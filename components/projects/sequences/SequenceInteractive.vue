<template>
  <v-sheet
    color="grey-lighten-4"
    class="pa-10 project-sheet"
    id="container-strands-sheet"
  >
    <v-row class="project-row" justify="center">
      <div 
        class="number" 
        v-for="(item, index) in strand1"
        :key="index"
        :value="index"
        > {{ index + 1 }} </div>
    </v-row>
    <v-row class="pb-0 pt-2 px-4 project-row" justify="space-around">
      <div class="end"> {{ ends1[0] }} </div>
      <div class="d-flex">
        <div 
        class="nucleotide" 
        v-for="(item, index) in strand1"
        :key="index"
        :value="index"
        :id="`${item}-${index + 1}-strand1`"
        > {{ item }} </div>
      </div>
      <div class="end"> {{ ends1[1] }} </div>
    </v-row>
    <v-row class="pt-0 pb-2 px-4 project-row" justify="space-around">
      <div class="end"> {{ ends2[0] }} </div>
      <div class="d-flex">
        <div 
        class="nucleotide" 
        v-for="(item, index) in strand2"
        :key="index"
        :value="index"
        :id="`${item}-${strand2.length*2 - index}-strand2`"
        > {{ item }} </div>
      </div>
      <div class="end"> {{ ends2[1] }} </div>
    </v-row>
    <v-row class="project-row" justify="center">
      <div 
        class="number" 
        v-for="(item, index) in strand2"
        :key="index"
        :value="index"
        > {{ strand2.length*2 - index }} </div>
    </v-row>
  </v-sheet>
</template>

<script setup>

  import DragSelect from 'dragselect'

  const { strands, ends } = defineProps(['strands', 'ends'])
	const strand1 = strands.strand1
	const strand2 = strands.strand2
	const ends1 = ends.ends1
	const ends2 = ends.ends2

  const emit = defineEmits(['dsEnd', 'dsStart']);

  onMounted(async () => {
    const ds = new DragSelect({
      selectables: document.getElementsByClassName("nucleotide"),
      area: document.getElementById("container-strands-sheet"),
      draggability: false,
      multiSelectKeys: ['Shift']
    });

    ds.subscribe("DS:start", (e) => {
      emit('dsStart');
    });

    ds.subscribe("DS:end", ({items}) => {
      emit('dsEnd', items);
    });

  })

</script>

<style scoped>
  .nucleotide {
    font-family: 'Roboto Mono', monospace;
    font-size: 1.5rem;
    line-height: 1.6rem;
    font-weight: 500;
    padding: .5rem 0.5rem;
    margin: 0;
    color: var(--palette-6);
    user-select: none; 
  }
  .nucleotide.all { box-shadow: inset 0 0 0 1px var(--palette-2); }
  .nucleotide.top-bp { box-shadow: inset 1px 0 0 var(--palette-2), inset -1px 0 0 var(--palette-2), inset 0 1px 0 var(--palette-2); }
  .nucleotide.bottom-bp { box-shadow: inset 1px 0 0 var(--palette-2), inset -1px 0 0 var(--palette-2), inset 0 -1px 0 var(--palette-2); }
  .nucleotide.left-bs { box-shadow: inset 1px 0 0 var(--palette-2), inset 0 1px 0 var(--palette-2), inset 0 -1px 0 var(--palette-2); }
  .nucleotide.right-bs { box-shadow: inset -1px 0 0 var(--palette-2), inset 0 1px 0 var(--palette-2), inset 0 -1px 0 var(--palette-2); }
  .nucleotide.top-left-bps { box-shadow: inset 1px 1px 0px 0px var(--palette-2); }
  .nucleotide.top-right-bps { box-shadow: inset -1px 1px 0px 0px var(--palette-2); }
  .nucleotide.top-bps { box-shadow: inset 0px 1px 0px 0px var(--palette-2); }
  .nucleotide.bottom-left-bps { box-shadow: inset 1px -1px 0px 0px var(--palette-2); }
  .nucleotide.bottom-right-bps { box-shadow: inset -1px -1px 0px 0px var(--palette-2); }
  .nucleotide.bottom-bps { box-shadow: inset 0px -1px 0px 0px var(--palette-2); }
  .ds-selected {
    background-color: var(--light-text);
    color: var(--palette-4);
  }
  .number {
    font-family: monospace;
    font-size: .75rem;
    width: 1.91rem;
    text-align: center;
    color: var(--palette-2);
    user-select: none; 
    line-height: .2rem;
  }
  .end {
    font-family: 'Roboto Mono', monospace;
    font-size: 1.25rem;
    font-weight: 200;
    color: var(--strand-end);
    user-select: none; 
    padding: .75rem 0;
  }
  .project-sheet{ overflow: hidden;}

  @media only screen and (max-width: 1280px) {
    .nucleotide { padding: .3rem 0.35rem; }
    .number { width: 1.62rem; }
    .end { padding: .5rem 0; font-size: 1.2rem; }
    .project-sheet{ overflow-x: auto;}
    .project-row { min-width: 630px; }
  }
</style>
    