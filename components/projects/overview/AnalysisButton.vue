<template>
  <v-hover v-slot:default="{ isHovering, props }">
		<v-card
			class="mx-auto"
		>
		<NuxtLink :to="`/projects/${id}/${slug}`"
			v-bind="props"
			:class="isHovering ? 'bg-link-hover' : 'bg-link'">
			<v-img
				:src="image"
				height="200px"
				cover
				v-bind="props"
				:class="isHovering ? 'bg-img-hover' : 'bg-img'"
			>
			</v-img>
		</NuxtLink>

		<v-card-title>
			<NuxtLink :to="`/projects/${id}/${slug}`">{{ title }}</NuxtLink>
		</v-card-title>

		</v-card>
	</v-hover>
</template>

<script setup>
	const { id, image, slug, title } = defineProps(['id', 'image', 'slug', 'title'])
</script>

<style scoped>
	.v-card .v-card-title { border-top: 1px solid var(--grey-light); text-align: center; z-index:2; position: inherit; background-color: #fff; }
  .v-card .v-card-title a { text-decoration: none; }
	.bg-link {
    display: block;
    transition: background-color 0.3s ease;
  }
  .bg-link-hover {
    display: block;
    transition: background-color 0.3s ease;
    background-color: rgba(0, 0, 0, 0.15);
  }
  .bg-img {
    transition: transform 0.3s ease;
  }
  .bg-img-hover {
    transition: transform 0.3s ease;
    transform: scale(1.05);
  }
</style>
    