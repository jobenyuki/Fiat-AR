// Component that places trees at cursor location when screen is tapped
const tapPlaceCursorComponent = {
  init() {
    this.raycaster = new THREE.Raycaster();
    this.camera = document.getElementById("camera");
    this.threeCamera = this.camera.getObject3D("camera");
    this.ground = document.getElementById("ground");
    this.tapCursorIcon = this.el.object3D;
    this.model = document.getElementById("model");
    this.modelObj = this.model.object3D;
    this.doorLockHotspot = document.getElementById("doorLockHotspot");
    this.tapButton = document.getElementById("tapToPlace");

    // 2D coordinates of the raycast origin, in normalized device coordinates (NDC)---X and Y
    // components should be between -1 and 1.  Here we want the cursor in the center of the screen.
    this.rayOrigin = new THREE.Vector2(0, 0);
    this.cursorLocation = new THREE.Vector3(0, 0, 0);
    this.tapButton.addEventListener("click", (event) => {
      if (this.model.getAttribute("visible")) return;

      this.model.setAttribute("visible", true);
      this.doorLockHotspot.setAttribute("visible", true);
      this.model.setAttribute("position", this.el.object3D.position);
      this.doorLockHotspot.setAttribute("position", {
        x: this.el.object3D.position.x,
        y: 8,
        z: this.el.object3D.position.z,
      });
      this.modelObj.lookAt(this.camera.getAttribute("position"));
      this.modelObj.rotation.set(0, this.modelObj.rotation.y + Math.PI / 2, 0);

      // Disable tap place
      this.el.setAttribute("visible", false);
      this.tapButton.style.display = "none";
    });
  },
  tick() {
    // Raycast from camera to 'ground'
    this.raycaster.setFromCamera(this.rayOrigin, this.threeCamera);
    const intersects = this.raycaster.intersectObject(
      this.ground.object3D,
      true
    );
    if (intersects.length > 0) {
      const [intersect] = intersects;
      this.cursorLocation = intersect.point;
    }
    this.tapCursorIcon.position.y = 0.1;
    this.tapCursorIcon.position.lerp(this.cursorLocation, 0.4);
    this.tapCursorIcon.lookAt(this.camera.getAttribute("position"));
    this.tapCursorIcon.rotation.x = -Math.PI / 2;
  },
};
export { tapPlaceCursorComponent };
