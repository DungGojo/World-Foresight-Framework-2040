import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { intro, earthTextures } from '../content/site';
import { asset } from '../lib/assets';
import { useReducedMotion } from '../hooks/useReducedMotion';
import ArrowIcon from '../components/ArrowIcon';
import './Intro.css';

/* Photoreal Earth intro (ported from Part 1 §7). Day/night city-lights shader,
   clouds, fresnel atmosphere, ocean glint, stars + Milky-Way, camera fly-in. */
export default function Intro({ onBegin }) {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const diveRef = useRef(0);
  const handoffRef = useRef(null);
  const [diving, setDiving] = useState(false);
  const reduce = useReducedMotion();

  const beginStory = () => {
    if (diving) return;
    setDiving(true);
    diveRef.current = performance.now();
    handoffRef.current = window.setTimeout(onBegin, reduce ? 360 : 1850);
  };

  useEffect(() => () => window.clearTimeout(handoffRef.current), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const reduceMotion = reduce;
    let raf = null,
      disposed = false;
    const revealHero = () => hero && hero.classList.add('show');

    if (typeof THREE === 'undefined') {
      revealHero();
      return;
    }

    let renderer, scene, camera, earthGroup, earth, clouds, stars, sky;
    let zoomDone = false;
    const ZOOM_MS = 2600;
    const zNear = () => {
      const a = camera ? camera.aspect : 1;
      return a >= 1 ? 4.55 : 4.55 + (1 - a) * 3.6;
    };
    const zFar = () => {
      const a = camera ? camera.aspect : 1;
      return a >= 1 ? 9.6 : 9.6 + (1 - a) * 3.6;
    };
    let pointerX = 0, pointerY = 0, parX = 0, parY = 0;
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    function proceduralTexture() {
      const cv = document.createElement('canvas');
      cv.width = 1024; cv.height = 512;
      const g = cv.getContext('2d');
      const grad = g.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#0b2a4a'); grad.addColorStop(0.5, '#123a66'); grad.addColorStop(1, '#0b2a4a');
      g.fillStyle = grad; g.fillRect(0, 0, 1024, 512);
      const blob = (x, y, r, col) => {
        const rg = g.createRadialGradient(x, y, r * 0.2, x, y, r);
        rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
      };
      const land = '#2e5230', land2 = '#3b5a2e';
      blob(180, 200, 95, land); blob(240, 150, 70, land2); blob(300, 330, 80, land);
      blob(520, 180, 80, land2); blob(560, 260, 95, land); blob(610, 340, 60, land2);
      blob(760, 210, 85, land); blob(860, 360, 55, land2);
      g.fillStyle = 'rgba(240,248,255,.92)'; g.fillRect(0, 0, 1024, 26); g.fillRect(0, 486, 1024, 26);
      return new THREE.CanvasTexture(cv);
    }

    function loadTex(spec, onload) {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      const srcs = [asset(spec.localPath), spec.url];
      let i = 0;
      (function next() {
        if (i >= srcs.length) return;
        const src = srcs[i++];
        loader.load(src, (t) => onload(t), undefined, () => next());
      })();
    }
    function waterInverted(tex) {
      try {
        const img = tex.image, cv = document.createElement('canvas');
        cv.width = cv.height = 8;
        const g = cv.getContext('2d');
        g.drawImage(img, img.width * 0.06, img.height * 0.5, 4, 4, 0, 0, 8, 8);
        return g.getImageData(4, 4, 1, 1).data[0] < 128;
      } catch (e) { return false; }
    }

    const EARTH_VERT = `varying vec2 vUv;varying vec3 vN;varying vec3 vView;
      void main(){vUv=uv;vec4 wp=modelMatrix*vec4(position,1.0);
      vN=normalize(mat3(modelMatrix)*normal);vView=normalize(cameraPosition-wp.xyz);
      gl_Position=projectionMatrix*viewMatrix*wp;}`;
    const EARTH_FRAG = `uniform sampler2D dayMap;uniform sampler2D nightMap;uniform sampler2D waterMap;uniform sampler2D bumpMap;
      uniform float uNight;uniform float uWater;uniform float uBump;uniform float uWaterInv;uniform vec3 sunDir;
      varying vec2 vUv;varying vec3 vN;varying vec3 vView;
      void main(){vec3 N=normalize(vN);vec3 V=normalize(vView);float ndl=dot(N,sunDir);
      float dayMix=smoothstep(-0.10,0.25,ndl);vec3 dayCol=texture2D(dayMap,vUv).rgb;float relief=1.0;
      if(uBump>0.5){float h=texture2D(bumpMap,vUv).r;relief=0.90+0.20*h;}
      float diff=max(ndl,0.0);vec3 lit=dayCol*relief*(0.10+1.30*diff);
      float term=smoothstep(0.0,0.16,ndl)*(1.0-smoothstep(0.16,0.46,ndl));lit+=dayCol*term*vec3(0.32,0.15,0.04);
      vec3 nightCol=vec3(0.0);if(uNight>0.5){nightCol=texture2D(nightMap,vUv).rgb;}
      nightCol=pow(nightCol,vec3(0.85))*vec3(1.0,0.86,0.62)*1.35;
      vec3 col=mix(nightCol+vec3(0.010,0.014,0.026),lit,dayMix);float w=0.32;
      if(uWater>0.5){w=texture2D(waterMap,vUv).r;if(uWaterInv>0.5)w=1.0-w;}
      vec3 R=reflect(-sunDir,N);float spec=pow(max(dot(R,V),0.0),68.0)*w*smoothstep(0.0,0.14,ndl);
      col+=vec3(1.0,0.92,0.78)*spec*0.55;float fres=pow(1.0-max(dot(N,V),0.0),2.7);
      col+=vec3(0.24,0.44,0.85)*fres*(0.22+0.5*dayMix);gl_FragColor=vec4(col,1.0);}`;
    const CLOUD_FRAG = `uniform sampler2D map;uniform vec3 sunDir;uniform float uOpacity;
      varying vec2 vUv;varying vec3 vN;varying vec3 vView;
      void main(){vec4 t=texture2D(map,vUv);float a=max(max(t.r,t.g),t.b)*t.a;
      float ndl=dot(normalize(vN),sunDir);float light=0.07+1.08*max(ndl,0.0);
      float fres=pow(1.0-max(dot(normalize(vN),normalize(vView)),0.0),2.0);
      gl_FragColor=vec4(vec3(light),a*uOpacity*(1.0-0.35*fres));}`;
    const ATMO_VERT = `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);
      gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
    const ATMO_FRAG = `varying vec3 vN;void main(){float i=max(pow(0.62-dot(vN,vec3(0.0,0.0,1.0)),3.0),0.0);
      gl_FragColor=vec4(vec3(0.30,0.58,1.0),1.0)*i*1.35;}`;

    let zoomStart = 0, lastT = 0;
    const onResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const onPointer = (e) => {
      pointerX = e.clientX / window.innerWidth - 0.5;
      pointerY = e.clientY / window.innerHeight - 0.5;
    };

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x05070d);
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 400);
      camera.position.z = reduceMotion ? zNear() : zFar();

      const SUN = new THREE.Vector3(5, 2.2, 4).normalize();
      earthGroup = new THREE.Group();
      earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
      earthGroup.position.x = camera.aspect > 1.15 ? 1.2 : 0;
      scene.add(earthGroup);

      const uniforms = {
        dayMap: { value: proceduralTexture() }, nightMap: { value: null },
        waterMap: { value: null }, bumpMap: { value: null },
        uNight: { value: 0 }, uWater: { value: 0 }, uBump: { value: 0 }, uWaterInv: { value: 0 },
        sunDir: { value: SUN },
      };
      earth = new THREE.Mesh(
        new THREE.SphereGeometry(2, 96, 96),
        new THREE.ShaderMaterial({ uniforms, vertexShader: EARTH_VERT, fragmentShader: EARTH_FRAG })
      );
      earthGroup.add(earth);

      const T = earthTextures;
      loadTex(T.day, (t) => { t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); uniforms.dayMap.value = t; });
      loadTex(T.night, (t) => { uniforms.nightMap.value = t; uniforms.uNight.value = 1; });
      loadTex(T.water, (t) => { uniforms.waterMap.value = t; uniforms.uWater.value = 1; uniforms.uWaterInv.value = waterInverted(t) ? 1 : 0; });
      loadTex(T.topology, (t) => { uniforms.bumpMap.value = t; uniforms.uBump.value = 1; });

      const cloudU = { map: { value: null }, sunDir: { value: SUN }, uOpacity: { value: 0.62 } };
      clouds = new THREE.Mesh(
        new THREE.SphereGeometry(2.025, 96, 96),
        new THREE.ShaderMaterial({ uniforms: cloudU, vertexShader: EARTH_VERT, fragmentShader: CLOUD_FRAG, transparent: true, depthWrite: false })
      );
      clouds.visible = false; earthGroup.add(clouds);
      loadTex(T.clouds, (t) => { cloudU.map.value = t; clouds.visible = true; });

      let atmo;
      try {
        atmo = new THREE.Mesh(
          new THREE.SphereGeometry(2.29, 64, 64),
          new THREE.ShaderMaterial({ vertexShader: ATMO_VERT, fragmentShader: ATMO_FRAG, side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false })
        );
      } catch (e) {
        atmo = new THREE.Mesh(new THREE.SphereGeometry(2.34, 48, 48), new THREE.MeshBasicMaterial({ color: 0x2b5a9e, transparent: true, opacity: 0.14, side: THREE.BackSide }));
      }
      // Keep the atmosphere attached to the shifted globe. Adding it to the
      // scene created a second blue sphere behind the Earth on wide screens.
      earthGroup.add(atmo);

      // stars
      const n = 2400, pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const r = 60 + Math.random() * 60, th = Math.acos(2 * Math.random() - 1), ph = Math.random() * Math.PI * 2;
        pos[i * 3] = r * Math.sin(th) * Math.cos(ph); pos[i * 3 + 1] = r * Math.cos(th); pos[i * 3 + 2] = r * Math.sin(th) * Math.sin(ph);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const scv = document.createElement('canvas'); scv.width = scv.height = 32;
      const sg = scv.getContext('2d'); const srg = sg.createRadialGradient(16, 16, 0, 16, 16, 16);
      srg.addColorStop(0, 'rgba(255,255,255,1)'); srg.addColorStop(0.4, 'rgba(230,238,255,.55)'); srg.addColorStop(1, 'rgba(230,238,255,0)');
      sg.fillStyle = srg; sg.fillRect(0, 0, 32, 32);
      stars = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.85, sizeAttenuation: true, map: new THREE.CanvasTexture(scv), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
      scene.add(stars);

      loadTex(earthTextures.sky, (t) => {
        sky = new THREE.Mesh(new THREE.SphereGeometry(180, 32, 32), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, color: 0x9aa4c0, depthWrite: false }));
        scene.add(sky);
      });

      window.addEventListener('resize', onResize);
      window.addEventListener('pointermove', onPointer, { passive: true });

      zoomStart = performance.now();
      if (reduceMotion) { zoomDone = true; revealHero(); }

      const loop = (now) => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min((now - (lastT || now)) / 1000, 0.05); lastT = now;
        const spin = (reduceMotion ? 0.018 : 0.055) * dt;
        if (earth) earth.rotation.y += spin;
        if (clouds) clouds.rotation.y += spin * 1.32;
        if (stars) stars.rotation.y += dt * 0.004;
        if (sky) sky.rotation.y += dt * 0.0018;
        if (!zoomDone) {
          const p = Math.min((now - zoomStart) / ZOOM_MS, 1);
          camera.position.z = zFar() + (zNear() - zFar()) * easeInOutCubic(p);
          if (p >= 1) { zoomDone = true; revealHero(); }
        } else if (diveRef.current) {
          const p = Math.min((now - diveRef.current) / 1700, 1);
          const ep = easeInOutCubic(p);
          camera.position.z = zNear() + (2.12 - zNear()) * ep;
          camera.position.x = parX * (1 - ep);
          camera.position.y = -parY * (1 - ep);
          earthGroup.position.x = (camera.aspect > 1.15 ? 1.2 : 0) * (1 - ep);
        } else {
          camera.position.z += (zNear() - camera.position.z) * 0.05;
          if (!reduceMotion) {
            const t = now / 1000;
            parX += (pointerX * 0.35 - parX) * 0.03; parY += (pointerY * 0.25 - parY) * 0.03;
            camera.position.x = Math.sin(t * 0.11) * 0.1 + parX;
            camera.position.y = Math.cos(t * 0.09) * 0.07 - parY;
          }
        }
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(loop);
    } catch (err) {
      revealHero();
    }

    // safety net: never leave a blank screen
    const safety = setTimeout(revealHero, reduceMotion ? 300 : 3600);

    return () => {
      disposed = true;
      clearTimeout(safety);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      try { renderer && renderer.dispose(); } catch (e) {}
    };
  }, [reduce]);

  return (
    <section id="intro" className={`screen${diving ? ' diving' : ''}`} aria-label="Introduction">
      <canvas id="bg" ref={canvasRef} aria-hidden="true" />
      <div className="intro-topline">
        <div className="intro-brand">{intro.kicker}</div>
      </div>
      <div className="hero" ref={heroRef}>
        <h1>{intro.headline}</h1>
        <p className="sub">{intro.subhead}</p>
        <p className="owner">{intro.owner}</p>
        <div className="row">
          <button className="intro-cta" onClick={beginStory} disabled={diving}>
            <span>{diving ? 'Entering the story' : intro.beginLabel}</span>
            <ArrowIcon />
          </button>
        </div>
      </div>
      <div className="atmosphere-veil" aria-hidden="true"><i /><i /><i /></div>
    </section>
  );
}
