import { Render } from '@demo/engine/Render';
import * as THREE from 'three';
import vs from './vs.glsl?raw';
import fs from './fs.glsl?raw';
import lenshen from '@demo/assets/img/leishen.png';
import dongman from '@demo/assets/img/dongman.png';
import bg_h from '@demo/assets/img/bg_h.jpg';
import keqing from '@demo/assets/img/keqing.jpg';
export class Flame {
	mapRender: Render;
	group: THREE.Group = new THREE.Group();
	constructor(el: string | HTMLElement) {
		this.mapRender = new Render(el, true, { stats: true });
		this.mapRender.scene.add(this.group);
	}
	dispose() {
		this.mapRender.dispose();
	}
	async render() {
		const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
		const bg_w_1 = await Render.textureLoader.loadAsync(lenshen);
		const bg_w_2 = await Render.textureLoader.loadAsync(dongman);
		const bg_h_1 = await Render.textureLoader.loadAsync(bg_h);
		const bg_h_2 = await Render.textureLoader.loadAsync(keqing);
		const material = new THREE.ShaderMaterial({
			vertexShader: vs,
			fragmentShader: fs,
			uniforms: {
				u_Time: Render.GlobalTime,
				u_bg: {
					value: this.mapRender.aspect > 1.25 ? bg_w_1 : bg_h_1,
				},
				u_bg2: {
					value: this.mapRender.aspect > 1.25 ? bg_w_2 : bg_h_2,
				},
			},
		});
		const mesh = new THREE.Mesh(geometry, material);
		this.mapRender.scene.add(mesh);
		mesh.scale.set(this.mapRender.canvasSize.x, this.mapRender.canvasSize.y, 1);
		this.mapRender.onSizeChange = () => {
			material.uniforms.u_bg.value = this.mapRender.aspect > 1.25 ? bg_w_1 : bg_h_1;
			material.uniforms.u_bg2.value = this.mapRender.aspect > 1.25 ? bg_w_2 : bg_h_2;
			material.uniformsNeedUpdate = true;
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
