function ajax(method: string, url: string, callback: (data: any) => void, err: (data: string) => void) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.setRequestHeader('Content-Type', 'application/json');
  req.onreadystatechange = () => req.readyState === 4 ? (req.status === 200 ? callback(JSON.parse(req.responseText)) : err(url + ': request failed')) : 0;
  req.send();
}

function anchors(): HTMLAnchorElement[] {
  return [...document.getElementsByTagName('a')as any];
}

function createPopup(data: any, x: number, y: number): HTMLElement {
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

function run() {
  console.error('sas2');

  let p: HTMLElement | undefined;

  anchors().forEach(a => {
    if (!/wikipedia.org\//.test(a.href)) return;

    (a.style as any)['text-decoration-style'] = 'dotted';
    a.style.textDecoration                    = 'underline';

    a.addEventListener('mouseenter', () => {

      if (p) {
        p.parentElement!.removeChild(p);
        p = undefined;
      }
      //  console.log(a.getBoundingClientRect(), window.getComputedStyle(a, null!).getPropertyValue('line-height'));
      const restApi = a.href.replace('/wiki/', '/api/rest_v1/page/summary/');
      ajax('GET', restApi, data => {
          p = createPopup(data, a.offsetLeft, a.offsetTop + 20); //fixme
          a.parentElement!.appendChild(p);
        }, e => console.error(e)
      );
    });

    a.addEventListener('mouseout', () => {
      if (p) {
        p.parentElement!.removeChild(p);
        p = undefined;
      }
    });

  });
}

run();