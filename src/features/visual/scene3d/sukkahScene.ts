import type { Group, Material, Mesh } from 'three'
import type { SukkahBuildRules, SukkahBuildState } from './sukkahRules'

export interface SukkahSceneOptions {
  rules: SukkahBuildRules
  onStateChange?: (state: SukkahBuildState) => void
}

const FOOTPRINT = 4
const WALL_THICKNESS = 0.12
const SCHACH_LAYERS = 14

export async function mountSukkahScene(
  canvas: HTMLCanvasElement,
  initial: SukkahBuildState,
  options: SukkahSceneOptions,
) {
  const THREE = await import('three')

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)
  scene.fog = new THREE.Fog(0x87ceeb, 18, 42)

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100)
  camera.position.set(6.5, 5.5, 8.5)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true

  const ambient = new THREE.AmbientLight(0xfff4e0, 0.65)
  scene.add(ambient)

  const sun = new THREE.DirectionalLight(0xfff8e7, 1.1)
  sun.position.set(6, 12, 4)
  sun.castShadow = true
  scene.add(sun)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 24),
    new THREE.MeshStandardMaterial({ color: 0x5a8f4a, roughness: 0.95 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(1.1, 32),
    new THREE.MeshStandardMaterial({ color: 0xc9a227, roughness: 0.8 }),
  )
  rug.rotation.x = -Math.PI / 2
  rug.position.set(0, 0.01, 0.6)
  scene.add(rug)

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e6, roughness: 0.75 })
  const invalidMat = new THREE.MeshStandardMaterial({ color: 0xf4a6a6, roughness: 0.75 })
  const schachMat = new THREE.MeshStandardMaterial({ color: 0x6b4f2a, roughness: 0.9 })

  const wallsGroup = new THREE.Group()
  scene.add(wallsGroup)

  const schachGroup = new THREE.Group()
  scene.add(schachGroup)

  let state = { ...initial }
  let orbitTheta = 0.75
  let orbitPhi = 0.42
  let dragging = false
  let lastX = 0
  let lastY = 0
  let animationId = 0
  let disposed = false

  function wallPositions(count: number) {
    const half = FOOTPRINT / 2
    const positions: Array<{ x: number; z: number; rotY: number; w: number; d: number }> = []
    if (count >= 1) positions.push({ x: 0, z: -half, rotY: 0, w: FOOTPRINT, d: WALL_THICKNESS })
    if (count >= 2)
      positions.push({ x: -half, z: 0, rotY: Math.PI / 2, w: FOOTPRINT, d: WALL_THICKNESS })
    if (count >= 3)
      positions.push({ x: half, z: 0, rotY: Math.PI / 2, w: FOOTPRINT, d: WALL_THICKNESS })
    if (count >= 4) positions.push({ x: 0, z: half, rotY: 0, w: FOOTPRINT, d: WALL_THICKNESS })
    return positions
  }

  function clearGroup(group: Group) {
    for (let i = group.children.length - 1; i >= 0; i--) {
      const child = group.children[i] as Mesh
      child.geometry?.dispose()
      const mat = child.material
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat?.dispose()
      group.remove(child)
    }
  }

  function rebuildWalls(valid: boolean) {
    clearGroup(wallsGroup)
    const mat = valid ? wallMat : invalidMat
    for (const p of wallPositions(state.wallCount)) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(p.w, state.heightAmot, p.d), mat)
      mesh.position.set(p.x, state.heightAmot / 2, p.z)
      mesh.rotation.y = p.rotY
      mesh.castShadow = true
      mesh.receiveShadow = true
      wallsGroup.add(mesh)
    }
  }

  function rebuildSchach(valid: boolean) {
    clearGroup(schachGroup)
    const y = state.heightAmot + 0.04
    const span = FOOTPRINT - 0.35
    for (let i = 0; i < SCHACH_LAYERS; i++) {
      const along = -span / 2 + (i / (SCHACH_LAYERS - 1)) * span
      const stick = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, span), schachMat.clone())
      stick.position.set(along, y + (i % 2) * 0.03, 0)
      stick.rotation.y = (i % 3) * 0.08
      if (!valid) stick.material.color.setHex(0xb44a4a)
      stick.castShadow = true
      schachGroup.add(stick)
    }
    for (let j = 0; j < SCHACH_LAYERS; j++) {
      const along = -span / 2 + (j / (SCHACH_LAYERS - 1)) * span
      const stick = new THREE.Mesh(new THREE.BoxGeometry(span, 0.06, 0.08), schachMat.clone())
      stick.position.set(0, y + 0.05 + (j % 2) * 0.03, along)
      stick.rotation.y = (j % 2) * 0.06
      if (!valid) stick.material.color.setHex(0xb44a4a)
      stick.castShadow = true
      schachGroup.add(stick)
    }
  }

  function resize() {
    const parent = canvas.parentElement
    if (!parent) return
    const width = parent.clientWidth
    const height = Math.max(280, Math.min(420, width * 0.72))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  function updateCamera() {
    const radius = 11
    camera.position.x = radius * Math.sin(orbitTheta) * Math.cos(orbitPhi)
    camera.position.y = radius * Math.sin(orbitPhi) + 2
    camera.position.z = radius * Math.cos(orbitTheta) * Math.cos(orbitPhi)
    camera.lookAt(0, state.heightAmot * 0.45, 0)
  }

  function render(valid: boolean) {
    rebuildWalls(valid)
    rebuildSchach(valid)
    updateCamera()
    options.onStateChange?.(state)
  }

  function animate() {
    if (disposed) return
    animationId = requestAnimationFrame(animate)
    schachGroup.rotation.y = Math.sin(performance.now() * 0.00025) * 0.02
    renderer.render(scene, camera)
  }

  function onPointerDown(e: PointerEvent) {
    dragging = true
    lastX = e.clientX
    lastY = e.clientY
    canvas.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging) return
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    lastX = e.clientX
    lastY = e.clientY
    orbitTheta += dx * 0.008
    orbitPhi = Math.max(0.15, Math.min(1.1, orbitPhi + dy * 0.006))
    updateCamera()
  }

  function onPointerUp(e: PointerEvent) {
    dragging = false
    canvas.releasePointerCapture(e.pointerId)
  }

  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)

  const resizeObserver = new ResizeObserver(() => resize())
  if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)

  resize()
  animate()

  return {
    getState: () => state,
    setState(next: Partial<SukkahBuildState>, valid: boolean) {
      state = { ...state, ...next }
      render(valid)
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      renderer.dispose()
      wallMat.dispose()
      invalidMat.dispose()
      schachMat.dispose()
      ground.geometry.dispose()
      ;(ground.material as Material).dispose()
    },
  }
}
