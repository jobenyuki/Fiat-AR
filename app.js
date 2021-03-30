import "./app.css";
import { cubeEnvMapComponent } from "./cubemap-static";
import { cubeMapRealtimeComponent } from "./cubemap-realtime";
import { xrLightComponent, xrLightSystem } from "./xrlight";
import { tapPlaceCursorComponent } from "./tap-place-cursor";
import { adjustCar } from "./adjust-car";

AFRAME.registerComponent("cubemap-static", cubeEnvMapComponent);
AFRAME.registerComponent("cubemap-realtime", cubeMapRealtimeComponent);
AFRAME.registerComponent("xr-light", xrLightComponent);
AFRAME.registerSystem("xr-light", xrLightSystem);
AFRAME.registerComponent("tap-place-cursor", tapPlaceCursorComponent);
AFRAME.registerComponent("adjust-car", adjustCar);
