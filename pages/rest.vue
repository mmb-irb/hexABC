<template>
    <v-container>

      <h1>REST API documentation</h1>

      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon icon="mdi-circle-small"></v-icon>
        </template>
      </v-breadcrumbs>

      <v-card rounded="sm">

        <template v-slot:title>
            <v-icon size="small" icon="mdi-code-json"></v-icon> &nbsp;{{ $globals.shortName }} REST API
          </template>

          <template v-slot:text>

            <p>In this section there is the documentation for all the available public end points of the hexABC REST API. Click on each end point and its documentation will be expanded.</p>

            <v-divider></v-divider>

            <div class="swagger" id="swagger"></div>

            <v-btn
              prepend-icon="mdi-tray-arrow-down"
              color="red-lighten-1"
              class="mb-5 ms-5"
              @click="downloadSwagger" 
              >
                  Download swagger.json file
            </v-btn>
          </template>

      </v-card>

    </v-container>
  </template>
  
  <script setup>

  const { $globals } = useNuxtApp()
  const config = useRuntimeConfig()

  useHead({
    title: `REST API` 
  })

  const breadcrumbs =  [
    {
      title: 'About',
      disabled: false,
      to: '/',
    },
    {
      title: 'REST API',
      disabled: true
    }
  ]

  import SwaggerUI from 'swagger-ui'
  import 'swagger-ui/dist/swagger-ui.css'

  onMounted(async () => {

    const pjson = await import('../package.json')
    const spec = JSON.parse(JSON.stringify(await import('@/assets/settings/swagger.json')))

    spec.host = config.public.apiHost
    spec.info.version = pjson.version
    
    SwaggerUI({
        spec: spec,
        dom_id: '#swagger'
    })

    // remove title from DOM
    const tit = spec.info.title
    const titDOM = document.querySelector('.swagger-ui .info .title').innerHTML
    document.querySelector('.swagger-ui .info .title').innerHTML = titDOM.replace(tit, '')
  })

  const downloadSwagger = async() => {
    const swagger = JSON.parse(JSON.stringify(await import('@/assets/settings/swagger.json')))
    const pjson = await import('../package.json')
    swagger.default.host = config.public.apiHost
    swagger.default.info.version = pjson.version
    const blob = new Blob([JSON.stringify(swagger, null, 2)], {type : 'application/json'});

    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'swagger.json';
    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click();    
    a.remove();
  }

  </script>
  
  <style>
      hgroup.main { min-height: auto!important;}
      .swagger-ui .main { margin-bottom: 0!important; }
      .swagger-ui .info a { color: var(--palette-4); }
      .swagger-ui .info a:hover { color: #f33c28; }
      .swagger-ui .info .title { color:#555; font-size: 30px; }
      .swagger-ui .info { margin: 20px 0 0; }
      .swagger-ui .info .title small.version-stamp { background: var(--swagger-method); }
      .swagger-ui .info .title small { background: var(--palette-4); }
      .swagger-ui .info .description .markdown p { display:none; }
      .swagger-ui .model-example .model-box { width: 80%; }
      .swagger-ui .model .prop { justify-content: space-between; }
      .swagger-ui .model .prop .markdown p { margin-top:.5rem; }
      .swagger-ui .model-box-control:focus, .swagger-ui .models-control:focus, .swagger-ui .opblock-summary-control:focus { outline:none; }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { background: var(--swagger-method); }
      .swagger-ui .opblock.opblock-get { background: var(--swagger-bg); border-color: var(--palette-4); }
      .swagger-ui .opblock.opblock-get .opblock-summary { border-color: var(--palette-4); }
      .swagger-ui .btn.execute { background-color: var(--palette-4); border-color: var(--palette-4); }
      .swagger-ui table.model tr.property-row.required td:first-child { padding-top: .5rem!important; }
      .swagger-ui .prop-type { color: var(--palette-4); margin-top: 0.5rem; }
      .swagger-ui .prop-format { margin-top: 0.5rem; }
      .swagger-ui .model .prop { display: flex; }
      .swagger-ui .base-url { display:none; }
      .swagger-ui .info__license { display:none; }
      .swagger-ui table.model tr.description td { padding-top: .5rem!important; width: auto!important;}
      .swagger-ui table.model tr.description td .markdown p { margin: 0!important;}
      .swagger-ui section.models .model-box { width: 80%; }
      .swagger-ui .model-box { display: inherit;}
  
  </style>