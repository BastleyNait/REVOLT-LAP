/**
 * Nivel de efectos del sitio: "rich" (vidrio con desenfoque, rayo WebGL del logo,
 * destellos en las tarjetas) o "lite" (transparencias simples, logo estático).
 *
 * Se decide en dos pasos:
 *  1. Antes del primer pintado, un script mínimo en <head> (FX_SCRIPT) lee las
 *     señales baratas del equipo y pone `data-fx` en <html>. Así el CSS ya sale
 *     bien y no hay parpadeo. Sin pistas claras, el valor es "lite".
 *  2. Ya cargada la página, <FxMonitor> comprueba la tarjeta gráfica y mide los
 *     FPS reales con los efectos en marcha. Si el equipo no da, baja a "lite"
 *     al instante y lo recuerda 7 días.
 *
 * Para probar a mano: `?fx=rich`, `?fx=lite`, y `?fx=auto` para volver al modo
 * automático. Lo manual se guarda en este navegador.
 */

export type FxTier = "rich" | "lite";

export const FX_EVENT = "revolt:fx";
export const MANUAL_KEY = "revolt-fx";
export const AUTO_KEY = "revolt-fx-auto";
const AUTO_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Script que corre en <head> antes de pintar. ES5, sin dependencias. */
export const FX_SCRIPT = `(function(){var d=document.documentElement,t="lite";try{
var n=navigator,m=window.matchMedia.bind(window);
function g(k){try{return localStorage.getItem(k)}catch(e){return null}}
function s(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function r(k){try{localStorage.removeItem(k)}catch(e){}}
var q=/[?&]fx=(rich|lite|auto)\\b/.exec(location.search);
if(q){if(q[1]==="auto"){r("${MANUAL_KEY}");r("${AUTO_KEY}")}else{s("${MANUAL_KEY}",q[1])}}
var f=g("${MANUAL_KEY}");
if(f==="rich"||f==="lite"){t=f}else{
var a=parseInt(g("${AUTO_KEY}")||"0",10);
var recentlyLite=a>0&&Date.now()-a<${AUTO_TTL_MS};
var cores=n.hardwareConcurrency||0,mem=n.deviceMemory;
var ok=!recentlyLite&&!m("(prefers-reduced-motion: reduce)").matches&&!(n.connection&&n.connection.saveData)&&m("(hover: hover) and (pointer: fine)").matches&&cores>=8&&(mem===undefined||mem>=8);
t=ok?"rich":"lite"}
}catch(e){}
d.setAttribute("data-fx",t)})();`;
