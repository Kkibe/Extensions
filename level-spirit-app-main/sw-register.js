//SW registering
if (navigator.serviceWorker.controller) {
    console.log('Active service worker found, so no registering')
  } else {
  
  //Register the ServiceWorker
    navigator.serviceWorker.register('/sw-spiritlevel.js', {
      scope: '/'
    }).then(function(reg) {
      console.log('Service worker has been registered for scope:'+ reg.scope);
    });
  }
  
  