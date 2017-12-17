const CACHE = new Map<string, any>();

function ajax(method: string, url: string, callback: (data: any) => void, err: (data: string) => void) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.setRequestHeader('Content-Type', 'application/json');
  req.onreadystatechange = () => req.readyState === 4 ? (req.status === 200 ? callback(JSON.parse(req.responseText)) : err(url + ': request failed')) : 0;
  req.send();
}

export function request<T>(url: string): Promise<T> {
  return new Promise<T>(((resolve, reject) => {

    const cachedData = CACHE.get(url);
    if (cachedData !== undefined) resolve(cachedData);

    ajax('GET', url, data => {
      CACHE.set(url, data);
      resolve(data);
    }, reject)
  }));
}