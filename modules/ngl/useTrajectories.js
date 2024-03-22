import { onMounted } from 'vue'

let NGL

const BYTES_PER_COORDINATE = 4; // float 32
const COORDINATES_PER_ATOM = 3; // x, y and z
const BYTES_PER_ATOM = BYTES_PER_COORDINATE * COORDINATES_PER_ATOM;

const stopTraj = ref(false)
const currentFrame = ref(0)
const currentTrajectory = ref(null)
const percentLoaded = ref(0)

export default function useTrajectories() {

  const { $globals } = useNuxtApp()

  const getNGLObject = () => {
    const { $NGL } = useNuxtApp()
    NGL = $NGL
  }

  onMounted(() => { 
    getNGLObject()
  })

  // This converts the trajectory payload (i.e. atom coordinates in raw binary data) into NGL formatted coordinates
  const payloadToNGLCoordinates = (
    trajectoryData,
    trajectoryAtoms,
    trajectoryFrames,
  ) => {
    // Parse binary to coordinates
    const trajectoryCoordinates = new Float32Array(trajectoryData);
    try {
      // Save all coordinates here
      // This array is to be returned at the end
      const overallCoordinates = [];
      for (let i = 0; i < trajectoryFrames; i++) {
        // Create a new array with the length of the number of atoms in the pdbFile * 3
        const coordinates = new Float32Array(
          trajectoryAtoms * COORDINATES_PER_ATOM,
        );
        coordinates.set(
          trajectoryCoordinates.subarray(
            i * trajectoryAtoms * COORDINATES_PER_ATOM,
            (i + 1) * trajectoryAtoms * COORDINATES_PER_ATOM,
          ),
        );
        // Push the new coordinates each frame
        overallCoordinates.push(coordinates);
      }
      return overallCoordinates;
    } catch (error) {
      // If this fails the topology may not match the trajectory in atom number
      return null;
    }
  };

  // Join 2 ArrayBuffer
  const appendBuffer = (buffer1, buffer2) => {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  }

  // creates a new Frames object with the initial trajectory data (first chunk)
  const initNGLTrajectory = function (payload, atoms, frames) {

    // get coordinates from payload
    const coordinatesPerFrame = payloadToNGLCoordinates(
      payload,
      atoms,
      frames
    );

    const traj = new NGL.Frames('Dynamically generated trajectory', '');
    traj.coordinates = coordinatesPerFrame;

    return traj

  }

  // updates the trajectory object with new data (new chunk of coordinates)
  const updateNGLTrajectory = function (trj, payload, atoms, frames) {

    // Find out how many frames are already loaded
    const currentFrames = trj.frames.length;

    // Calculate how many bytes we must discard and discard them from the begining of the array buffer
    const discardBytes = currentFrames * atoms * BYTES_PER_ATOM;
    const newTrajectoryData = payload.slice(discardBytes);
    const newTrajectoryFrames = frames - currentFrames;

    // get coordinates from payload
    const coordinates = payloadToNGLCoordinates(
      newTrajectoryData,
      atoms,
      newTrajectoryFrames
    );

    // Add the new coordinates to the trajectory object
    trj.frames = trj.frames.concat(coordinates);

    return coordinates

  }

  const loadTrajectory = async (url, atoms, trajectoryFinalExpectedFrames, component) => {

    const response = await fetch(url)
    
    const totalBytes = response.headers.get('content-length')

    const reader = response.body.getReader()
    //let chunks = []
    let totalLength = 0
    let payload = new Uint8Array(0)

    const trajectoryPayloads = []

    let playerisPlaying = false

    let done, value
    // Read the stream until it's done
    while (!done && !stopTraj.value) {

      ({ done, value } = await reader.read())

      // Break when the stream is done
      if (done) {
        break
      }

      //chunks.push(value);
      totalLength += value.length;

      //console.log(totalLength / totalBytes * 100)
      percentLoaded.value = totalLength / totalBytes * 100

      // Append the new data to the payload
      payload = appendBuffer(payload, value)

      // Add the main data to the array of payloads
      // Substract data from not completed frames
      const bytesPerFrame = atoms * BYTES_PER_ATOM
      const fitLength =
        Math.floor(payload.byteLength / bytesPerFrame) * bytesPerFrame
      const fitPayload = payload.slice(0, fitLength)
      trajectoryPayloads.push(fitPayload)

      let totalPayload
      // Join all payloads into a single trajectory
      if (trajectoryPayloads.length === 1)
        totalPayload = trajectoryPayloads[0]
      else
        totalPayload = trajectoryPayloads.reduce((cb, nb) =>
          appendBuffer(cb, nb),
        )

      // carculate frames loaded
      const totalFrames = payload.byteLength / bytesPerFrame;
      // get last frame loaded
      const lastFrameIndex = totalFrames - 1 > 0 ? totalFrames - 1 : 0

      let t
      let framesLoaded
      // If the trajectory is not loaded yet, create it
      if(component.trajList.length === 0) {

        const traj = initNGLTrajectory(totalPayload, atoms, totalFrames)
        t = component.addTrajectory(traj)
        // initialize the trajectory object
        currentTrajectory.value = t

        currentTrajectory.value.trajectory.signals.frameChanged.add((f) => {
          //console.log('frame', f)
          currentFrame.value = f
        })
        
      } else {
        // If the trajectory is already loaded, update it        
        framesLoaded = currentTrajectory.value.trajectory.frames.length

        const coords = updateNGLTrajectory(currentTrajectory.value.trajectory, totalPayload, atoms, totalFrames)

        // check if the trajectory loading is completed
        const completedTrajectory =
            totalFrames === trajectoryFinalExpectedFrames

        // update player parameters
        const nglPlayer = currentTrajectory.value.trajectory.player
        // Set animation player parameters
        nglPlayer.setParameters({
          end: lastFrameIndex,
          mode: completedTrajectory ? 'once' : 'loop',
          timeout: $globals.trajectories.defaultTimeout,
          interpolateStep: 100 / framesLoaded, // This must be set every time
        });

        // start player once we heve some coordinates and they are not all 0
        if(!playerisPlaying && coords.length > 0 && !coords[0].every(value => value === 0)) {
          component.setVisibility(true)
          nglPlayer.play()
          playerisPlaying = true
        }

        /*let frameIndex = currentTrajectory.value.trajectory._currentFrame
        if (frameIndex === -1) {
          frameIndex = 0;
        }*/

      }

    }

    // clean buffer
    payload = new Uint8Array(0);

    console.log('trajectory loaded!')

  }

  
  const initLoadingTrajectory = () => {
    stopTraj.value = false
  }

  const stopLoadingTrajectory =  () => {
    stopTraj.value = true
  }

  const getCurrentFrame = () => {
    return currentFrame.value
  }
  
  const getPercentLoaded = () => {
    return percentLoaded.value
  }

  const pauseTrajectory = () => {
    //console.log(currentTrajectory.value)
    currentTrajectory.value.trajectory.player.pause()
  }

  const trajectorySetFrame = (frame) => {
    //console.log(frame)
    currentTrajectory.value.setFrame(frame)
  }

  const playTrajectory = () => {
    currentTrajectory.value.trajectory.player.play()
  }

  return { 
    initLoadingTrajectory,
    stopLoadingTrajectory,
    loadTrajectory,
    getCurrentFrame,
    getPercentLoaded,
    pauseTrajectory,
    trajectorySetFrame,
    playTrajectory
  }

}