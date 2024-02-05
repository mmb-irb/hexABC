<template>
	<v-layout>
		<v-navigation-drawer
			v-model="drawer"
			temporary
		>
			<div class="col-left pe-2">
				<h3>{{ title }}</h3>
				<h4>{{ selType }} {{ label }}</h4>
				<p>{{ description }}</p>
				<img :src="img" :alt="title" >

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
						icon="mdi-chevron-right"
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

	const { id, label, stype, img } = defineProps(['id', 'label', 'stype', 'img'])

  const { $curves } = useNuxtApp()

  const title = $curves[id].title
  const selType = $curves.type[stype]
  const description = $curves[id].description
  //const img = $curves[id].img

	// DRAWER
  const drawer = ref(false)

</script>

<style>
  #btn-close-drawer .v-btn__content i { left:-4px; }
  #btn-open-drawer .v-btn__content i { left:5px; }
</style>

<style scoped>
  .col-left {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    position: relative;
  }
  .col-left img { max-width: 90%; }
  #container-window { height: 500px; }

  #btn-close-drawer .v-btn__content i { left:-3px; }

  @media only screen and (max-width: 960px) {
    .col-left img { max-width: 80%; }
  }
  </style>
    