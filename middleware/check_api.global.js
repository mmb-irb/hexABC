import structureSettings from '@/modules/structure/structureSettings'

// this middleware is used to check if the API is working
export default defineNuxtRouteMiddleware(async (to, from) => {

  const { setProperty } = structureSettings()

  const config = useRuntimeConfig()
  const uri = config.public.externalApi;

  const data = await useFetch(uri)

  if(data.status.value === 'error') {
    // if we are on a page that uses the API, show the error
    if(to.path.includes('projects') || to.path.includes('results') || to.path.includes('rest')) {
      return showError(createError({ statusCode: 500, message: 'REST API not working', fatal: true })) 
    } else {
      // otherwise, just set the bannerApiError property to true
      setProperty('bannerApiError', true)
    }
  } else {
    // if the API is working, set the bannerApiError property to false
    setProperty('bannerApiError', false)
  }

});