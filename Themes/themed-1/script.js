/*********
 * made by Matthias Hurrle (@atzedent) 
 */
const dpr = window.devicePixelRatio

function compile(shader, source) {
  gl.shaderSource(shader, source)
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
  }
}

let gl, programs = [], vertices, buffer;

function setup() {
  gl = canvas.getContext("webgl2")
  
  const vs = gl.createShader(gl.VERTEX_SHADER)
  const vertexSource = document.querySelector('script[type="x-shader/x-vertex"]').innerText
  
  compile(vs, vertexSource)

  let files = Array.from(document.querySelectorAll('script[type="x-shader/x-fragment"]'))
  let shaders = files.map(p => p.innerText)

  for (let i=0; i<3; i++) {
    shaders = [...shaders, ...shaders]
  }

  programs = shaders.map(() => gl.createProgram())

  for (let i = 0; i < shaders.length; i++) {
    let addr = gl.createShader(gl.FRAGMENT_SHADER)
    let program = programs[i]

    const a = document.createElement("div")
    a.classList.add("card")
    a.dataset.title = files[i%files.length].dataset.title
    window.titles.appendChild(a)
    program.clip = a

    compile(addr, shaders[i])

    gl.attachShader(program, vs)
    gl.attachShader(program, addr)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
    }
  }

  vertices = [
            -1., -1., 1.,
            -1., -1., 1.,
            -1., 1., 1.,
            -1., 1., 1.,
        ]

  gl.enable(gl.SCISSOR_TEST)
  buffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  for (let program of programs) {
    const position = gl.getAttribLocation(program, "position")

    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    // uniforms come here...
    program.resolution = gl.getUniformLocation(program, "resolution")
    program.time = gl.getUniformLocation(program, "time")
  }
}

function dispose() {
  if (gl) {
    const ext = gl.getExtension("WEBGL_lose_context")
    if (ext) ext.loseContext()
    gl = null
  }
}

let borderSize = 18

function draw(now, program, full) {
  const element = program.clip
  const rect = element.getBoundingClientRect();

  if (rect.bottom < 0 || rect.top > gl.canvas.clientHeight ||
    rect.right < 0 || rect.left > gl.canvas.clientWidth) {
    if (!full) return; // it's off screen
  }

  let width = Math.ceil(rect.width * dpr);
  let height = Math.ceil(rect.height * dpr);
  const left = Math.ceil(rect.left * dpr);
  const bottom = Math.floor(canvas.height - rect.bottom * dpr);

  if (!full) {
    gl.viewport(left, bottom, width, height);
    gl.scissor(left+borderSize, bottom+borderSize, width-borderSize*2, height-borderSize*2); // css border
  } else {
    gl.viewport(0,0,canvas.width, canvas.height)
    gl.scissor(0,0,canvas.width,canvas.height)
    width = canvas.width
    height= canvas.height
  }
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.useProgram(program)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  // uniforms come here...
  gl.uniform2f(program.resolution, width, height)
  gl.uniform1f(program.time, now * 1e-3)

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length * .5)
}

let handle, then = 0, iter = 0, fullBg = true

function loop(now) {
  if (now - then > 4000) {
    then = now
    iter++
  }

  gl.canvas.style.transform = `translateY(${window.scrollY}px)`;

  if (fullBg) {
    draw(now, programs[iter%programs.length], true)
  }

  for (let program of programs) {
    draw(now, program, false)
  }

  handle = requestAnimationFrame(loop)
}

function init() {
  dispose()
  setup()
  resize()
  loop(0)
}

function resize() {
  const {
    innerWidth: width,
    innerHeight: height
  } = window

  canvas.width = Math.ceil(width * dpr)
  canvas.height = Math.ceil(height * dpr)
}

window.onresize = resize

let timeout, scrollY = 0, activeEl

function execute(fn, delayed) {
  if (delayed) {
    timeout = setTimeout(fn, delayed)
  } else {
    fn()
  }
}

const fullstring = "fullscreen"

function goFull(element) {
  element.classList.add(fullstring)
  scrollY = window.scrollY
  borderSize = 0
  fullBg = false
  window.scrollTo(0, 0)
  activeEl = null
}

const smallScreens = window.matchMedia('(max-width: 599px)')
const largeScreens = window.matchMedia('(min-width: 600px)')

window.onpointerdown = e => {
  if (e.target.classList.contains("card")) {
    if (e.target.classList.contains(fullstring)) {
      e.target.classList.remove(fullstring)
      window.scrollTo(0, scrollY)
      handleLargeScreens(largeScreens)
      fullBg = true
      activeEl = null
    } else {
      const immed = activeEl === e.target
      
      execute(
        ()=>goFull(e.target),
        e.pointerType === "touch" && !immed ? 800 : 0
      )
      activeEl = e.target
    }
  } 
}
window.onpointermove = e => {
  if (Math.abs(e.movementY) < 5) return
  if (timeout) {
    clearTimeout(timeout)
  }
  activeEl = null
}
window.onpointerup = e => {
  if (timeout) {
    clearTimeout(timeout)
  }
}

function handleLargeScreens(query) {
  if (query.matches) {
    borderSize = 18
  }
}
function handleSmallScreens(query) {
  if (query.matches) {
    borderSize = 0
  }
}
function handleOrientation(query) {
  if (query.matches) {
    window.scrollTo(0, 0)
  }
}

largeScreens.addEventListener("change",  handleLargeScreens)
handleLargeScreens(largeScreens)

smallScreens.addEventListener("change",  handleSmallScreens)
handleSmallScreens(smallScreens)

const orntn = window.matchMedia('(orientation: portrait)')
orntn.addEventListener("change", handleOrientation)

init()