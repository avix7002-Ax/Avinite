import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface CinematicIntroProps {
  onComplete: () => void;
  skipAllowed?: boolean;
}

type Phase = 'space' | 'planet' | 'explosion' | 'logo' | 'welcome' | 'subtitle' | 'fadeout';

export function CinematicIntro({ onComplete, skipAllowed = true }: CinematicIntroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef(false);
  const [phase, setPhase] = useState<Phase>('space');
  const [fading, setFading] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const phaseRef = useRef<Phase>('space');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // GSAP text refs
  const welcomeToRef = useRef<HTMLDivElement>(null);
  const aviniteAiRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const loaderBarRef = useRef<HTMLDivElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);

  function setPhaseBoth(p: Phase) {
    phaseRef.current = p;
    setPhase(p);
  }

  // ── GSAP text animations ──
  function playWelcomeText() {
    if (!welcomeToRef.current || !aviniteAiRef.current) return;

    // "WELCOME TO" — staggered fade + rise
    gsap.fromTo(
      welcomeToRef.current,
      { opacity: 0, y: 30, letterSpacing: '0.8em', filter: 'blur(8px)' },
      { opacity: 1, y: 0, letterSpacing: '0.4em', filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
    );

    // "AVINITE AI" — 3D scale-in with glow pulse
    gsap.fromTo(
      aviniteAiRef.current,
      { opacity: 0, scale: 0.5, rotationY: -90, filter: 'drop-shadow(0 0 60px rgba(99,102,241,1)) brightness(2)' },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.6)) drop-shadow(0 0 60px rgba(139,92,246,0.4)) drop-shadow(0 4px 8px rgba(0,0,0,0.3)) brightness(1)',
        duration: 1.2,
        ease: 'back.out(1.4)',
        delay: 0.3,
      }
    );

    // Glow pulse after landing
    gsap.to(aviniteAiRef.current, {
      filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.8)) drop-shadow(0 0 80px rgba(139,92,246,0.5)) brightness(1.1)',
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.5,
    });
  }

  function playSubtitleText() {
    if (!subtitleRef.current) return;

    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
    );

    // Animate the gradient text inside
    const gradText = subtitleRef.current.querySelector('.subtitle-gradient');
    if (gradText) {
      gsap.fromTo(
        gradText,
        { opacity: 0, scale: 0.9, backgroundSize: '200% 100%' },
        { opacity: 1, scale: 1, backgroundSize: '100% 100%', duration: 1.2, ease: 'power2.out', delay: 0.2 }
      );
    }
  }

  function playLoaderBar() {
    if (!loaderBarRef.current) return;
    gsap.fromTo(
      loaderBarRef.current,
      { width: '0%' },
      { width: '100%', duration: 2.5, ease: 'power1.inOut' }
    );
  }

  useEffect(() => {
    // Animate skip button entrance
    if (skipBtnRef.current) {
      gsap.fromTo(
        skipBtnRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.5 }
      );
    }
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x030014, 1);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030014, 0.0008);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.set(0, 0, 300);

    // ── Starfield (5000 stars) ──
    const starCount = 5000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const r = 200 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);

      const c = Math.random();
      if (c < 0.6) { starColors[i * 3] = 1; starColors[i * 3 + 1] = 1; starColors[i * 3 + 2] = 1; }
      else if (c < 0.8) { starColors[i * 3] = 0.6; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 1; }
      else if (c < 0.95) { starColors[i * 3] = 0.7; starColors[i * 3 + 1] = 0.6; starColors[i * 3 + 2] = 1; }
      else { starColors[i * 3] = 1; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 0.6; }

      starSizes[i] = Math.random() * 2.5 + 0.5;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uTime;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float twinkle = 0.7 + 0.3 * sin(uTime * 2.0 + position.x * 0.01);
          gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.0, 0.5, d);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Nebula clouds ──
    const nebulas: THREE.Mesh[] = [];
    const nebulaColors = [0x4f46e5, 0x7c3aed, 0x3b82f6, 0x8b5cf6];
    for (let i = 0; i < 6; i++) {
      const geo = new THREE.SphereGeometry(80 + Math.random() * 60, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: nebulaColors[i % nebulaColors.length],
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400 - 200
      );
      scene.add(mesh);
      nebulas.push(mesh);
    }

    // ── Shooting stars ──
    interface ShootingStar { mesh: THREE.Line; vel: THREE.Vector3; life: number; maxLife: number; }
    const shootingStars: ShootingStar[] = [];

    function spawnShootingStar() {
      const points: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 0)];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
      const line = new THREE.Line(geo, mat);
      const sx = (Math.random() - 0.5) * 400;
      const sy = (Math.random() - 0.5) * 200 + 100;
      const sz = -100 - Math.random() * 200;
      line.position.set(sx, sy, sz);
      const vel = new THREE.Vector3((-0.5 - Math.random() * 0.5) * 3, (-0.3 - Math.random() * 0.3) * 3, 0);
      scene.add(line);
      shootingStars.push({ mesh: line, vel, life: 0, maxLife: 60 });
    }

    let shootTimer = 0;

    // ── 3D Planet ──
    const planetGroup = new THREE.Group();
    const planetGeo = new THREE.SphereGeometry(30, 64, 64);
    const planetMat = new THREE.MeshPhongMaterial({
      color: 0x4f46e5, emissive: 0x3b82f6, emissiveIntensity: 0.3,
      shininess: 80, transparent: true, opacity: 0,
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planet);

    const ringGeo = new THREE.RingGeometry(32, 42, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    planetGroup.add(ring);

    const atmoGeo = new THREE.SphereGeometry(34, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, side: THREE.BackSide });
    const atmo = new THREE.Mesh(atmoGeo, atmoMat);
    planetGroup.add(atmo);

    planetGroup.position.set(0, 0, 0);
    planetGroup.visible = false;
    scene.add(planetGroup);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0x404060, 0.5));
    const dirLight = new THREE.DirectionalLight(0x818cf8, 1);
    dirLight.position.set(50, 50, 100);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x8b5cf6, 2, 200);
    pointLight.position.set(0, 0, 50);
    scene.add(pointLight);

    // ── Explosion particles ──
    const explCount = 1500;
    const explGeo = new THREE.BufferGeometry();
    const explPos = new Float32Array(explCount * 3);
    const explVel: number[] = [];
    const explColors = new Float32Array(explCount * 3);
    const explSizes = new Float32Array(explCount);

    for (let i = 0; i < explCount; i++) {
      explPos[i * 3] = 0; explPos[i * 3 + 1] = 0; explPos[i * 3 + 2] = 0;
      const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      const speed = 1 + Math.random() * 4;
      explVel.push(dir.x * speed, dir.y * speed, dir.z * speed);
      const c = Math.random();
      if (c < 0.4) { explColors[i * 3] = 0.3; explColors[i * 3 + 1] = 0.5; explColors[i * 3 + 2] = 1; }
      else if (c < 0.7) { explColors[i * 3] = 0.5; explColors[i * 3 + 1] = 0.3; explColors[i * 3 + 2] = 1; }
      else { explColors[i * 3] = 1; explColors[i * 3 + 1] = 0.8; explColors[i * 3 + 2] = 1; }
      explSizes[i] = Math.random() * 3 + 1;
    }

    explGeo.setAttribute('position', new THREE.BufferAttribute(explPos, 3));
    explGeo.setAttribute('color', new THREE.BufferAttribute(explColors, 3));
    explGeo.setAttribute('size', new THREE.BufferAttribute(explSizes, 1));

    const explMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 1 } },
      vertexShader: `attribute float size; varying vec3 vColor; void main() { vColor = color; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * (300.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vColor; uniform float uOpacity; void main() { vec2 c = gl_PointCoord - 0.5; float d = length(c); if (d > 0.5) discard; gl_FragColor = vec4(vColor, (1.0 - smoothstep(0.0, 0.5, d)) * uOpacity); }`,
      vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const explPoints = new THREE.Points(explGeo, explMat);
    explPoints.visible = false;
    scene.add(explPoints);

    // ── Energy wave ──
    const waveGeo = new THREE.RingGeometry(1, 1.5, 64);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    wave.visible = false;
    scene.add(wave);

    // ── Logo particles (assemble into "A" shape) ──
    const logoCount = 800;
    const logoGeo = new THREE.BufferGeometry();
    const logoPos = new Float32Array(logoCount * 3);
    const logoTarget: number[] = [];
    const logoStart: number[] = [];
    const logoColors = new Float32Array(logoCount * 3);
    const logoSizes = new Float32Array(logoCount);

    for (let i = 0; i < logoCount; i++) {
      const t = Math.random();
      let tx: number, ty: number;
      if (t < 0.4) { const s = Math.random(); tx = -15 + s * 5; ty = -18 + s * 36; }
      else if (t < 0.8) { const s = Math.random(); tx = 15 - s * 5; ty = -18 + s * 36; }
      else { tx = (Math.random() - 0.5) * 16; ty = 2 + (Math.random() - 0.5) * 4; }
      const tz = (Math.random() - 0.5) * 4;
      logoTarget.push(tx, ty, tz);
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 100;
      logoStart.push(Math.cos(angle) * dist, Math.sin(angle) * dist, (Math.random() - 0.5) * 100);
      const c = Math.random();
      if (c < 0.5) { logoColors[i * 3] = 0.4; logoColors[i * 3 + 1] = 0.6; logoColors[i * 3 + 2] = 1; }
      else { logoColors[i * 3] = 0.6; logoColors[i * 3 + 1] = 0.4; logoColors[i * 3 + 2] = 1; }
      logoSizes[i] = Math.random() * 2 + 1;
    }

    for (let i = 0; i < logoCount; i++) {
      logoPos[i * 3] = logoStart[i * 3];
      logoPos[i * 3 + 1] = logoStart[i * 3 + 1];
      logoPos[i * 3 + 2] = logoStart[i * 3 + 2];
    }

    logoGeo.setAttribute('position', new THREE.BufferAttribute(logoPos, 3));
    logoGeo.setAttribute('color', new THREE.BufferAttribute(logoColors, 3));
    logoGeo.setAttribute('size', new THREE.BufferAttribute(logoSizes, 1));

    const logoMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 0 } },
      vertexShader: `attribute float size; varying vec3 vColor; void main() { vColor = color; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * (300.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vColor; uniform float uOpacity; void main() { vec2 c = gl_PointCoord - 0.5; float d = length(c); if (d > 0.5) discard; gl_FragColor = vec4(vColor, (1.0 - smoothstep(0.0, 0.5, d)) * uOpacity); }`,
      vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const logoPoints = new THREE.Points(logoGeo, logoMat);
    logoPoints.visible = false;
    scene.add(logoPoints);

    // ── Animation loop ──
    const clock = new THREE.Clock();
    let frameId: number;
    let elapsed = 0;
    let camZ = 300;
    let camTargetZ = 300;
    let logoAssembleProgress = 0;
    let explosionActive = false;
    let explosionTime = 0;
    let waveActive = false;
    let waveScale = 1;
    let fadeStartTime = 0;

    function animate() {
      frameId = requestAnimationFrame(animate);
      elapsed = clock.getElapsedTime();
      const dt = clock.getDelta();

      starMat.uniforms.uTime.value = elapsed;
      stars.rotation.y += 0.0003;
      stars.rotation.x += 0.0001;

      nebulas.forEach((n, i) => {
        n.rotation.x += 0.0002 * (i + 1);
        n.rotation.y += 0.0003 * (i + 1);
        n.position.x += Math.sin(elapsed * 0.1 + i) * 0.05;
      });

      shootTimer++;
      if (shootTimer > 40 && Math.random() < 0.05) { spawnShootingStar(); shootTimer = 0; }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.mesh.position.x += ss.vel.x;
        ss.mesh.position.y += ss.vel.y;
        ss.life++;
        (ss.mesh.material as THREE.LineBasicMaterial).opacity = Math.max(0, 0.8 * (1 - ss.life / ss.maxLife));
        if (ss.life >= ss.maxLife) {
          scene.remove(ss.mesh);
          ss.mesh.geometry.dispose();
          (ss.mesh.material as THREE.Material).dispose();
          shootingStars.splice(i, 1);
        }
      }

      const p = phaseRef.current;
      if (p === 'space') camTargetZ = 200;
      else if (p === 'planet') camTargetZ = 120;
      else if (p === 'explosion') camTargetZ = 100;
      else if (p === 'logo' || p === 'welcome' || p === 'subtitle') camTargetZ = 80;
      else if (p === 'fadeout') camTargetZ = 60;
      camZ += (camTargetZ - camZ) * 0.03;
      camera.position.z = camZ;
      camera.position.x = Math.sin(elapsed * 0.15) * 10;
      camera.position.y = Math.cos(elapsed * 0.1) * 5;
      camera.lookAt(0, 0, 0);

      if (p === 'planet' || p === 'explosion') {
        planetGroup.visible = true;
        planetMat.opacity = Math.min(planetMat.opacity + 0.02, 1);
        ringMat.opacity = Math.min(ringMat.opacity + 0.015, 0.6);
        atmoMat.opacity = Math.min(atmoMat.opacity + 0.01, 0.2);
        planet.rotation.y += 0.008;
        ring.rotation.z += 0.005;
        planetGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.1;
      }

      if (explosionActive) {
        explosionTime += dt;
        explPoints.visible = true;
        const posAttr = explGeo.getAttribute('position') as THREE.BufferAttribute;
        for (let i = 0; i < explCount; i++) {
          posAttr.array[i * 3] += explVel[i * 3];
          posAttr.array[i * 3 + 1] += explVel[i * 3 + 1];
          posAttr.array[i * 3 + 2] += explVel[i * 3 + 2];
          explVel[i * 3] *= 0.98; explVel[i * 3 + 1] *= 0.98; explVel[i * 3 + 2] *= 0.98;
        }
        posAttr.needsUpdate = true;
        (explMat.uniforms.uOpacity.value as number) = Math.max(0, 1 - explosionTime / 2);
        if (explosionTime > 0.1) {
          planetMat.opacity = Math.max(0, planetMat.opacity - 0.05);
          ringMat.opacity = Math.max(0, ringMat.opacity - 0.05);
          atmoMat.opacity = Math.max(0, atmoMat.opacity - 0.03);
        }
      }

      if (waveActive) {
        wave.visible = true;
        waveScale += 3;
        wave.scale.set(waveScale, waveScale, 1);
        waveMat.opacity = Math.max(0, 0.6 * (1 - waveScale / 200));
        if (waveScale > 200) { waveActive = false; wave.visible = false; }
      }

      if (p === 'logo' || p === 'welcome' || p === 'subtitle' || p === 'fadeout') {
        logoPoints.visible = true;
        logoAssembleProgress = Math.min(logoAssembleProgress + dt * 0.8, 1);
        (logoMat.uniforms.uOpacity.value as number) = Math.min((logoMat.uniforms.uOpacity.value as number) + dt * 2, 1);
        const posAttr = logoGeo.getAttribute('position') as THREE.BufferAttribute;
        for (let i = 0; i < logoCount; i++) {
          const e = logoAssembleProgress * logoAssembleProgress * (3 - 2 * logoAssembleProgress);
          posAttr.array[i * 3] = logoStart[i * 3] + (logoTarget[i * 3] - logoStart[i * 3]) * e;
          posAttr.array[i * 3 + 1] = logoStart[i * 3 + 1] + (logoTarget[i * 3 + 1] - logoStart[i * 3 + 1]) * e;
          posAttr.array[i * 3 + 2] = logoStart[i * 3 + 2] + (logoTarget[i * 3 + 2] - logoStart[i * 3 + 2]) * e;
        }
        posAttr.needsUpdate = true;
        logoPoints.rotation.y = Math.sin(elapsed * 0.5) * 0.05;
      }

      if (p === 'fadeout') {
        const fadeProgress = Math.min((elapsed - fadeStartTime) / 0.8, 1);
        starMat.opacity = Math.max(0, 1 - fadeProgress);
        explMat.uniforms.uOpacity.value = Math.max(0, (explMat.uniforms.uOpacity.value as number) - dt);
        logoMat.uniforms.uOpacity.value = Math.max(0, (logoMat.uniforms.uOpacity.value as number) - dt * 0.5);
        nebulas.forEach(n => { (n.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (n.material as THREE.MeshBasicMaterial).opacity - dt * 0.06); });
      }

      renderer.render(scene, camera);
    }

    // ── Phase timeline ──
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => { if (skipRef.current) return; setPhaseBoth('planet'); }, 800));

    timers.push(setTimeout(() => {
      if (skipRef.current) return;
      setPhaseBoth('explosion');
      explosionActive = true; explosionTime = 0; waveActive = true; waveScale = 1;
      playSound('explosion');
    }, 2200));

    timers.push(setTimeout(() => {
      if (skipRef.current) return;
      setPhaseBoth('logo');
      playSound('assemble');
    }, 3200));

    timers.push(setTimeout(() => {
      if (skipRef.current) return;
      setPhaseBoth('welcome');
      playSound('welcome');
      playWelcomeText();
    }, 3800));

    timers.push(setTimeout(() => {
      if (skipRef.current) return;
      setPhaseBoth('subtitle');
      playSubtitleText();
      playLoaderBar();
    }, 4400));

    timers.push(setTimeout(() => {
      if (skipRef.current) return;
      fadeStartTime = elapsed;
      setPhaseBoth('fadeout');
      setFading(true);
    }, 5000));

    timers.push(setTimeout(() => {
      if (skipRef.current) return;
      cleanup();
      onCompleteRef.current();
    }, 5800));

    function cleanup() {
      skipRef.current = true;
      cancelAnimationFrame(frameId);
      timers.forEach(clearTimeout);
      gsap.killTweensOf('*');
      shootingStars.forEach(ss => { scene.remove(ss.mesh); ss.mesh.geometry.dispose(); (ss.mesh.material as THREE.Material).dispose(); });
      [starGeo, starMat, explGeo, explMat, logoGeo, logoMat, planetGeo, planetMat, ringGeo, ringMat, atmoGeo, atmoMat, waveGeo, waveMat].forEach(o => o.dispose());
      nebulas.forEach(n => { n.geometry.dispose(); (n.material as THREE.Material).dispose(); });
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    }

    // ── Sound effects ──
    let audioCtx: AudioContext | null = null;
    function getAudioCtx(): AudioContext | null {
      if (audioCtx) return audioCtx;
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        audioCtx = new AC();
        return audioCtx;
      } catch { return null; }
    }

    function playTone(freq: number, start: number, dur: number, vol: number, type: OscillatorType = 'sine') {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    }

    function playNoise(start: number, dur: number, vol: number) {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * dur;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime + start);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + start + dur);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      noise.start(ctx.currentTime + start);
      noise.stop(ctx.currentTime + start + dur);
    }

    function playSound(type: 'explosion' | 'assemble' | 'welcome') {
      const ctx = getAudioCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();
      if (type === 'explosion') {
        playNoise(0, 1.2, 0.3);
        playTone(80, 0, 1, 0.2, 'sine');
        playTone(120, 0.1, 0.8, 0.15, 'sine');
      } else if (type === 'assemble') {
        playTone(523.25, 0, 0.5, 0.1, 'sine');
        playTone(659.25, 0.15, 0.5, 0.1, 'sine');
        playTone(783.99, 0.3, 0.6, 0.08, 'sine');
      } else if (type === 'welcome') {
        playTone(261.63, 0, 0.3, 0.06, 'triangle');
        playTone(329.63, 0.1, 0.3, 0.06, 'triangle');
        playTone(392.0, 0.2, 0.4, 0.06, 'triangle');
      }
    }

    animate();

    function onResize() {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cleanup();
      window.removeEventListener('resize', onResize);
      if (audioCtx) { try { audioCtx.close(); } catch { /* ignore */ } }
    };
  }, []);

  function handleSkip() {
    skipRef.current = true;
    gsap.killTweensOf('*');
    setFading(true);
    setTimeout(() => onCompleteRef.current(), 400);
  }

  if (webglFailed) {
    return <CSSFallbackIntro onComplete={onComplete} skipAllowed={skipAllowed} />;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#030014]"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1)' }}
    >
      <div ref={mountRef} className="absolute inset-0" />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* WELCOME TO */}
        <div
          ref={welcomeToRef}
          className="text-sm sm:text-base font-medium tracking-[0.4em] text-blue-300/70 mb-4 sm:mb-6"
          style={{ opacity: 0, perspective: '400px' }}
        >
          WELCOME TO
        </div>

        {/* AVINITE AI — metallic glowing text with 3D reveal */}
        <h1
          ref={aviniteAiRef}
          className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-center"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #c4b5fd 35%, #818cf8 65%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: 0,
            transformStyle: 'preserve-3d',
          }}
        >
          AVINITE AI
        </h1>

        {/* "The Universe of Intelligent Learning" */}
        <div
          ref={subtitleRef}
          className="mt-8 sm:mt-10 text-center px-6"
          style={{ opacity: 0 }}
        >
          <div className="text-lg sm:text-2xl font-light text-blue-200/90 tracking-wide">
            The
          </div>
          <div
            className="subtitle-gradient text-xl sm:text-3xl md:text-4xl font-medium mt-1 tracking-wide gradient-text-brand animate-gradient-x"
            style={{ opacity: 0, backgroundSize: '200% 100%' }}
          >
            Universe of Intelligent Learning
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-0.5 mt-12 sm:mt-14 bg-white/10 rounded-full overflow-hidden">
          <div
            ref={loaderBarRef}
            className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full"
            style={{ width: '0%' }}
          />
        </div>
      </div>

      {/* Lens flare overlay */}
      {(phase === 'explosion' || phase === 'logo') && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(99,102,241,0.08) 30%, transparent 70%)',
            animation: 'intro-lens-flare 2s ease-out forwards',
          }}
        />
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3,0,20,0.6) 100%)' }}
      />

      {/* Skip button */}
      {skipAllowed && !fading && (
        <button
          ref={skipBtnRef}
          onClick={handleSkip}
          className="absolute bottom-8 right-8 z-10 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white/50 hover:text-white/90 glass-panel border border-white/10 transition-all hover:scale-105 active:scale-95"
          style={{ opacity: 0 }}
        >
          Skip Intro
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">→</span>
        </button>
      )}
    </div>
  );
}

// ── CSS Fallback (when WebGL is not available) ──
function CSSFallbackIntro({ onComplete, skipAllowed }: { onComplete: () => void; skipAllowed?: boolean }) {
  const [phase, setPhase] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 200));
    timers.push(setTimeout(() => setPhase(2), 1600));
    timers.push(setTimeout(() => setPhase(3), 2600));
    timers.push(setTimeout(() => setPhase(4), 3700));
    timers.push(setTimeout(() => setFading(true), 4500));
    timers.push(setTimeout(() => onComplete(), 5100));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  function handleSkip() {
    setFading(true);
    setTimeout(onComplete, 300);
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#030014]"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.6s ease-out' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#030014] via-[#0a0a2e] to-[#1a0a2e]" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', animation: 'intro-galaxy-rotate 20s linear infinite' }}
      />
      {[...Array(80)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
            animation: `intro-starfield ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`, opacity: 0.5,
          }}
        />
      ))}
      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="text-sm font-medium tracking-[0.4em] text-blue-300/70 mb-4" style={{ opacity: phase >= 1 ? 1 : 0, transition: 'all 0.6s ease' }}>WELCOME TO</div>
        <h1
          className="font-display text-5xl sm:text-7xl font-bold text-center"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #c4b5fd 40%, #818cf8 70%, #6366f1 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.5))',
            opacity: phase >= 1 ? 1 : 0, transition: 'all 0.8s ease',
          }}
        >AVINITE AI</h1>
        <div className="mt-8 text-center" style={{ opacity: phase >= 3 ? 1 : 0, transition: 'all 0.8s ease' }}>
          <div className="text-lg font-light text-blue-200/90">The</div>
          <div className="text-xl font-medium gradient-text-brand mt-1">Universe of Intelligent Learning</div>
        </div>
      </div>
      {skipAllowed && !fading && (
        <button onClick={handleSkip} className="absolute bottom-8 right-8 text-xs text-white/40 hover:text-white/80 transition-colors">Skip Intro</button>
      )}
    </div>
  );
}
