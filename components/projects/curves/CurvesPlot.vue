<template>
	<v-layout>
		<v-navigation-drawer
			v-model="drawer"
			temporary
		>
			<div class="col-left pe-3">
				<h3 class="mt-2 mb-3">{{ title }}</h3>
				<h4 v-if="selType && label">{{ selType }} {{ label }}</h4>
				<p class="mt-2">{{ description }}</p>
        <div class="container-img mt-1">
          <img :src="img" :alt="title" >
        </div>
				
				<v-tooltip text="Hide description" location="right">
					<template v-slot:activator="{ props }">
						<v-btn 
							density="compact" 
							color="blue-grey-lighten-4" 
							v-bind="props" 
							id="btn-close-drawer"
							icon="mdi-chevron-left"
							style="position: absolute; right:-13px; top:10px;"
							@click.stop="drawer = !drawer"
						></v-btn>
					</template>
				</v-tooltip>
			</div>
		</v-navigation-drawer>
	
		<v-main>
			<v-tooltip text="Show description" location="right">
				<template v-slot:activator="{ props }">
					<v-btn 
						density="compact" 
						color="blue-grey-lighten-4" 
						v-bind="props" 
						id="btn-open-drawer"
						icon="mdi-information-slab-symbol"
						style="position: absolute; left:-13px; top:10px;z-index:2;"
						@click.stop="drawer = !drawer"
					></v-btn>
				</template>
			</v-tooltip>

			<slot name="plot"></slot>
		</v-main>
	</v-layout>
</template>

<script setup>

	const { type, label, stype, img } = defineProps(['type', 'label', 'stype', 'img'])

  const { $curves } = useNuxtApp()

  const title = $curves.descriptions[type].title
  const selType = $curves.sel_type[stype]
  const description = $curves.descriptions[type].description

	// DRAWER
  const drawer = ref(false)

</script>

<style>
  #btn-close-drawer .v-btn__content i { left:-4px; }
  #btn-open-drawer .v-btn__content i { left:5px; }
  #btn-open-drawer .v-btn__content i  {
    animation: colorChange 3s infinite;
  }

  @keyframes colorChange {
    0% { color: var(--light-text); }
    50% { color: var(--palette-6); }
    100% { color: var(--light-text); }
  }
</style>

<style scoped>
  .col-left {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
  }
  .col-left h3 { font-size: 1.2rem; color: var(--palette-6); }
  .col-left p { font-size: .8rem;}
  .container-img { display: flex; justify-content: center; }
  /* set width instead of height because parent has flex-direction: column */
  .container-img img { 
    max-width: 100%; /* or whatever max-width you want */
    max-height: 250px; /* or whatever max-height you want */
    width: auto;
    height: auto; 
  }

  @media only screen and (max-width: 960px) {
    .col-left img { max-width: 80%; }
  }
  </style>
    