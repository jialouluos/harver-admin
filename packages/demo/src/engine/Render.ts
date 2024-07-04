import * as THREE from 'three';
import { EventEmitter } from 'eventemitter3';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { OrbitControls } from './_controls';
import { Stats } from './_stats';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import gsap from 'gsap';
import { _Math } from './Math';
import GCPool from './GCPool';
import { qiankunPublicPath } from '@jialouluo/tools/src/utils/qiankun';

interface I_Event {
	pointerUp: (mouseUp: THREE.Vector2, mousePos: THREE.Vector2) => void;
	pointerMove: (info: {
		pos: THREE.Vector2;
		dir: THREE.Vector2;
		coord: THREE.Vector2;
		isClick: boolean;
		relativeCoord: THREE.Vector2;
		speed: THREE.Vector2;
	}) => void;
	cameraChange: (camera: THREE.Camera) => void;
	cameraMove: (camera: THREE.Camera, pos: THREE.Vector3, target: THREE.Vector3) => void;
}

export class Render extends EventEmitter<I_Event> {
	/**朝上轴 */
	UP = new THREE.Vector3(0, 1, 0);
	/**挂载DOM */
	container: HTMLElement;
	/**画布大小 */
	canvasSize!: THREE.Vector2;
	/**渲染器 */
	renderer!: THREE.WebGLRenderer | null;
	/**CSS2D渲染器 */
	renderer2D!: CSS2DRenderer | null;
	/**CSS3D渲染器 */
	renderer3D!: CSS3DRenderer | null;
	/**透视相机 */
	perspectiveCamera!: THREE.PerspectiveCamera;
	/**正交相机 */
	orthographicCamera!: THREE.OrthographicCamera;
	/**场景 */
	scene: THREE.Scene = new THREE.Scene();
	/**灯光组 */
	lightGroups: THREE.Group = new THREE.Group();

	/**时间倍率 */
	timeScale: number = 1.0;
	/**模型解码器 */
	static modelLoadByDraco: GLTFLoader = new GLTFLoader().setDRACOLoader(
		new DRACOLoader().setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/')
	);
	/**模型加载器 */
	static modelLoadByGLTF: GLTFLoader = new GLTFLoader().setPath(qiankunPublicPath(''));
	/**纹理加载器 */
	static textureLoader: THREE.TextureLoader = new THREE.TextureLoader().setPath(qiankunPublicPath(''));
	/**HDR加载器 */
	static hdrLoader: RGBELoader = new RGBELoader().setPath(qiankunPublicPath('hdr/'));
	/**后处理通道 */
	composer!: EffectComposer;
	/**三方动画库 */
	$gsap: typeof gsap = gsap;
	/**三方调试库 */
	$gui!: GUI;
	/**三方性能探测器 */
	private $stats: any;
	/**射线投射器 */
	private _rayCaster: THREE.Raycaster = new THREE.Raycaster();
	/**时钟对象 */
	private _clock: THREE.Clock = new THREE.Clock();
	/**数学 */
	static math = new _Math();
	/**轨道控制器 */
	private _controls!: OrbitControls;
	private autoFov: boolean = false;
	/**鼠标移动 */
	mousePos = {
		current: new THREE.Vector2(-10000, -10000),
		last: new THREE.Vector2(-10000, -10000),
		click: new THREE.Vector2(-10000, -10000),
		onClick: false,
		relativeCoord: new THREE.Vector2(0, 0),
	};
	private isPerspective: boolean = true;
	private isInitFinish: boolean = false;
	private isEnableCSS2D: boolean = false;
	private isEnableCSS3D: boolean = false;
	/**GC */
	static GCPool = new GCPool();
	static GlobalTime = { value: 0.0 };
	static GlobalVar = {
		far: 1000000,
		near: 0.1,
		fov: 75,
		position: new THREE.Vector3(0, 200, 400),
		target: new THREE.Vector3(0, 0, 0),
	};
	private updating = false;
	constructor(
		el: string | HTMLElement,
		isShader: boolean,
		options: { helper?: boolean; stats?: boolean; gui?: boolean; isEnableCSS2D?: boolean; isEnableCSS3D?: boolean }
	) {
		super();
		if (isShader) {
			this.autoFov = true;
			Render.GlobalVar.position = new THREE.Vector3(0, 0, 200);
		}
		if (typeof el === 'string') {
			this.container = document.querySelector(el)!;
		} else {
			this.container = el;
		}
		if (!this.container) throw Error('container is null!');
		this.canvasSize = new THREE.Vector2(this.container.clientWidth, this.container.clientHeight);

		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			precision: 'highp',
			powerPreference: 'high-performance',
			logarithmicDepthBuffer: true,
		});
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;
		this.renderer.setClearColor('#000');
		this.renderer.setSize(this.canvasSize.x, this.canvasSize.y);
		this.container.appendChild(this.renderer.domElement);
		this.isEnableCSS2D = options.isEnableCSS2D ?? false;
		this.isEnableCSS3D = options.isEnableCSS3D ?? false;
		if (this.isEnableCSS2D) {
			this.renderer2D = new CSS2DRenderer();
			this.renderer2D.setSize(this.canvasSize.x, this.canvasSize.y);
			this.renderer2D.domElement.style.position = 'absolute';
			this.renderer2D.domElement.style.top = '0px';
			this.container.appendChild(this.renderer2D.domElement);
		}
		if (this.isEnableCSS3D) {
			this.renderer3D = new CSS3DRenderer();
			this.renderer3D.setSize(this.canvasSize.x, this.canvasSize.y);
			this.renderer3D.domElement.style.position = 'absolute';
			this.renderer3D.domElement.style.top = '0px';
			this.container.appendChild(this.renderer3D.domElement);
		}
		const position = Render.GlobalVar.position;
		const target = Render.GlobalVar.target;
		const zoom = Render.GlobalVar.position.length();

		this.lightGroups.add(new THREE.AmbientLight('#fff'));
		const dirLight = new THREE.DirectionalLight('#fff');
		dirLight.position.copy(position);
		this.lightGroups.add(dirLight);
		this.scene.add(this.lightGroups);

		this.createDebug({ ...options });

		this.perspectiveCamera = new THREE.PerspectiveCamera(
			Render.GlobalVar.fov,
			this.aspect,
			Render.GlobalVar.near,
			Render.GlobalVar.far
		);
		this.perspectiveCamera.position.copy(position);
		this.perspectiveCamera.lookAt(target);

		this.orthographicCamera = new THREE.OrthographicCamera(
			-zoom * this.aspect,
			zoom * this.aspect,
			zoom,
			-zoom,
			Render.GlobalVar.near,
			Render.GlobalVar.far
		);

		this.orthographicCamera.position.set(target.x, target.y, Render.GlobalVar.far / 2);
		this.orthographicCamera.lookAt(target);

		this._controls = new OrbitControls(this.perspectiveCamera, this.elTargetRenderer!.domElement);
		this._controls.target.copy(target);
		this._controls.addEventListener('change', () => {
			if (!this.updating) {
				this.emit('cameraMove', this.activeCamera, this.activeCamera.position, this._controls.target);
			}
		});
		this.container.tabIndex = 1000;
		this._controls.pan.screenSpacePanning = false;
		this._controls.enabled = !isShader;
		this._controls.listenToKeyEvents(this.container);

		this.addListener('cameraChange', () => {
			this._handleUpdateCamera();
		});
		this.addListener('cameraMove', () => {
			this._handleUpdateCamera();
		});
		this.addListenEvent();
		const resizeObserver = new ResizeObserver(this._handleCanvasSize);
		resizeObserver.observe(this.container!);
	}
	/**uniform u_Time */
	get u_Time() {
		return Render.GlobalTime;
	}
	get aspect() {
		return this.canvasSize.x / this.canvasSize.y;
	}
	get activeCamera() {
		return this.isPerspective ? this.perspectiveCamera : this.orthographicCamera;
	}
	get activeControls() {
		return this._controls;
	}
	get elTargetRenderer() {
		return this.isEnableCSS2D ? this.renderer2D : this.isEnableCSS3D ? this.renderer3D : this.renderer;
	}
	changeCamera() {
		this.isPerspective = !this.isPerspective;
		this.emit('cameraChange', this.activeCamera);
	}
	enableCameraShake(xSpeedScale: number = 1.0, ySpeedScale: number = 1.0) {
		this.addListener('pointerMove', ({ dir, speed }) => {
			this.activeCamera.position.x += dir.x * speed.x * xSpeedScale;
			this.activeCamera.position.y += dir.y * speed.y * ySpeedScale;
		});
	}
	getCameraCurrentState() {
		return {
			...Render.GlobalVar,
			distance: this._controls.getDistance(),
			phi: this._controls.getPolarAngle(),
			theta: this._controls.getAzimuthalAngle(),
			target: this._controls.target.clone(),
			aspect: this.aspect,
		};
	}
	useRayCaster(
		point: THREE.Vector2,
		recursive: boolean = false,
		objects: THREE.Object3D[] = [this.scene],
		normalize: boolean = true
	) {
		const cursorCoords = new THREE.Vector2();
		cursorCoords.x = normalize ? (point.x / this.container.clientWidth) * 2 - 1 : point.x;
		cursorCoords.y = normalize ? -(point.y / this.container.clientHeight) * 2 + 1 : point.y;
		this._rayCaster.setFromCamera(cursorCoords, this.activeCamera);
		return this._rayCaster.intersectObjects(objects, recursive);
	}
	createDebug(debug: { helper?: boolean; stats?: boolean; gui?: boolean }) {
		if (debug.helper) {
			this.scene.add(new THREE.AxesHelper(100000));
		}
		if (debug.stats) {
			this.$stats = Stats();
			this.container!.appendChild(this.$stats.domElement);
		}
		if (debug.gui) {
			this.$gui = new GUI();
		}
	}
	addCSS3DObject(content: string, rootClass?: string) {
		if (!this.isEnableCSS3D) return;
		const _element = document.createElement('div');
		_element.innerHTML = content;
		_element.className = rootClass ?? '';
		if (!rootClass) {
			_element.style.display = 'flex';
			_element.style.width = 'max-content';
			_element.style.height = 'max-content';
			_element.style.justifyContent = 'center';
			_element.style.alignItems = 'center';
		}
		return new CSS3DObject(_element);
	}
	addCSS2DObject(content: string, rootClass?: string) {
		if (!this.isEnableCSS2D) return;
		const _element = document.createElement('div');
		_element.innerHTML = content;
		_element.className = rootClass ?? '';
		if (!rootClass) {
			_element.style.display = 'flex';
			_element.style.width = 'max-content';
			_element.style.height = 'max-content';
			_element.style.justifyContent = 'center';
			_element.style.alignItems = 'center';
		}
		return new CSS2DObject(_element);
	}
	onRender = () => {};
	onSizeChange = () => {};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onTimeSliceChange = (_time: number) => {};
	/**销毁场景,释放内存 */
	dispose(): void {
		this.stopRender();
		Render.GCPool.track(this.scene);
		try {
			this.removeAllListeners();
			this.container.removeEventListener('pointerup', this._onPointerUp);
			this.container.removeEventListener('pointerdown', this._onPointerDown);
			this.container.removeEventListener('mousemove', this._onMouseMove);
			this.container.removeEventListener('keydown', this._onKeyDown);
			Render.GCPool && Render.GCPool.allDispose();
			this.scene.clear();
			this.$stats && this.container!.removeChild(this.$stats.domElement);
			this.$gui && document.querySelector('.lil-gui')?.remove();
			if (this.renderer) {
				this.renderer?.dispose();
				this.renderer?.forceContextLoss();
				const gl = this.renderer?.domElement.getContext('webgl');
				gl && gl.getExtension('WEBGL_lose_context');
				this.container!.removeChild(this.renderer.domElement);
				this.info();
				this.renderer = null;
			}
		} catch (e) {
			console.log(e);
		}
	}
	/**场景重渲染 */
	render(): void {
		if (this.renderer) {
			this._clock.start();
			this.renderer.setAnimationLoop(() => {
				if (this._clock) {
					Render.GlobalTime.value = Render.GlobalTime.value + this._clock.getDelta() * this.timeScale;
				}

				if (this.$stats) {
					this.$stats.update(this.renderer);
				}
				this.onTimeSliceChange(Render.GlobalTime.value);
				this.onRender();
				if (this.composer) {
					this.composer.render();
				} else {
					this.renderer!.render(this.scene, this.activeCamera);
					this.renderer2D?.render(this.scene, this.activeCamera);
					this.renderer3D?.render(this.scene, this.activeCamera);
				}
			});
		}
	}
	stopRender() {
		this.renderer?.setAnimationLoop(null);
		this._clock.stop();
	}
	/**日志 */
	public info() {
		console.log(this.renderer!.info);
		Render.GCPool.info();
	}
	addListenEvent(): void {
		window.onbeforeunload = () => {
			this.dispose();
		};
		window.onpopstate = () => {
			this.dispose();
		};
		this.container.addEventListener('pointerup', this._onPointerUp);
		this.container.addEventListener('pointerdown', this._onPointerDown);
		this.container.addEventListener('mousemove', this._onMouseMove);
		this.container.addEventListener('keydown', this._onKeyDown);
	}
	private _onMouseMove = (e: MouseEvent) => {
		this.mousePos.last.x = this.mousePos.current.x;
		this.mousePos.last.y = this.mousePos.current.y;
		this.mousePos.current.x = e.clientX;
		this.mousePos.current.y = e.clientY;
		const mouseDiff = this.mousePos.current.clone().sub(this.mousePos.last);
		if (this.mousePos.onClick) {
			this.mousePos.relativeCoord.add(mouseDiff.clone().divide(this.canvasSize.clone()));
		}

		if (this.mousePos.last.length() > 10000) {
			this.mousePos.last.x = e.clientX;
			this.mousePos.last.y = e.clientY;
		}
		const speedV2 = this.mousePos.current.clone().sub(this.mousePos.last).divideScalar(100);
		this.emit('pointerMove', {
			pos: this.mousePos.current,
			dir: mouseDiff.normalize(),
			speed: new THREE.Vector2(Math.abs(speedV2.x), Math.abs(speedV2.y)),
			coord: this.mousePos.current.clone().divide(this.canvasSize),
			isClick: this.mousePos.onClick,
			relativeCoord: this.mousePos.relativeCoord,
		});
	};
	private _onPointerUp = (e: PointerEvent) => {
		this.mousePos.onClick = false;
		this.emit('pointerUp', new THREE.Vector2(e.clientX, e.clientY), this.mousePos.click);
	};
	private _onPointerDown = (e: PointerEvent) => {
		this.mousePos.onClick = true;
		this.mousePos.click.x = e.clientX;
		this.mousePos.click.y = e.clientY;
	};
	private _onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'f') {
			this.changeCamera();
		}
	};
	private _handleCanvasSize = ([_entries]: ResizeObserverEntry[]) => {
		const width = _entries.contentRect.width;
		const height = _entries.contentRect.height;
		const newSize = new THREE.Vector2(width, height);
		const isNeedResetCanvasSize = this.canvasSize.equals(newSize);

		if (!isNeedResetCanvasSize || !this.isInitFinish) {
			this.isInitFinish = true;
			this.canvasSize.copy(newSize);
			this.renderer?.setPixelRatio(window.devicePixelRatio);
			this.renderer?.setSize(newSize.x, newSize.y, true);
			this.renderer2D?.setSize(newSize.x, newSize.y);
			this.renderer3D?.setSize(newSize.x, newSize.y);
			this.onSizeChange();
			this._handleUpdateCamera();
		}
	};
	private _handleUpdateCamera() {
		if (this.updating) return;
		this.updating = true;

		const state = this.getCameraCurrentState();

		this._handlePerspectiveCamera(state);

		this._controls.target.copy(state.target);

		if (this.isPerspective) {
			this._controls.minPolarAngle = -Math.PI;
			this._controls.maxPolarAngle = Math.PI;
			this._controls.maxDistance = state.far;
			this._controls.minDistance = state.near;
		} else {
			this._controls.minPolarAngle = this._controls.maxPolarAngle = state.phi;
		}

		this._handleOrthographicCamera(state);

		this._controls.update();

		this.updating = false;
	}
	private _handlePerspectiveCamera(state: Record<string, any>) {
		this.perspectiveCamera.fov = this.autoFov
			? Render.math.rad2Deg(2 * Math.atan(this.canvasSize.y / 2 / Render.GlobalVar.position.z))
			: state.fov;

		this.perspectiveCamera.near = state.near;
		this.perspectiveCamera.far = state.far;
		this.perspectiveCamera.aspect = state.aspect;

		this.perspectiveCamera.updateProjectionMatrix();
	}
	private _handleOrthographicCamera(state: Record<string, any>) {
		if (this.UP.clone().dot(new THREE.Vector3(0, 0, 1))) {
			this.orthographicCamera.position.set(state.target.x, state.target.y, 0); //y up -> 0; z up -> state.far/2
		} else {
			this.orthographicCamera.position.set(state.target.x, state.target.y, state.far / 2);
		}

		this.orthographicCamera.quaternion.setFromAxisAngle(this.UP.clone(), state.theta);
		this.orthographicCamera.left = (-state.distance / 2) * state.aspect;
		this.orthographicCamera.right = (state.distance / 2) * state.aspect;

		this.orthographicCamera.top = state.distance / 2;
		this.orthographicCamera.bottom = -state.distance / 2;
		if (this.UP.clone().dot(new THREE.Vector3(0, 0, 1))) {
			this.orthographicCamera.near = -state.far; //y up -> -state.far ; z up -> 0.1
		} else {
			this.orthographicCamera.near = 0.1; //y up -> -state.far ; z up -> 0.1
		}

		this.orthographicCamera.far = state.far;

		this.orthographicCamera.updateProjectionMatrix();
	}
}
