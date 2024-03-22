<template>
	<div :class="`player ${props.position}`">
		<v-progress-linear
			:buffer-value="percentLoaded"
			color="red-lighten-1"
			:model-value="percentFrame"
			stream
			height="15"
			id="progress"
			@mousedown="onMouseDown"
			@mousemove="onMouseMove"
			@mouseleave="onMouseLeave"
			@mouseup="onMouseUp"
			@click.stop="seek"
		></v-progress-linear>

		<div class="frame">{{ currentFrame }}</div>

		<div class="menu-btn">
			<v-btn density="compact" icon="mdi-skip-previous" @click="skipFrame(-1)" color="red-lighten-5"></v-btn>
			<v-btn density="compact" :icon="trjIsRunning ? 'mdi-pause' : 'mdi-play'" @click="playPause()" color="red-lighten-1"></v-btn>
			<v-btn density="compact" icon="mdi-skip-next" @click="skipFrame(1)" color="red-lighten-5"></v-btn>
		</div>
	</div>
</template>

<script setup>

	import useTrajectories from '@/modules/ngl/useTrajectories'	

	const { 
		getCurrentFrame,
		getPercentLoaded,
		trajectorySetFrame,
		pauseTrajectory,
		playTrajectory,
    } = useTrajectories()

	const props = defineProps({
    trjMeta: Object,
		step: Number,
		position: { type: String, default: 'b' }
  })

	const updatingProgressAuto = ref(true);

	const currentFrame = computed(() => (getCurrentFrame() + 1) * props.step)
	const totalFrames = (props.trjMeta.metadata.frames / props.step) - 1
	const percentFrame = computed(() => {
		if(updatingProgressAuto.value) {
			return Math.ceil(getCurrentFrame() / totalFrames * 100)
		} else {
			return userProgress.value
		}
	})
	const percentLoaded = computed(() => getPercentLoaded())
	const trjIsRunning = computed(() => {
      if(getCurrentFrame() === totalFrames && playing.value) {
        playing.value = false
        return false
      }
      return getCurrentFrame() !== totalFrames && playing.value
    })

	const isSeeking = ref(false)
	const playing = ref(true)
	const userProgress = ref(0)

	const onMouseDown = (event) => {
		updatingProgressAuto.value = false
		playing.value = false
		isSeeking.value = true

		const rect = document.querySelector('#progress').getBoundingClientRect()
		userProgress.value = (event.offsetX / rect.width) * 100 < percentLoaded.value ? (event.offsetX / rect.width) * 100 : percentLoaded.value
	}


	const onMouseMove = (event) => {
		if (isSeeking.value) {
			const rect = document.querySelector('#progress').getBoundingClientRect()
			userProgress.value = (event.offsetX / rect.width) * 100 < percentLoaded.value ? (event.offsetX / rect.width) * 100 : percentLoaded.value
			seek()
		}
	}

	const onMouseUp = () => {
		if (isSeeking.value) {
			isSeeking.value = false
			seek()
		}
	}

	const onMouseLeave = () => {
		if (isSeeking.value) {
			isSeeking.value = false;
			seek()
		}
	}

	const seek = () => {
		pauseTrajectory()
		trajectorySetFrame(Math.ceil((userProgress.value / 100) * totalFrames))
	}

	const playPause = () => {
		playing.value = !playing.value
		if(playing.value) {
			updatingProgressAuto.value = true
			playTrajectory()
		} else {
			pauseTrajectory()
		}
	}

	const skipFrame = (dir) => {
		playing.value = false
		updatingProgressAuto.value = true
		pauseTrajectory()
		let newFrame
		newFrame = parseInt(getCurrentFrame() + dir)
		if(newFrame < 0) newFrame = 0
		if(newFrame > totalFrames) newFrame = totalFrames
		trajectorySetFrame(newFrame)
	}

</script>

<style>
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
	.player.b .frame { bottom: 1.6rem; top: auto; }
	.player.t .frame { top: 1.5rem; bottom: auto; }
	.menu-btn { right:0; position: absolute; top: 0; }
	.menu-btn button { margin-right: 5px; border-radius: 5px; }
	.player.b .menu-btn { bottom: 1.3rem; top: auto;}
	.player.t .menu-btn { top: 1.3rem; bottom: auto;}
</style>
