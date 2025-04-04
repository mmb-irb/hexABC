// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

  // get runtime config
  const config = useRuntimeConfig()

  // get project id
  const { id } = event.context.params

  // get pdb structure in PDB format
  const uri = `${config.public.externalApi}v1/projects/${id}/structure`

  const response = await $fetch(uri)
              .catch((error) => {
                  setResponseStatus(event, error.status)
                  return { message: error.message }
              });

  setResponseHeaders(event, {
    "Content-Disposition": `attachment; filename=${id}.pdb`,
    "Content-Type": "chemical/x-pdb; charset=latin1",
  });

  return response
  
});