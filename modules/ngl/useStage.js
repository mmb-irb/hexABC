import { reactive, onMounted } from 'vue'
//import { Stage, Selection, DatasourceRegistry, MdsrvDatasource, /*setListingDatasource,*/ setTrajectoryDatasource, TrajectoryPlayer } from 'ngl'
//import * as NGL from 'ngl'
//import NGL from 'vue-ngl.client'

let stage = reactive({})
let selection = reactive({})
let NGL

export default function useStage() {

    const getNGLObject = () => {
      const { $NGL } = useNuxtApp()
      NGL = $NGL
    }

    onMounted(() => { 
      getNGLObject()
    })


    const createStage = (/*NGL,*/ layer) => {

        const mdsrvDatasource = new NGL.MdsrvDatasource( 'https://mmb.irbbarcelona.org/mdsrv/api/' )
        NGL.DatasourceRegistry.add("file", mdsrvDatasource)
        //setListingDatasource(mdsrvDatasource)
        NGL.setTrajectoryDatasource(mdsrvDatasource)

        stage = new NGL.Stage(layer, { tooltip:false/*, cameraType: 'perspective'*/ })
        //console.log('stage created')
        return stage 
        
    }

    const getStage = function () {
      //console.log('return stage')
      return stage
    }

    const createTrajectoryPlayer = function (traj, settings) {
      return new NGL.TrajectoryPlayer( traj, {
          step: settings.step,
          timeout:settings.timeout,
          start: settings.range[0],
          end: settings.range[1],
          interpolateType: settings.interpolation,
          mode: settings.loop ? "loop": "once",
          direction: settings.bounce ? "bounce": "forward"
      } ) 
  }
  
    return { 
        stage, 
        selection, 
        createStage,
        getStage,
        createTrajectoryPlayer
    }
  
  }