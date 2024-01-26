// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

    // get runtime config
    const config = useRuntimeConfig()

    // get project id
    const { id } = event.context.params

    const uri = `${config.public.externalApi}v1/projects/${id}`

    const response = await $fetch(uri)
                .catch((error) => {
                    setResponseStatus(event, error.status)
                    return { message: error.message }
                });

    return response
    

 });