// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

  // get runtime config
  const config = useRuntimeConfig()

  // get project id and file to get  notes
  const { id, file } = event.context.params

  // get file filenotes
  const uri = `${config.public.externalApi}v1/projects/${id}/filenotes/${file}`

  const r = await $fetch(uri)
              .catch((error) => {
                  setResponseStatus(event, error.status)
                  return { message: error.message }
              });

  return r
  
});