<template>
	<div :class="`player ${props.position}`">
		<div class="frame">{{ currentFrame }}</div>

		<div class="menu-btn">
			<v-btn density="compact" icon="mdi-skip-previous" @click="skipFrame(-1)" color="red-lighten-5"></v-btn>
			<v-btn density="compact" icon="mdi-skip-next" @click="skipFrame(1)" color="red-lighten-5"></v-btn>
		</div>
	</div>
</template>

<script setup>

	const props = defineProps({
    trjMeta: Object,
		frame: Number,
		position: { type: String, default: 'b' }
  })

	const emit = defineEmits(['updateFrame']);

	const currentFrame = ref(props.frame)

	onBeforeUnmount(() => {
		currentFrame.value = 0
	})

	const skipFrame = (dir) => {
		
		let newFrame = parseInt(currentFrame.value += dir)
		if(newFrame < 1) newFrame = 1
		if(newFrame > props.trjMeta.metadata.frames) newFrame = props.trjMeta.metadata.frames

		emit('updateFrame', newFrame)

		currentFrame.value = newFrame
	}

</script>

<style scoped>
	.player {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 2;
	}
	.player.t { bottom: auto; right: auto; top: 0; left: 0; }
	.player.b { top: auto; right: auto; bottom: 0; left: 0; }
	.frame { left:10px; position: absolute; top: 0; font-size: 18px; font-weight: 700; color: #fff; text-shadow: #000 1px 1px 5px;}
	.player.b .frame { bottom: .5rem; top: auto; }
	.player.t .frame { top: .5rem; bottom: auto; }
	.menu-btn { right:0; position: absolute; top: 0; }
	.menu-btn button { margin-right: 5px; border-radius: 5px; }
	.player.b .menu-btn { bottom: .35rem; top: auto;}
	.player.t .menu-btn { top: .35rem; bottom: auto;}
</style>
