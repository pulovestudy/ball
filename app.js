(function () {
      try {
        var app = document.getElementById("app");

        var stageData = [
          {
            id: 0,
            stage: "Stage 1",
            title: "\u6d6e\u6728\u4e4b\u68ee",
            desc: "\u9752\u7eff\u8272\u68ee\u6797\u5c9b\u6d6e\u5728\u591c\u7a7a\u4e4b\u4e0a\uff0c\u82d4\u85d3\u6811\u6839\u3001\u53d1\u5149\u690d\u7269\u4e0e\u67d4\u8f6f\u8349\u5730\u5728\u547c\u5438\u95f4\u7f13\u7f13\u95ea\u70c1\u3002",
            tags: ["Verdant Dream", "Healing Glow", "Living Forest"],
            features: ["\u82d4\u85d3\u6728\u5f84", "\u8349\u53f6\u6446\u52a8", "\u8367\u5149\u690d\u7269"],
            recommended: ["\u8f7b", "\u706b", "\u5206"],
            best: "01:42",
            wordsFound: "07 / 12",
            glow: "rgba(143, 228, 155, 0.46)",
            top1: "#5FBF77",
            top2: "#8ED081",
            x: 18,
            y: 16,
            w: 28,
            h: 26,
            z: 5,
            scale: 0.92,
            float: "8.4s",
            focusX: 14,
            focusY: 12,
            focusScale: 1.06
          },
          {
            id: 1,
            stage: "Stage 2",
            title: "\u5931\u91cd\u56de\u5eca",
            desc: "\u84dd\u7d2b\u8272\u5931\u91cd\u6d6e\u754c\uff0c\u661f\u5c18\u3001\u6c34\u6676\u4e0e\u53cd\u91cd\u529b\u77f3\u5757\u5728\u7a7a\u4e2d\u76f8\u4e92\u62c9\u626f\u3002",
            tags: ["Crystal Drift", "Blue Void", "Zero Gravity"],
            features: ["\u91cd\u529b\u53cd\u8f6c", "\u6f02\u6d6e\u673a\u5173", "\u661f\u5c18\u8f68\u9053"],
            recommended: ["\u8f7b", "\u4e0a", "\u5206"],
            best: "02:08",
            wordsFound: "05 / 11",
            glow: "rgba(128, 154, 255, 0.42)",
            top1: "#6eb7ff",
            top2: "#8b6be8",
            x: 63,
            y: 21,
            w: 24,
            h: 23,
            z: 4,
            scale: 0.86,
            float: "7.6s",
            focusX: -16,
            focusY: 10,
            focusScale: 1.08
          },
          {
            id: 2,
            stage: "Stage 3",
            title: "\u88c2\u9699\u4e4b\u5883",
            desc: "\u7ea2\u6a59\u8272\u626d\u66f2\u5c9b\u5c7f\uff0c\u788e\u88c2\u5e73\u53f0\u4e0e\u53d1\u5149\u88c2\u7f1d\u628a\u7a7a\u95f4\u62c9\u6210\u4e0d\u7a33\u5b9a\u7684\u8bd7\u53e5\u3002",
            tags: ["Ember Rift", "Broken Space", "Fire Script"],
            features: ["\u88c2\u9699\u8df3\u8f6c", "\u70ed\u6d6a\u6270\u52a8", "\u65ad\u5c42\u5e73\u53f0"],
            recommended: ["\u706b", "\u5206", "\u51b0"],
            best: "03:31",
            wordsFound: "09 / 15",
            glow: "rgba(255, 138, 98, 0.42)",
            top1: "#ff8f62",
            top2: "#ffcf70",
            x: 34,
            y: 56,
            w: 34,
            h: 28,
            z: 6,
            scale: 1,
            float: "9.2s",
            focusX: 4,
            focusY: -12,
            focusScale: 1.05
          }
        ];

        var runes = [
          { text: "\u706b", tone: "linear-gradient(135deg, #ff7d67, #ffb166)", glow: "rgba(255, 145, 93, 0.62)" },
          { text: "\u8f7b", tone: "linear-gradient(135deg, #59d9c2, #88f0d7)", glow: "rgba(89, 217, 194, 0.56)" },
          { text: "\u5206", tone: "linear-gradient(135deg, #8b6be8, #bf7bff)", glow: "rgba(165, 123, 255, 0.58)" },
          { text: "\u51b0", tone: "linear-gradient(135deg, #5da9e9, #8dd8ff)", glow: "rgba(125, 205, 255, 0.56)" }
        ];

        app.innerHTML = [
          '<main class="shell">',
          '  <header class="topbar">',
          '    <div class="title-panel">',
          '      <span class="eyebrow">Dream rules are written in words</span>',
          '      <h1>&#35328;&#28789;</h1>',
          '    </div>',
          '    <div class="runes" id="runeBar" aria-label="Rule runes"></div>',
          '  </header>',
          '  <section class="hero">',
          '    <div class="sky"></div>',
          '    <div class="clouds"></div>',
          '    <div class="mountains"></div>',
          '    <div class="glow-fog"></div>',
          '    <div class="particles" id="particles"></div>',
          '    <div class="fragments" id="fragments"></div>',
          '    <div class="energy-streams" id="energyStreams"></div>',
          '    <aside class="story-copy" aria-label="World introduction">',
          '      <p class="story-lead">在漂浮于梦境之上的规则世界里，文字不再只是语言，而是能够改写现实的力量。轻触「<span class="story-rune fire">火</span>」，沉寂的平台将被点燃；唤醒「<span class="story-rune light">轻</span>」，世界的重量会悄然褪去；释放「<span class="story-rune split">分</span>」，眼前的空间也将随之断裂重组。</p>',
          '      <p class="story-body">你将操控一颗蕴藏未知能量的小球，穿越风格迥异的漂浮岛屿，在跳跃、坠落与失衡之间摸索前路。组合文字，改写规则，找到通往终点的唯一轨迹。</p>',
          '    </aside>',
          '    <div class="world-window">',
          '      <div class="world-map" id="worldMap">',
          '        <div class="path-highlight" id="pathHighlight"></div>',
          '      </div>',
          '    </div>',
          '    <aside class="focus-annotations" id="focusAnnotations">',
          '      <div class="annotation-title">',
          '        <small id="focusStageLabel">Focused Realm</small>',
          '        <h2 id="focusTitle"></h2>',
          '        <p id="focusDesc"></p>',
          '        <div class="word-cloud" id="focusWords"></div>',
          '      </div>',
          '      <div class="annotation-note">',
          '        <strong>Realm Notes</strong>',
          '        <p id="focusNotes"></p>',
          '      </div>',
          '      <div class="annotation-stats">',
          '        <div class="stat-pill"><small>Best Record</small><strong id="focusBest">--:--</strong></div>',
          '        <div class="word-pill"><small>Words Found</small><strong id="focusFound">00 / 00</strong></div>',
          '      </div>',
          '    </aside>',
          '    <div class="enter-overlay"><div class="enter-text" id="enterText">Entering realm</div></div>',
          '    <div class="dropline" id="dropline"></div>',
          '  </section>',
          '</main>'
        ].join("");

        var root = document.documentElement;
        var runeBar = document.getElementById("runeBar");
        var worldMap = document.getElementById("worldMap");
        var focusAnnotations = document.getElementById("focusAnnotations");
        var focusStageLabel = document.getElementById("focusStageLabel");
        var focusTitle = document.getElementById("focusTitle");
        var focusDesc = document.getElementById("focusDesc");
        var focusWords = document.getElementById("focusWords");
        var focusNotes = document.getElementById("focusNotes");
        var focusBest = document.getElementById("focusBest");
        var focusFound = document.getElementById("focusFound");
        var pathHighlight = document.getElementById("pathHighlight");
        var dropline = document.getElementById("dropline");
        var hero = document.querySelector(".hero");
        var enterText = document.getElementById("enterText");
        var currentStage = 0;
        var interactionState = "overview";
        var islands = [];

        buildRunes();
        buildAmbient();
        buildWorld();
        setOverview();

        function buildRunes() {
          runes.forEach(function (rune, index) {
            var button = document.createElement("button");
            button.className = "rune";
            button.type = "button";
            button.textContent = rune.text;
            button.style.setProperty("--tone", rune.tone);
            button.style.setProperty("--glow", rune.glow);
            button.setAttribute("aria-label", "Rune " + rune.text);
            button.addEventListener("click", function () {
              button.classList.remove("active");
              void button.offsetWidth;
              button.classList.add("active");
              spawnRune(rune, 24 + index * 16 + Math.random() * 8);
            });
            runeBar.appendChild(button);
          });
        }

        function buildAmbient() {
          fillParticles(document.getElementById("particles"));
          fillFragments(document.getElementById("fragments"));
          drawPaths();
        }

        function buildWorld() {
          stageData.forEach(function (stage) {
            var button = document.createElement("button");
            button.className = "island island-stage-" + String(stage.id);
            button.type = "button";
            button.dataset.stage = String(stage.id);
            button.style.left = stage.x + "%";
            button.style.top = stage.y + "%";
            button.style.width = stage.w + "%";
            button.style.height = stage.h + "%";
            button.style.setProperty("--z", String(stage.z));
            button.style.setProperty("--float", stage.float);
            button.style.setProperty("--glow", stage.glow);
            button.style.setProperty("--top1", stage.top1);
            button.style.setProperty("--top2", stage.top2);
            button.dataset.baseX = String(stage.x);
            button.dataset.baseY = String(stage.y);
            button.dataset.baseW = String(stage.w);
            button.dataset.baseH = String(stage.h);
            button.dataset.baseScale = String(stage.scale);
            button.style.setProperty("--island-scale", String(stage.scale));
            button.innerHTML = islandMarkup(stage);
            button.addEventListener("click", function () {
              handleIslandClick(stage.id);
            });
            worldMap.appendChild(button);
            islands.push(button);
          });
        }

        function islandMarkup(stage) {
          var detail = '';
          if (stage.id === 0) {
            detail = [
              '<span class="forest-canopy forest-canopy-a"></span>',
              '<span class="forest-canopy forest-canopy-b"></span>',
              '<span class="forest-glow forest-glow-a"></span>',
              '<span class="forest-glow forest-glow-b"></span>',
              '<span class="forest-root forest-root-a"></span>',
              '<span class="forest-root forest-root-b"></span>',
              '<span class="forest-vine forest-vine-a"></span>',
              '<span class="forest-vine forest-vine-b"></span>',
              '<span class="forest-mushroom forest-mushroom-a"></span>',
              '<span class="forest-mushroom forest-mushroom-b"></span>',
              '<span class="forest-leaf forest-leaf-a"></span>',
              '<span class="forest-leaf forest-leaf-b"></span>',
              '<span class="forest-firefly forest-firefly-a"></span>',
              '<span class="forest-firefly forest-firefly-b"></span>',
              '<span class="forest-firefly forest-firefly-c"></span>'
            ].join("");
          } else if (stage.id === 1) {
            detail = [
              '<span style="left:18%; top:28%; width:10%; height:18%; background:linear-gradient(180deg, #a1d5ff, #6fa7ff); clip-path:polygon(50% 0%, 100% 32%, 72% 100%, 18% 90%, 0% 38%); transform:rotate(-10deg);"></span>',
              '<span style="left:64%; top:24%; width:12%; height:24%; background:linear-gradient(180deg, #c19cff, #7b79ff); clip-path:polygon(50% 0%, 100% 32%, 72% 100%, 18% 90%, 0% 38%); transform:rotate(10deg);"></span>',
              '<span style="left:26%; top:58%; width:18%; height:8%; border-radius:18px; background:linear-gradient(135deg, #5da9e9, #8b6be8); transform:rotate(12deg);"></span>',
              '<span style="left:54%; top:54%; width:20%; height:8%; border-radius:18px; background:linear-gradient(135deg, #8b6be8, #5da9e9); transform:rotate(-8deg);"></span>',
              '<span style="left:42%; top:32%; width:16%; height:16%; border-radius:50%; border:1px solid rgba(255,255,255,0.28); box-shadow:0 0 16px rgba(125,205,255,0.24);"></span>'
            ].join("");
          } else {
            detail = [
              '<span style="left:16%; top:52%; width:22%; height:8%; border-radius:18px; background:linear-gradient(135deg, #ff8f62, #ffcf70); transform:rotate(-12deg);"></span>',
              '<span style="left:52%; top:44%; width:22%; height:8%; border-radius:18px; background:linear-gradient(135deg, #ffb06f, #ff7f67); transform:rotate(10deg);"></span>',
              '<span style="left:38%; top:20%; width:24%; height:36%; background:linear-gradient(180deg, rgba(255,208,133,0.76), rgba(255,127,103,0.28)); clip-path:polygon(48% 0%, 56% 0%, 62% 100%, 40% 100%); filter:blur(2px);"></span>',
              '<span style="left:24%; top:26%; width:10%; height:10%; border-radius:50%; background:radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,159,98,0.22) 68%, transparent 72%); box-shadow:0 0 16px rgba(255,159,98,0.48);"></span>',
              '<span style="left:68%; top:24%; width:10%; height:10%; border-radius:50%; background:radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,208,112,0.22) 68%, transparent 72%); box-shadow:0 0 16px rgba(255,208,112,0.48);"></span>'
            ].join("");
          }

          return [
            '<div class="island-visual">',
            '  <div class="ambient-ring"></div>',
            '  <div class="halo"></div>',
            '  <div class="land"></div>',
            '  <div class="underside"></div>',
            '  <div class="detail">' + detail + '</div>',
            '  <div class="focus-particles">' +
                 '<span style="left:24%; top:30%; --sx:-16px; --sy:-30px;"></span>' +
                 '<span style="left:68%; top:22%; --sx:22px; --sy:-28px; animation-delay:.6s;"></span>' +
                 '<span style="left:58%; top:68%; --sx:18px; --sy:18px; animation-delay:1.2s;"></span>' +
                 '<span style="left:18%; top:58%; --sx:-18px; --sy:20px; animation-delay:.9s;"></span>' +
            '  </div>',
            '  <div class="island-label"><small>' + stage.stage + '</small><strong>' + stage.title + '</strong></div>',
            '</div>'
          ].join("");
        }

        function handleIslandClick(index) {
          if (interactionState === "entering") {
            return;
          }

          if (interactionState === "overview") {
            focusIsland(index);
            return;
          }

          if (interactionState === "focused" && currentStage === index) {
            enterStage(index);
            return;
          }

          focusIsland(index);
        }

        function setOverview() {
          interactionState = "overview";
          hero.classList.remove("focus-mode", "entering");
          focusAnnotations.classList.remove("visible");
          root.style.setProperty("--focus-x", "0px");
          root.style.setProperty("--focus-y", "0px");
          root.style.setProperty("--focus-scale", "1");
          root.style.setProperty("--map-rotate", "0deg");
          root.style.setProperty("--map-blur", "0px");
          root.style.setProperty("--enter-glow", "0");
          currentStage = currentStage % stageData.length;
          islands.forEach(function (island, i) {
            var stage = stageData[i];
            island.classList.remove("active", "focused", "far", "entering");
            island.style.opacity = "1";
            island.style.left = stage.x + "%";
            island.style.top = stage.y + "%";
            island.style.width = stage.w + "%";
            island.style.height = stage.h + "%";
            island.style.setProperty("--island-scale", String(stage.scale));
          });
          placeOrb(null);
          enterText.textContent = "Entering realm";
        }

        function focusIsland(index) {
          interactionState = "focused";
          currentStage = index;
          var stage = stageData[index];
          root.style.setProperty("--focus-x", stage.focusX + "px");
          root.style.setProperty("--focus-y", stage.focusY + "px");
          root.style.setProperty("--focus-scale", String(stage.focusScale));
          root.style.setProperty("--map-rotate", [ "-7deg", "8deg", "3deg" ][index]);
          root.style.setProperty("--map-blur", "0px");
          root.style.setProperty("--enter-glow", "0");
          hero.classList.add("focus-mode");
          hero.classList.remove("entering");
          focusAnnotations.classList.add("visible");
          focusStageLabel.textContent = stage.stage;
          focusTitle.textContent = stage.title;
          focusDesc.textContent = stage.desc;
          focusWords.innerHTML = "";
          stage.recommended.forEach(function (tag) {
            var chip = document.createElement("span");
            chip.textContent = tag;
            focusWords.appendChild(chip);
          });
          focusNotes.textContent = stage.features.join(" / ");
          focusBest.textContent = stage.best;
          focusFound.textContent = stage.wordsFound;
          islands.forEach(function (island, i) {
            var pos = getFocusLayout(index, i);
            island.classList.toggle("active", i === index);
            island.classList.toggle("focused", i === index);
            island.classList.toggle("far", i !== index);
            island.classList.remove("entering");
            island.style.opacity = "1";
            island.style.left = pos.x + "%";
            island.style.top = pos.y + "%";
            island.style.width = pos.w + "%";
            island.style.height = pos.h + "%";
            island.style.setProperty("--island-scale", String(pos.scale));
          });
          placeOrb(stage);
        }

        function enterStage(index) {
          interactionState = "entering";
          var stage = stageData[index];
          hero.classList.add("entering");
          root.style.setProperty("--focus-scale", String(stage.focusScale + 0.55));
          root.style.setProperty("--map-rotate", "0deg");
          root.style.setProperty("--map-blur", "0.4px");
          root.style.setProperty("--enter-glow", "1");
          enterText.textContent = "Entering " + stage.stage;
          islands.forEach(function (island, i) {
            island.classList.toggle("entering", i === index);
            if (i === index) {
              island.style.left = "34%";
              island.style.top = "18%";
              island.style.width = "38%";
              island.style.height = "34%";
              island.style.setProperty("--island-scale", "1.24");
              island.style.opacity = "1";
            } else {
              island.style.opacity = "0.18";
            }
          });
          window.setTimeout(function () {
            if (interactionState === "entering") {
              focusNotes.textContent = "\u955c\u5934\u6b63\u5728\u63a8\u8fdb\u8fdb\u5165\u8fd9\u4e2a\u89c4\u5219\u4e16\u754c...";
            }
          }, 700);
        }

        function placeOrb(stage) {
          var old = document.querySelector(".orb-avatar");
          if (old && old.parentNode) {
            old.parentNode.removeChild(old);
          }

          if (!stage) {
            return;
          }

          var orb = document.createElement("div");
          orb.className = "orb-avatar";
          orb.style.left = stage.id === 0 ? "56%" : (stage.id === 1 ? "28%" : "66%");
          orb.style.top = stage.id === 0 ? "28%" : (stage.id === 1 ? "56%" : "30%");
          islands[stage.id].appendChild(orb);
        }

        function getFocusLayout(focusIndex, islandIndex) {
          var layouts = {
            0: [
              { x: 37, y: 22, w: 28, h: 25, scale: 0.98 },
              { x: 72, y: 22, w: 19, h: 17, scale: 0.8 },
              { x: 12, y: 60, w: 22, h: 19, scale: 0.82 }
            ],
            1: [
              { x: 10, y: 24, w: 20, h: 17, scale: 0.8 },
              { x: 37, y: 22, w: 28, h: 25, scale: 0.98 },
              { x: 70, y: 60, w: 20, h: 17, scale: 0.8 }
            ],
            2: [
              { x: 12, y: 20, w: 20, h: 17, scale: 0.8 },
              { x: 70, y: 24, w: 18, h: 16, scale: 0.78 },
              { x: 36, y: 24, w: 30, h: 27, scale: 1 }
            ]
          };
          return layouts[focusIndex][islandIndex];
        }

        function drawPaths() {
          pathHighlight.innerHTML = [
            '<svg viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">',
            '  <defs>',
            '    <linearGradient id="pathA" x1="0%" y1="0%" x2="100%" y2="100%">',
            '      <stop offset="0%" stop-color="rgba(255,209,102,0.0)"></stop>',
            '      <stop offset="38%" stop-color="rgba(255,209,102,0.75)"></stop>',
            '      <stop offset="68%" stop-color="rgba(125,205,255,0.56)"></stop>',
            '      <stop offset="100%" stop-color="rgba(139,107,232,0.0)"></stop>',
            '    </linearGradient>',
            '    <linearGradient id="pathB" x1="0%" y1="0%" x2="100%" y2="100%">',
            '      <stop offset="0%" stop-color="rgba(255,158,109,0.0)"></stop>',
            '      <stop offset="46%" stop-color="rgba(255,158,109,0.68)"></stop>',
            '      <stop offset="74%" stop-color="rgba(139,107,232,0.46)"></stop>',
            '      <stop offset="100%" stop-color="rgba(139,107,232,0.0)"></stop>',
            '    </linearGradient>',
            '  </defs>',
            '  <path d="M220 180 C340 230, 390 310, 520 286 S710 208, 760 220" fill="none" stroke="url(#pathA)" stroke-width="4" stroke-linecap="round" opacity="0.72"></path>',
            '  <path d="M300 430 C410 390, 500 348, 610 308 S760 266, 790 240" fill="none" stroke="url(#pathB)" stroke-width="4" stroke-linecap="round" opacity="0.58"></path>',
            '  <path d="M252 214 C392 256, 464 326, 610 324" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="2 12" opacity="0.42"></path>',
            '</svg>'
          ].join("");
        }

        function spawnRune(rune, percentX) {
          var glyph = document.createElement("div");
          glyph.className = "falling-rune";
          glyph.textContent = rune.text;
          glyph.style.setProperty("--x", percentX + "%");
          glyph.style.setProperty("--tone", rune.tone);
          glyph.style.setProperty("--glow", rune.glow);
          dropline.appendChild(glyph);
          window.setTimeout(function () {
            if (glyph.parentNode) {
              glyph.parentNode.removeChild(glyph);
            }
          }, 3800);
        }

        function fillParticles(container) {
          for (var i = 0; i < 30; i += 1) {
            var p = document.createElement("span");
            p.style.left = Math.random() * 100 + "%";
            p.style.top = 16 + Math.random() * 64 + "%";
            p.style.setProperty("--size", 3 + Math.random() * 5 + "px");
            p.style.setProperty("--dur", 4 + Math.random() * 7 + "s");
            p.style.setProperty("--dx", (-20 + Math.random() * 40) + "px");
            p.style.setProperty("--dy", (-80 - Math.random() * 70) + "px");
            p.style.setProperty("--glow", ["rgba(255,209,102,0.38)", "rgba(125,205,255,0.34)", "rgba(163,123,255,0.34)"][i % 3]);
            container.appendChild(p);
          }
        }

        function fillFragments(container) {
          var chars = ["\u706b", "\u8f7b", "\u5206", "\u51b0", "\u68a6", "\u5149", "\u5f71", "\u98ce"];
          for (var i = 0; i < chars.length; i += 1) {
            var g = document.createElement("span");
            g.textContent = chars[i];
            g.style.left = 10 + i * 10 + "%";
            g.style.top = 12 + (i % 4) * 16 + "%";
            g.style.setProperty("--size", 18 + (i % 3) * 10 + "px");
            g.style.setProperty("--dur", 6 + i * 0.7 + "s");
            g.style.setProperty("--glow", ["rgba(255,158,109,0.2)", "rgba(93,169,233,0.2)", "rgba(139,107,232,0.22)"][i % 3]);
            container.appendChild(g);
          }
        }

        window.setInterval(function () {
          var rune = runes[Math.floor(Math.random() * runes.length)];
          spawnRune(rune, 20 + Math.random() * 60);
        }, 3200);
      } catch (error) {
        document.body.innerHTML = '<div class="error-state"><p>&#21734;&#21680;&#65292;&#20986;&#38169;&#20102;&#65292;&#35831;&#37325;&#21551;&#35797;&#35797;&#21543;~</p></div>';
        console.error(error);
      }
    })();
