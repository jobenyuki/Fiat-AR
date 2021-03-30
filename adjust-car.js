import { toUrl, rotateAboutPoint, rotateGsapTo } from "./utils";

const adjustCar = {
  schema: {
    headlightNormal: { default: "#headlightNormal" },
    extension: { default: "jpg", oneOf: ["jpg", "png"] },
    format: { default: "RGBFormat", oneOf: ["RGBFormat", "RGBAFormat"] },
  },
  init() {
    const { data } = this;

    this.scene = this.el.sceneEl.object3D;
    this.camera = document.getElementById("camera");
    this.threeCamera = this.camera.getObject3D("camera");
    this.doorLockHotspot = document.getElementById("doorLockHotspot");
    this.doorLockHotspotObj = this.doorLockHotspot.object3D;
    this.leftDoorPivot = new THREE.Vector3(-65, 0, -57);
    this.rightDoorPivot = new THREE.Vector3(65, 0, -57);
    this.yAxis = new THREE.Vector3(0, 1, 0);
    this.doorAnimation = [];

    const headlightNormalTexture = new THREE.TextureLoader().load(
      toUrl(data.headlightNormal)
    );
    headlightNormalTexture.format = THREE[data.format];

    // Wait for model to load.
    this.el.addEventListener("model-loaded", () => {
      // Grab the mesh / scene.
      const obj = this.el.getObject3D("mesh");

      // Material redefine
      const sampleChromeMat = obj.getObjectByName("Plane015").material;
      const bodyMat = sampleChromeMat.clone();
      bodyMat.color = new THREE.Color(0.2696, 0.006, 0.0056);
      const crystalMat = sampleChromeMat.clone();
      crystalMat.color = new THREE.Color(0, 0, 0);
      crystalMat.opacity = 0.1;
      crystalMat.transparent = true;
      crystalMat.depthWrite = false;
      const headlightMat = sampleChromeMat.clone();
      headlightMat.normalMap = headlightNormalTexture;
      headlightMat.color = new THREE.Color(0.8, 0.8, 0.8);
      headlightMat.opacity = 0.5;
      headlightMat.depthWrite = false;
      headlightMat.refractionRatio = 0.75;
      headlightMat.transparent = true;
      headlightMat.roughness = 0;
      headlightMat.normalScale = new THREE.Vector2(1, -1);

      // Go over the submeshes and modify materials
      obj.traverse((child) => {
        if (child.isMesh && child?.material.name === "paint") {
          child.material = bodyMat;
        }
        if (child.isMesh && child?.material.name === "Cristal") {
          child.material = headlightMat;
        }
        if (
          child.isMesh &&
          (child?.material.name === "Cristal.001" ||
            child?.material.name === "Cristal.002")
        ) {
          child.material = crystalMat;
        }
        if (
          child.isMesh &&
          (child?.material.name === "tire_tread" ||
            child?.material.name === "tire_side")
        ) {
          const tireMat = child.material;
          tireMat.color = new THREE.Color("#000000");
          tireMat.metalness = 0.5;
        }
      });

      // Setup door animation
      const leftDoor = obj.getObjectByName("Plane006");
      const rightDoor = obj.getObjectByName("Plane050");
      this.doorAnimation = [
        rotateGsapTo({
          yRad2: -Math.PI / 4,
          object: leftDoor,
          pivot: this.leftDoorPivot,
          axis: this.yAxis,
        }),
        rotateGsapTo({
          yRad2: Math.PI / 4,
          object: rightDoor,
          pivot: this.rightDoorPivot,
          axis: this.yAxis,
        }),
        ...this.doorAnimation,
      ];

      // Add tap event listener to hotspot
      this.doorLockHotspot.addEventListener("click", () => {
        const { picked } = this.doorLockHotspotObj;

        if (picked) {
          this.doorAnimation[0].reverse();
          this.doorAnimation[1].reverse();
        } else {
          this.doorAnimation[0].play();
          this.doorAnimation[1].play();
        }

        this.doorLockHotspotObj.picked = !picked;
      });
    });
  },
  tick() {
    // Hotspot tracks camera
    this.doorLockHotspotObj.lookAt(this.camera.getAttribute("position"));

    // Keep same size from user
    const scaleVector = new THREE.Vector3();
    const scaleFactor = 10;
    const scale = Math.min(
      scaleVector
        .subVectors(
          this.doorLockHotspotObj.position,
          this.camera.getAttribute("position")
        )
        .length() / scaleFactor,
      65
    );

    this.doorLockHotspot.setAttribute("scale", { x: scale, y: scale, z: 1 });
  },
};

export { adjustCar };
