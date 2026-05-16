(function () {
  var navigated = false;
  var pollId = 0;
  var pendingTimer = 0;

  function queueNavigation() {
    if (navigated) {
      return;
    }
    navigated = true;
    window.sessionStorage.setItem("yanling-stage-entry", "home-stage-1");
    pendingTimer = window.setTimeout(function () {
      window.location.href = "./stage1.html";
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

    if (!/Stage 1/.test(enterText.textContent || "")) {
      return;
    }

    queueNavigation();
  }

  document.addEventListener("click", function (event) {
    if (navigated) {
      return;
    }
    var island = event.target && event.target.closest ? event.target.closest(".island-stage-0") : null;
    if (!island) {
      return;
    }
    if (island.classList.contains("focused")) {
      queueNavigation();
    }
  }, true);

  pollId = window.setInterval(tryBridge, 120);
  window.addEventListener("beforeunload", function () {
    window.clearInterval(pollId);
    window.clearTimeout(pendingTimer);
  });
})();
