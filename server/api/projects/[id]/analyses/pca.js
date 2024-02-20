// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

	// get runtime config
	const config = useRuntimeConfig()

	// get project id
	const { id } = event.context.params

  // handle query params (GET)
  let { pc } = getQuery(event);

	// get pca data
	const uri = `${config.public.externalApi}v1/projects/${id}/analyses/pca`
	const response = await $fetch(uri)
							.catch((error) => {
									setResponseStatus(event, error.status)
									return { message: error.message }
							});

  if(pc) {
    // return pca for two selected principal components

    const pcs = pc.split(',').map(Number)
    let pca = []
    if(pcs.length === 2 && response.data.projections.hasOwnProperty(pcs[0] - 1) && response.data.projections.hasOwnProperty(pcs[1] - 1)){
      const r = pcs.map(index => response.data.projections[index - 1]);
      pca = r;
    }

    return {
      pca: pca
    }

  } else {
    // return all the eigenvalues and percentages

    // calculate the number of eigenvalues to consider
    const eigenvalues_cutoff = response.data.projections.length;
    // sum all the eigenvalues
    const sum = response.data.eigenvalues.reduce((acc, val) => acc + val, 0);
    // calculate the percentage of the first eigenvalues_cutoff items over the total sum
    const percentages = response.data.eigenvalues.slice(0, eigenvalues_cutoff).map(item => Number(((item / sum) * 100).toFixed(2)));
    // eigenvalues and percentages
    const eigenvalues = response.data.eigenvalues.slice(0, eigenvalues_cutoff).map((item, index) => {
      return {
        ev: Number(item.toFixed(2)),
        var: percentages[index],
      }
    });

    return {
      eigenvalues: eigenvalues,
    }

  }

 });