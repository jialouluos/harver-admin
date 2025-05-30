import { Render } from '@demo/engine/Render';
import * as THREE from 'three';
import vs from './vs.glsl?raw';
import fs from './fs.glsl?raw';

export class Loop {
	mapRender: Render;
	group: THREE.Group = new THREE.Group();
	constructor(el: string | HTMLElement) {
		this.mapRender = new Render(el, true, { stats: false });
		this.mapRender.scene.add(this.group);
	}
	dispose() {
		this.mapRender.dispose();
	}
	async render() {
		const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

		const material = new THREE.ShaderMaterial({
			vertexShader: vs,
			fragmentShader: fs,
			uniforms: {
				u_Time: Render.GlobalTime,
			},
		});
		const mesh = new THREE.Mesh(geometry, material);
		this.mapRender.scene.add(mesh);
		mesh.scale.set(this.mapRender.canvasSize.x, this.mapRender.canvasSize.y, 1);
		this.mapRender.onSizeChange = () => {
			mesh.scale.set(this.mapRender.canvasSize.x, this.mapRender.canvasSize.y, 1);
		};
		this.startRender();
	}
	startRender = () => {
		this.mapRender.render();
	};
	pauseRender = () => {
		this.mapRender.stopRender();
	};
}
