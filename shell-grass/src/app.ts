import shader from './render.wgsl'

run()

async function run() {
  const canvas = setupCanvas()
  const { device, gpu } = await getWebgpu(canvas)

  await render(device, gpu)
}

function setupCanvas() {
  console.log('Nav', navigator.gpu)
  if (!('gpu' in navigator)) {
    webGpuIsNotSupported()
    throw new Error('gpu should be in navigator.')
  }
  console.debug('🎉🎉🎉 WebGPU is supported! 🎉🎉🎉')

  const canvas = document.createElement('canvas')
  canvas.style.height = '100vh'
  canvas.style.width = '100vw'
  document.body.append(canvas)

  return canvas
}

async function getWebgpu (canvas: HTMLCanvasElement) {
  const adapter = await navigator.gpu.requestAdapter()
  if (adapter === null) {
    webGpuIsNotSupported()
    throw new Error('Adapter should not be null.')
  }
  const device = await adapter.requestDevice()

  const gpu = canvas.getContext('webgpu')
  if (gpu === null) {
    webGpuIsNotSupported()
    throw new Error('Webgpu context on canvas should not be null.')
  }
  gpu.configure({
    device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: 'opaque',
  })

  return { device, gpu }
}

function webGpuIsNotSupported() {
  const noWebgpuDiv = document.createElement('div')
  noWebgpuDiv.style.textAlign = 'center'
  noWebgpuDiv.innerHTML ='<p>😞 No WebGPU is supported, but this demo requires WebGPU 😞</p><p>Please use chrome unstable and enable WebGPU, Vulkan & SkiaRenderer</p>'
  document.body.textContent = '' // clear body
  document.body.append(noWebgpuDiv)
  console.error('😞 No WebGPU is supported, but this demo requires WebGPU 😞\n Please use chrome unstable and enable WebGPU, Vulkan & SkiaRenderer')
}

async function render (device: GPUDevice, gpu: GPUCanvasContext) {
  const module = device.createShaderModule({ code: shader })

  const pipeline = device.createRenderPipeline({
    label: 'Render Pipeline',
    vertex: {
      module,
      entryPoint: 'vert_main'
    },
    fragment: {
      module,
      entryPoint: 'frag_main',
      targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }]
    },
    primitive: {
      topology: 'triangle-list',
    },
    layout: 'auto'
  })

  const commandEncoder = device.createCommandEncoder()

  const passEncoder = commandEncoder.beginRenderPass({
    colorAttachments: [{
      view: gpu.getCurrentTexture().createView(),
      clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
      loadOp: 'clear',
      storeOp: 'store',
    }]
  })

  passEncoder.setPipeline(pipeline)
  passEncoder.draw(6, 1, 0, 0)
  passEncoder.end()

  // finish render pass
  device.queue.submit([commandEncoder.finish()])
  await device.queue.onSubmittedWorkDone()
}

