import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ELEMENTS } from '../data/elements';
import type { Molecule } from '../data/molecules';

const BOND_RADIUS = 0.07;
const BOND_COLOR = 0xd4d4d8;
/** Perpendicular offset between parallel cylinders used for double/triple bonds. */
const MULTI_BOND_OFFSET = 0.14;

function buildAtomSymbolSprite(symbol: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d')!;
  context.font = 'bold 72px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#0f172a';
  context.fillText(symbol, 64, 70);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    depthTest: false,
    transparent: true,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.5, 0.5, 0.5);
  return sprite;
}

/** A bond's parallel strands (1 for single, 2 for double, 3 for triple) plus a
 * per-frame updater that keeps them spread toward the current camera so they
 * never visually collapse into each other while the view rotates. */
interface BondVisual {
  meshes: THREE.Mesh[];
  update(camera: THREE.Camera): void;
}

function buildBondVisual(start: THREE.Vector3, end: THREE.Vector3, order: 1 | 2 | 3): BondVisual {
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const length = start.distanceTo(end);
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  // Offset scalars along the dynamic "screen-facing" axis for each strand.
  const offsetScalars = order === 1 ? [0] : order === 2 ? [0.5, -0.5] : [0, 1, -1];

  const geometry = new THREE.CylinderGeometry(BOND_RADIUS, BOND_RADIUS, length, 16);
  const material = new THREE.MeshStandardMaterial({ color: BOND_COLOR, roughness: 0.4 });

  const meshes = offsetScalars.map(() => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.quaternion.copy(quaternion);
    mesh.position.copy(midpoint);
    return mesh;
  });

  const fallbackRight = new THREE.Vector3(1, 0, 0);
  function update(camera: THREE.Camera) {
    if (order === 1) return;
    const viewDirection = new THREE.Vector3().subVectors(camera.position, midpoint).normalize();
    let right = new THREE.Vector3().crossVectors(direction, viewDirection);
    if (right.lengthSq() < 1e-6) right.copy(fallbackRight);
    right.normalize().multiplyScalar(MULTI_BOND_OFFSET);

    meshes.forEach((mesh, index) => {
      mesh.position.copy(midpoint).addScaledVector(right, offsetScalars[index]);
    });
  }

  return { meshes, update };
}

export interface MoleculeViewerHandle {
  setMolecule(molecule: Molecule): void;
  dispose(): void;
}

/**
 * Creates a self-contained Three.js ball-and-stick molecule viewer rendered
 * into the given canvas. Call {@link MoleculeViewerHandle.setMolecule} to
 * (re)build the displayed molecule and {@link MoleculeViewerHandle.dispose}
 * to tear down the renderer, animation loop and listeners.
 */
export function createMoleculeViewer(canvas: HTMLCanvasElement): MoleculeViewerHandle {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
  fillLight.position.set(-4, -2, -3);
  scene.add(fillLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.8;

  // The wheel event doubles as the OrbitControls zoom gesture; stop it from
  // also scrolling the host page, which would otherwise drag the whole
  // viewport (and this floating preview) out of view while zooming.
  canvas.addEventListener('wheel', (event) => event.preventDefault(), { passive: false });

  let moleculeGroup = new THREE.Group();
  scene.add(moleculeGroup);
  let bondVisuals: BondVisual[] = [];

  let frameId: number | null = null;
  const animate = () => {
    frameId = requestAnimationFrame(animate);
    controls.update();
    bondVisuals.forEach((bond) => bond.update(camera));
    renderer.render(scene, camera);
  };
  frameId = requestAnimationFrame(animate);

  const resizeObserver = new ResizeObserver(() => {
    const { clientWidth, clientHeight } = canvas;
    if (clientWidth === 0 || clientHeight === 0) return;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight, false);
  });
  resizeObserver.observe(canvas);

  function setMolecule(molecule: Molecule) {
    scene.remove(moleculeGroup);
    moleculeGroup.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: THREE.Material) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    moleculeGroup = new THREE.Group();
    bondVisuals = [];

    const center = new THREE.Vector3();
    molecule.atoms.forEach((atom) => {
      center.add(new THREE.Vector3(...atom.position));
    });
    center.divideScalar(molecule.atoms.length);

    const atomPositions = molecule.atoms.map(
      (atom) => new THREE.Vector3(...atom.position).sub(center),
    );

    molecule.bonds.forEach((bond) => {
      const bondVisual = buildBondVisual(
        atomPositions[bond.from],
        atomPositions[bond.to],
        bond.order,
      );
      bondVisual.meshes.forEach((mesh) => moleculeGroup.add(mesh));
      bondVisuals.push(bondVisual);
    });

    let boundingRadius = 1;
    molecule.atoms.forEach((atom, index) => {
      const info = ELEMENTS[atom.element];
      const geometry = new THREE.SphereGeometry(info.radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color: info.color, roughness: 0.35 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.copy(atomPositions[index]);
      moleculeGroup.add(sphere);

      const label = buildAtomSymbolSprite(info.symbol);
      label.position.copy(atomPositions[index]).add(new THREE.Vector3(0, info.radius + 0.35, 0));
      moleculeGroup.add(label);

      boundingRadius = Math.max(boundingRadius, atomPositions[index].length() + info.radius);
    });

    scene.add(moleculeGroup);

    const distance = boundingRadius * 3.2;
    camera.position.set(distance * 0.6, distance * 0.4, distance * 0.7);
    camera.near = Math.max(0.01, boundingRadius * 0.05);
    // Keep the zoom range (min/maxDistance) comfortably inside the far plane
    // so zooming out never pushes the camera past it — otherwise the whole
    // molecule gets clipped and appears to vanish.
    controls.minDistance = boundingRadius * 1.2;
    controls.maxDistance = distance * 2.5;
    camera.far = controls.maxDistance * 1.5;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function dispose() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    controls.dispose();
    moleculeGroup.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: THREE.Material) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    renderer.dispose();
  }

  return { setMolecule, dispose };
}
