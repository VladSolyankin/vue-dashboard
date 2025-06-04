import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import router from "./router";
import "virtual:uno.css";

gsap.registerPlugin(Draggable, Flip, ScrollTrigger);
const app = createApp(App);
app.use(router);
app.mount("#app");
