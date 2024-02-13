// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

  // get runtime config
  const config = useRuntimeConfig()

  // get project id
  const { id, type } = event.context.params

  // get distance per residue data
  const uri = `${config.public.externalApi}v1/projects/${id}/analyses/dist-perres`

  const r1 = await $fetch(uri)
              .catch((error) => {
                  setResponseStatus(event, error.status)
                  return { message: error.message }
              });

  // get pdb topology structure
  const urit = `${config.public.externalApi}v1/projects/${id}/topology`

  const r2 = await $fetch(urit)
              .catch((error) => {
                  setResponseStatus(event, error.status)
                  return { message: error.message }
              });

  // get nucleotides
  const nucls = r2.residue_names.filter(item => /^(DA|DG|DC|DT)/.test(item));

  // divide nucleotides in two strands
  const half = Math.ceil(nucls.length / 2);
  const format = (item, index) => `${index + 1}${item.replace(/[^ACGT]/g, '')}`;
  const strand1 = nucls.slice(0, half).map(format);
  const strand2 = nucls.slice(half).map((item, index) => format(item, index + half));

  // get data by type (means / stdvs)
	const r = r1.data[0][type]

  return {
    strand1: strand1,
    strand2: strand2,
    data: r
  }
  
});