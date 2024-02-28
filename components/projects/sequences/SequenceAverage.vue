<template>
	<v-sheet
		color="grey-lighten-4"
		class="pa-10 project-sheet"
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
				class="gr-nucl" 
				v-for="(item, index) in strand1"
				:key="index"
				:value="index"
				> 
					<div class="nucleotide" :id="`${item}-${index + 1}-strand1`">{{ item }} </div>

					<v-icon class="hbond" v-if="index < strand1.length - 1">
						mdi-dots-horizontal
					</v-icon>

					<v-icon class="vbond" v-if="index >= 1 && index < strand1.length - 1">
						mdi-dots-vertical
					</v-icon>

					<v-icon class="dbond" v-if="index >= 1 && index < strand1.length - 2">
						mdi-window-close
					</v-icon>
				</div>
			</div>
			<div class="end"> {{ ends1[1] }} </div>
		</v-row>
		<v-row class="pt-0 pb-2 px-4 project-row" justify="space-around">
			<div class="end"> {{ ends2[0] }} </div>
			<div class="d-flex">
				<div 
				class="gr-nucl" 
				v-for="(item, index) in strand2"
				:key="index"
				:value="index"
				> 
					<div class="nucleotide" :id="`${item}-${index + 1}-strand2`">{{ item }} </div> 

					<v-icon class="hbond" v-if="index < strand1.length - 1">
						mdi-dots-horizontal
					</v-icon>

				</div>
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

	const { strands, ends } = defineProps(['strands', 'ends'])
	const strand1 = strands.strand1
	const strand2 = strands.strand2
	const ends1 = ends.ends1
	const ends2 = ends.ends2

	const drawSequence = (section) => {
		switch(section) {
      case '0':
        document.querySelectorAll(`.hbond`).forEach(item => item.classList.add('bond-highlighted'))
        document.querySelectorAll(`.vbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.dbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.add('nucl-highlighted'))
        break;
      case '1':
        document.querySelectorAll(`.vbond`).forEach(item => item.classList.add('bond-highlighted'))
        document.querySelectorAll(`.hbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.dbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('nucl-highlighted'))
        document.querySelectorAll(`.nucleotide`).forEach(item => {
          var idx = parseInt(item.attributes.id.value.split('-')[1])
          if(idx > 1 && idx < strand1.length) item.classList.add('nucl-highlighted')
        })
        break;
      case '2':
        document.querySelectorAll(`.vbond`).forEach(item => item.classList.add('bond-highlighted'))
        document.querySelectorAll(`.hbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.dbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('nucl-highlighted'))
        document.querySelectorAll(`.nucleotide`).forEach(item => {
          var idx = parseInt(item.attributes.id.value.split('-')[1])
          if(idx > 1 && idx < strand1.length) item.classList.add('nucl-highlighted')
        })
        break;
      case '3':
        document.querySelectorAll(`.dbond`).forEach(item => item.classList.add('bond-highlighted'))
        document.querySelectorAll(`.hbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.vbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('nucl-highlighted'))
        document.querySelectorAll(`.nucleotide`).forEach(item => {
          var idx = parseInt(item.attributes.id.value.split('-')[1])
          if(idx > 1 && idx < strand1.length) item.classList.add('nucl-highlighted')
        })
        break;
      case '4':
        /*document.querySelectorAll(`.dbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.hbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.vbond`).forEach(item => item.classList.remove('bond-highlighted'))
        //document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('nucl-highlighted'))
        document.querySelectorAll(`.nucleotide`).forEach(item => {
          //var idx = parseInt(item.attributes.id.value.split('-')[1])
          //if(idx > 1 && idx < strand1.length) item.classList.add('nucl-highlighted')
          item.classList.add('nucl-highlighted')
        })*/
        document.querySelectorAll(`.dbond`).forEach(item => item.classList.add('bond-highlighted'))
        document.querySelectorAll(`.hbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.vbond`).forEach(item => item.classList.remove('bond-highlighted'))
        document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('nucl-highlighted'))
        document.querySelectorAll(`.nucleotide`).forEach(item => {
          var idx = parseInt(item.attributes.id.value.split('-')[1])
          if(idx > 1 && idx < strand1.length) item.classList.add('nucl-highlighted')
        })
        break;
    }
	}

	defineExpose({
		drawSequence
	});

</script>

<style scoped>
	.gr-nucl {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    /*background-color: red;*/
  }
  .nucleotide {
    font-family: 'Roboto Mono', monospace;
    font-size: 1.5rem;
    font-weight: 500;
    padding: .5rem 0.35rem;
    margin: 0 0.15rem;
    color: var(--nucl-dis);
    user-select: none; 
  }
  .hbond {
    position: absolute;
    top: 1rem;
    left: 1.4rem;
    font-size: 1rem;
    color: var(--bond-dis);
    z-index: 2;
  }
  .vbond {
    position: absolute;
    top: 2.15rem;
    left: .35rem;
    font-size: 1.2rem;
    color: var(--bond-dis);
    z-index: 2;
  }
  .dbond {
    position: absolute;
    top: 2.15rem;
    left: 1.3rem;
    color: var(--bond-dis);
    z-index: 2;
  }
  .bond-highlighted { color: var(--palette-5); }
  .nucl-highlighted{ background-color: var(--light-text); color: var(--palette-4); }

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
    .nucleotide { padding: .3rem 0.25rem; }
    .hbond { top: .8rem; left: 1.3rem; font-size:.8rem; }
    .vbond { top: 1.7rem; left: .4rem; font-size:1rem;  }
    .dbond { top: 1.8rem; left: 1.2rem; font-size: 1rem; }
    .number { width: 1.72rem; }
    .end { padding: .5rem 0; font-size: 1.2rem; }
    .project-sheet{ overflow-x: auto;}
    .project-row { min-width: 630px; }
  }

</style>
    