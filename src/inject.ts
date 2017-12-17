import { WikiData } from "./WikiData";
import { request } from './data';

let currentAnchor: HTMLAnchorElement | undefined;
let currentPopup: HTMLElement | undefined;
const currentUrl = window.location.href.split('#')[0];

function anchors(): HTMLAnchorElement[] {
  return [...document.getElementsByTagName('a')as any];
}

function wikiAnchors(): HTMLAnchorElement[] {
  return anchors().filter(a => {
    return /wikipedia.org\//.test(a.href) && currentUrl !== a.href.split('#')[0];
  })
}

function createPopup(data: WikiData, x: number, y: number): HTMLElement {
  const container = document.createElement('div');
  const popup     = document.createElement('ipopup');

  if (data.thumbnail) {
    const tmb = document.createElement('img');
    tmb.src   = data.thumbnail.source;
    popup.appendChild(tmb);
  }
  const txt            = document.createElement('r_text');
  txt.innerHTML        = data.extract_html.split('\n')[0];
  popup.style.zIndex   = '' + Number.MAX_SAFE_INTEGER;
  popup.style.top      = y + 'px';
  popup.style.left     = x + 'px';
  popup.style.position = 'absolute';
  popup.appendChild(txt);

  document.body.appendChild(popup);
  container.appendChild(popup);
  return container;
}

function load(a: HTMLAnchorElement): Promise<WikiData> {
  const url = a.href.replace('/wiki/', '/api/rest_v1/page/summary/');
  return request(url);
}

function deletePopup() {
  if (currentPopup) {
    currentPopup.parentElement!.removeChild(currentPopup);
    currentPopup = undefined;
  }
}

function run() {

  wikiAnchors().forEach(a => {
    (a.style as any)['text-decoration-style'] = 'dotted';
    a.style.textDecoration                    = 'underline';

    a.addEventListener('mouseenter', () => {
      currentAnchor = a;
      deletePopup();
      load(a).then(data => {
        if (a !== currentAnchor) return;
        currentPopup = createPopup(data, a.offsetLeft, a.offsetTop + 20); //fixme
        a.parentElement!.appendChild(currentPopup);
      });
    });

    a.addEventListener('mouseout', () => {
      deletePopup();
      currentAnchor = undefined;
    });

  });
}

run();