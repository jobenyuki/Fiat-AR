const toUrl = (urlOrId) => {
  const img = document.querySelector(urlOrId);
  return img ? img.src : urlOrId;
};

const rotateAboutPoint = (obj, point, axis, theta, pointIsWorld) => {
  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
};

const rotateGsapTo = ({
  duration = 3,
  xRad1 = 0,
  xRad2 = 0,
  yRad1 = 0,
  yRad2 = 0,
  zRad1 = 0,
  zRad2 = 0,
  object,
  pivot,
  axis,
  isWorld = false,
}) => {
  const radianRot = { x: xRad1, y: yRad1, z: zRad1 };
  let prevRot = { x: 0, y: 0, z: 0 };

  return gsap
    .to(radianRot, {
      duration,
      x: xRad2,
      y: yRad2,
      z: zRad2,
      ease: Power1.easeOut,
      onUpdate: () => {
        rotateAboutPoint(object, pivot, axis, -prevRot.y, isWorld);
        rotateAboutPoint(object, pivot, axis, radianRot.y, isWorld);
        prevRot = { ...radianRot };
      },
    })
    .pause();
};

export { toUrl, rotateAboutPoint, rotateGsapTo };
