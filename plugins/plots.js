export default defineNuxtPlugin(() => {
	return {
		provide: {
			plots: {
				heatmap: {
					colorscale: ['#000000', '#0224ab', '#018f12' ,'#e8cf0e']
				}
			}
		}
	}
})