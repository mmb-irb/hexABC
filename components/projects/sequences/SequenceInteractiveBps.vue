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
			<div class="d-flex">
				<div class="end" style="left: -20px;"> 
					<div>{{ ends1[0] }}</div> 
					<div class="mt-4">{{ ends1[1] }}</div> 
				</div>
				<div 
					class="base-pair" 
					v-for="(item, index) in strands"
					:key="index"
					:value="index"
					:id="`bp${index + 1}${item[0]}${strands.length*2 - index}${item[1]}`"
					> 
					<div class="flex">
						<div class="nucleotide">{{ item[0] }}</div> 
						<div class="nucleotide">{{ item[1] }}</div>
					</div> 
				</div>
				<div class="end" style="left: 20px;"> 
					<div>{{ ends2[0] }}</div> 
					<div class="mt-4">{{ ends2[1] }}</div> 
				</div>
			</div>
		</v-row>
		<v-row class="project-row" justify="center">
			<div 
				class="number mt-3" 
				v-for="(item, index) in strand2"
				:key="index"
				:value="index"
				> {{ strand2.length*2 - index }} </div>
		</v-row>
	</v-sheet>
</template>

<script setup>

	import DragSelect from 'dragselect'

	const { strandsObj, ends, sequence } = defineProps(['strandsObj', 'ends', 'sequence'])
	const strands = strandsObj.strands
	const strand1 = strandsObj.strand1
	const strand2 = strandsObj.strand2
	const ends1 = ends.ends1
	const ends2 = ends.ends2

	const emit = defineEmits(['dsEnd', 'dsStart']);

	let ds
	onMounted(async () => {
		ds = new DragSelect({
      selectables: document.getElementsByClassName("base-pair"),
      area: document.getElementById("container-strands-sheet"),
      draggability: false,
      multiSelectKeys: ['Shift']
    });

    ds.subscribe("DS:start", (e) => {
			emit('dsStart');
    });

    ds.subscribe("DS:end", ({items}) => {
			emit('dsEnd', items);
		})
	})

	const getDragSelect = () => ds

	defineExpose({
		getDragSelect
	});

</script>

<style scoped>
	.base-pair {
    color: var(--palette-6);
    margin-right: 1px;
  }
  .nucleotide {
    font-family: 'Roboto Mono', monospace;
    font-size: 1.5rem;
    line-height: 1.6rem;
    font-weight: 500;
    padding: .5rem .5rem;
    margin: 0;
    user-select: none; 
  }
  .number {
    font-family: monospace;
    font-size: .75rem;
    width: 1.98rem;
    text-align: center;
    color: var(--palette-2);
    user-select: none; 
    line-height: .2rem;
  }
  .end {
    display:flex; 
    flex-direction: column;
    font-family: 'Roboto Mono', monospace;
    font-size: 1.25rem;
    font-weight: 200;
    color: var(--strand-end);
    user-select: none; 
    padding: .75rem 0;
    position: relative;
  }
  .base-pair.selected { box-shadow: inset 0 0 0 1px var(--palette-2); }
  .ds-selected {
      background-color: var(--light-text);
      color: var(--palette-4);
    }
  .project-sheet{ overflow: hidden;}

	@media only screen and (max-width: 1280px) {
    .nucleotide { padding: .3rem 0.35rem; }
    .number { width: 1.68rem; }
    .end { padding: .5rem 0; font-size: 1.2rem; }
    .project-sheet{ overflow-x: auto;}
    .project-row { min-width: 630px; }
  }
</style>
    