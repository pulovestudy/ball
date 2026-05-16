(function () {
  var navigated = false;
  var pollId = 0;
  var pendingTimer = 0;
  var STAGE_ROUTES = {
    0: { entry: "home-stage-1", file: "./stage1.html", label: "Stage 1" },
    1: { entry: "home-stage-2", file: "./stage2.html", label: "Stage 2" }
  };

  function getRouteByIndex(index) {
    return STAGE_ROUTES[index] || null;
  }

  function getRouteByEnterText(text) {
    var match = /Stage\s+(\d+)/i.exec(text || "");
    if (!match) {
      return null;
    }
    return getRouteByIndex(Number(match[1]) - 1);
  }

  function queueNavigation(route) {
    if (navigated) {
      return;
    }
    if (!route) {
      return;
    }
    navigated = true;
    window.sessionStorage.setItem("yanling-stage-entry", route.entry);
    pendingTimer = window.setTimeout(function () {
      window.location.href = route.file;
    }, 1180);
  }

  function tryBridge() {
    if (navigated) {
      return;
    }

    var hero = document.querySelector(".hero");
    var enterText = document.getElementById("enterText");

    if (!hero || !enterText) {
      return;
    }

    if (!hero.classList.contains("entering")) {
      return;
    }

    var route = getRouteByEnterText(enterText.textContent || "");
    if (!route) {
      return;
    }

    queueNavigation(route);
  }

  document.addEventListener("click", function (event) {
    if (navigated) {
      return;
    }
    var island = event.target && event.target.closest ? event.target.closest(".island") : null;
    if (!island) {
      return;
    }
    var match = /island-stage-(\d+)/.exec(island.className || "");
    var route = match ? getRouteByIndex(Number(match[1])) : null;
    if (!route) {
      return;
    }
    if (island.classList.contains("focused")) {
      queueNavigation(route);
    }
  }, true);

  pollId = window.setInterval(tryBridge, 120);
  window.addEventListener("beforeunload", function () {
    window.clearInterval(pollId);
    window.clearTimeout(pendingTimer);
  });
})();
