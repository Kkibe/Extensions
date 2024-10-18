self.addEventListener("install",e=>{
    e.waitUntil(
        caches.open("static").then(cache=>{
            return caches.addAll(["./","./src/style.css","./todo.png"])
        })
    )
});

self.addEventListener("fetch",e=>{
    e.respondWith(
        caches.match(e.request).then(response=>{
            return response || fetch(e.request);
        })
    )
})

