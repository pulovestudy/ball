(function () {
      try {
        var app = document.getElementById("app");

        var STAGE1_LEADERBOARD_KEY = "yanling-stage1-honor-board";
        var HOME_FOCUS_STAGE_KEY = "yanling-home-focus-stage";

        var stageData = [
          {
            id: 0,
            stage: "Stage 1",
            title: "\u6797\u95f4",
            desc: "\u7eff\u5149\u68ee\u6797\u6f02\u6d6e\u5728\u591c\u8272\u6570\u636e\u6d77\u4e4b\u4e0a\uff0c\u6811\u6839\u50cf\u7f16\u8bd1\u4e2d\u7684\u7ebf\u7a0b\u5782\u5411\u865a\u7a7a\uff0c\u82d4\u85d3\u3001\u8349\u53f6\u4e0e\u8367\u5149\u690d\u7269\u5728\u547c\u5438\u95f4\u70b9\u4eae\u6574\u5ea7\u68a6\u5883\u68ee\u57df\u3002",
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
            desc: "\u84dd\u7d2b\u8272\u5931\u91cd\u7a7a\u57df\u50cf\u4e00\u6761\u88ab\u6682\u505c\u7684\u8f68\u9053\u56de\u5eca\uff0c\u6676\u4f53\u3001\u6f02\u6d6e\u677f\u5757\u4e0e\u53cd\u91cd\u529b\u6b8b\u7247\u5728\u9759\u9ed8\u4e2d\u7f13\u7f13\u65cb\u8f6c\uff0c\u4eff\u4f5b\u6574\u4e2a\u4e16\u754c\u90fd\u88ab\u201c\u8f7b\u201d\u8fd9\u6761\u89c4\u5219\u91cd\u5199\u3002",
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
            desc: "\u7ea2\u6a59\u8272\u88c2\u5883\u50cf\u4e00\u6bb5\u6b63\u5728\u8fc7\u70ed\u5d29\u89e3\u7684\u89c4\u5219\u4ee3\u7801\uff0c\u65ad\u5c42\u5e73\u53f0\u3001\u71d5\u5149\u88c2\u7f1d\u4e0e\u7834\u788e\u6b8b\u7247\u628a\u7a7a\u95f4\u6495\u6210\u95ea\u70c1\u7684\u65ad\u53e5\uff0c\u6bcf\u4e00\u6b65\u90fd\u50cf\u8e29\u5728\u5d29\u575f\u7684\u8bed\u8a00\u8fb9\u7f18\u3002",
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
          { text: "\u51b0", tone: "linear-gradient(135deg, #5da9e9, #8dd8ff)", glow: "rgba(125, 205, 255, 0.56)" },
          { text: "\u6c34", tone: "linear-gradient(135deg, #4f9dff, #86d6ff)", glow: "rgba(115, 194, 255, 0.58)" },
          { text: "\u96f7", tone: "linear-gradient(135deg, #8068ff, #b696ff)", glow: "rgba(150, 125, 255, 0.62)" },
          { text: "\u75be", tone: "linear-gradient(135deg, #38d3a5, #88ffd7)", glow: "rgba(90, 236, 188, 0.58)" },
          { text: "\u788e", tone: "linear-gradient(135deg, #ff9a6e, #ffd08e)", glow: "rgba(255, 176, 108, 0.58)" },
          { text: "\u5f71", tone: "linear-gradient(135deg, #5f6a86, #9ea8c4)", glow: "rgba(176, 186, 226, 0.46)" },
          { text: "\u5012", tone: "linear-gradient(135deg, #ff6f8f, #ffb5c0)", glow: "rgba(255, 145, 176, 0.54)" }
        ];

        app.innerHTML = [
          '<main class="shell">',
          '  <header class="topbar">',
          '    <div class="title-panel">',
          '      <span class="eyebrow">Dream rules are written in words</span>',
          '      <h1>&#35328;&#20986;&#27861;&#38543;</h1>',
          '    </div>',
          '    <div class="runes" id="runeBar" aria-label="Rule runes"></div>',
          '  </header>',
          '  <section class="hero">',
          '    <div class="deep-space"></div>',
          '    <div class="nebula-bands"></div>',
          '    <div class="rule-field rule-field-back" id="ruleFieldBack"></div>',
          '    <div class="sky"></div>',
          '    <div class="clouds"></div>',
          '    <div class="mountains"></div>',
          '    <div class="glow-fog"></div>',
          '    <div class="midspace-layer" id="midspaceLayer"></div>',
          '    <div class="particles" id="particles"></div>',
          '    <div class="fragments" id="fragments"></div>',
          '    <div class="energy-streams" id="energyStreams"></div>',
          '    <div class="rule-field rule-field-mid" id="ruleFieldMid"></div>',
          '    <div class="giant-glyphs" id="giantGlyphs"></div>',
          '    <div class="quiet-core"></div>',
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
          '    <div class="foreground-drift" id="foregroundDrift"></div>',
          '    <div class="dropline" id="dropline"></div>',
          '  </section>',
          '</main>'
        ].join("");

        var root = document.documentElement;
        var runeBar = document.getElementById("runeBar");
        var worldMap = document.getElementById("worldMap");
        var ruleFieldBack = document.getElementById("ruleFieldBack");
        var ruleFieldMid = document.getElementById("ruleFieldMid");
        var giantGlyphs = document.getElementById("giantGlyphs");
        var midspaceLayer = document.getElementById("midspaceLayer");
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
        var energyStreams = document.getElementById("energyStreams");
        var foregroundDrift = document.getElementById("foregroundDrift");
        var hero = document.querySelector(".hero");
        var enterText = document.getElementById("enterText");
        var currentStage = 0;
        var interactionState = "overview";
        var islands = [];

        stageData[0].best = getStage1BestRecord();

        buildRunes();
        buildAmbient();
        buildWorld();
        setOverview();
        applyQueuedStageFocus();

        function getStage1BestRecord() {
          try {
            var raw = window.localStorage.getItem(STAGE1_LEADERBOARD_KEY);
            var parsed = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(parsed) || !parsed.length) {
              return "--:--";
            }
            parsed.sort(function (a, b) {
              if (a.time !== b.time) {
                return a.time - b.time;
              }
              return (a.createdAt || 0) - (b.createdAt || 0);
            });
            return formatBestTime(parsed[0].time);
          } catch (error) {
            return "--:--";
          }
        }

        function formatBestTime(seconds) {
          var safe = Math.max(0, Number(seconds) || 0);
          var minutes = Math.floor(safe / 60);
          var remain = safe - minutes * 60;
          var secs = Math.floor(remain);
          var centis = Math.floor((remain - secs) * 100);
          return String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0") + "." + String(centis).padStart(2, "0");
        }

        function applyQueuedStageFocus() {
          var raw = window.sessionStorage.getItem(HOME_FOCUS_STAGE_KEY);
          if (raw === null) {
            return;
          }
          window.sessionStorage.removeItem(HOME_FOCUS_STAGE_KEY);
          var index = Number(raw);
          if (!Number.isFinite(index) || index < 0 || index >= stageData.length) {
            return;
          }
          focusIsland(index);
        }

        function buildRunes() {
          var poses = [
            { x: "-4px", y: "1px", r: "-6deg", dur: "6.4s" },
            { x: "2px", y: "-4px", r: "4deg", dur: "5.8s" },
            { x: "-1px", y: "3px", r: "-2deg", dur: "6.8s" },
            { x: "5px", y: "-1px", r: "7deg", dur: "5.5s" }
          ];
          runes.forEach(function (rune, index) {
            var button = document.createElement("button");
            var pose = poses[index % poses.length];
            button.className = "rune";
            button.type = "button";
            button.textContent = rune.text;
            button.style.setProperty("--tone", rune.tone);
            button.style.setProperty("--glow", rune.glow);
            button.style.setProperty("--jitter-x", pose.x);
            button.style.setProperty("--jitter-y", pose.y);
            button.style.setProperty("--rune-rot", pose.r);
            button.style.setProperty("--bob-dur", pose.dur);
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
          fillRuleField(ruleFieldBack, "back");
          fillRuleConstellations(ruleFieldMid);
          fillGiantGlyphs(giantGlyphs);
          fillMidspace(midspaceLayer);
          fillParticles(document.getElementById("particles"));
          fillFragments(document.getElementById("fragments"));
          fillForegroundDrift(foregroundDrift);
          drawEnergyStreams(energyStreams);
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
              '<span class="gravity-crystal gravity-crystal-a"></span>',
              '<span class="gravity-crystal gravity-crystal-b"></span>',
              '<span class="gravity-crystal gravity-crystal-c"></span>',
              '<span class="gravity-slab gravity-slab-a"></span>',
              '<span class="gravity-slab gravity-slab-b"></span>',
              '<span class="gravity-slab gravity-slab-c"></span>',
              '<span class="gravity-ring-core"></span>',
              '<span class="gravity-orbit gravity-orbit-a"></span>',
              '<span class="gravity-orbit gravity-orbit-b"></span>',
              '<span class="gravity-shard gravity-shard-a"></span>',
              '<span class="gravity-shard gravity-shard-b"></span>'
            ].join("");
          } else {
            detail = [
              '<span class="rift-plate rift-plate-a"></span>',
              '<span class="rift-plate rift-plate-b"></span>',
              '<span class="rift-plate rift-plate-c"></span>',
              '<span class="rift-crack rift-crack-main"></span>',
              '<span class="rift-crack rift-crack-side"></span>',
              '<span class="rift-lava rift-lava-a"></span>',
              '<span class="rift-lava rift-lava-b"></span>',
              '<span class="rift-shard rift-shard-a"></span>',
              '<span class="rift-shard rift-shard-b"></span>',
              '<span class="rift-spark rift-spark-a"></span>',
              '<span class="rift-spark rift-spark-b"></span>'
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
          orb.className = "orb-avatar orb-stage-" + String(stage.id);
          orb.innerHTML = '<span class="orb-trail"></span><span class="orb-shell"><span class="orb-core"></span><span class="orb-ripple"></span></span>';
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

        function drawEnergyStreams(container) {
          container.innerHTML = [
            '<svg viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">',
            '  <defs>',
            '    <linearGradient id="streamA" x1="0%" y1="0%" x2="100%" y2="0%">',
            '      <stop offset="0%" stop-color="rgba(93,169,233,0)"></stop>',
            '      <stop offset="35%" stop-color="rgba(93,169,233,0.2)"></stop>',
            '      <stop offset="70%" stop-color="rgba(139,107,232,0.18)"></stop>',
            '      <stop offset="100%" stop-color="rgba(139,107,232,0)"></stop>',
            '    </linearGradient>',
            '    <linearGradient id="streamB" x1="0%" y1="0%" x2="100%" y2="100%">',
            '      <stop offset="0%" stop-color="rgba(255,158,109,0)"></stop>',
            '      <stop offset="42%" stop-color="rgba(255,158,109,0.12)"></stop>',
            '      <stop offset="76%" stop-color="rgba(193,156,255,0.18)"></stop>',
            '      <stop offset="100%" stop-color="rgba(193,156,255,0)"></stop>',
            '    </linearGradient>',
            '  </defs>',
            '  <path d="M-40 148 C120 104, 248 112, 376 170 S620 248, 790 204 S980 114, 1080 144" fill="none" stroke="url(#streamA)" stroke-width="2.6" stroke-linecap="round" opacity="0.64"></path>',
            '  <path d="M-60 432 C120 402, 242 352, 358 368 S598 454, 760 432 S940 336, 1060 364" fill="none" stroke="url(#streamB)" stroke-width="2.2" stroke-linecap="round" opacity="0.52"></path>',
            '  <path d="M120 96 C208 142, 320 136, 420 102" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="3 11" opacity="0.54"></path>',
            '  <path d="M620 520 C690 480, 760 470, 850 492" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="3 12" opacity="0.42"></path>',
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
            var point = pickAmbientPoint();
            var p = document.createElement("span");
            p.style.left = point.x + "%";
            p.style.top = point.y + "%";
            p.style.setProperty("--size", 2 + Math.random() * 6 + "px");
            p.style.setProperty("--dur", 5 + Math.random() * 9 + "s");
            p.style.setProperty("--dx", (-28 + Math.random() * 56) + "px");
            p.style.setProperty("--dy", (-90 - Math.random() * 90) + "px");
            p.style.setProperty("--glow", ["rgba(255,209,102,0.28)", "rgba(125,205,255,0.26)", "rgba(163,123,255,0.28)", "rgba(255,182,222,0.18)"][i % 4]);
            container.appendChild(p);
          }
        }

        function fillRuleField(container, layerName) {
          var glyphs = [
            { text: "\u706b", tone: "rift", effect: "fire" },
            { text: "\u8f7b", tone: "gravity", effect: "rise" },
            { text: "\u98ce", tone: "forest", effect: "wind" },
            { text: "\u4e0a", tone: "gravity", effect: "rise" },
            { text: "\u5206", tone: "rift", effect: "split" },
            { text: "\u51b0", tone: "gravity", effect: "ice" },
            { text: "\u843d", tone: "rift", effect: "fall" },
            { text: "\u6d6e", tone: "gravity", effect: "rise" },
            { text: "\u88c2", tone: "rift", effect: "crack" },
            { text: "\u68ee", tone: "forest", effect: "glow" },
            { text: "\u751f", tone: "forest", effect: "glow" },
            { text: "\u6728", tone: "forest", effect: "wind" },
            { text: "\u5149", tone: "forest", effect: "glow" },
            { text: "\u7a7a", tone: "gravity", effect: "rotate" }
          ];
          var count = layerName === "back" ? 18 : 9;
          for (var i = 0; i < count; i += 1) {
            var data = glyphs[i % glyphs.length];
            var point = pickAmbientPoint();
            var g = document.createElement("span");
            var depth = layerName === "back"
              ? [ "depth-far", "depth-mid", "depth-ghost" ][i % 3]
              : [ "depth-mid", "depth-near", "depth-ghost" ][i % 3];
            var variant = [ "variant-glow", "variant-ink", "variant-broken", "variant-soft" ][i % 4];
            g.className = "rule-glyph tone-" + data.tone + " effect-" + data.effect + " " + depth + " " + variant;
            g.textContent = data.text;
            g.style.left = point.x + "%";
            g.style.top = point.y + "%";
            g.style.setProperty("--size", (layerName === "back" ? 24 : 34) + Math.random() * (layerName === "back" ? 34 : 24) + "px");
            g.style.setProperty("--dur", 12 + Math.random() * 16 + "s");
            g.style.setProperty("--dx", (-30 + Math.random() * 60) + "px");
            g.style.setProperty("--dy", (-34 + Math.random() * 68) + "px");
            g.style.setProperty("--rot", (-18 + Math.random() * 36) + "deg");
            g.style.setProperty("--opacity", String(layerName === "back" ? 0.16 + Math.random() * 0.18 : 0.14 + Math.random() * 0.16));
            g.style.animationDelay = (-Math.random() * 10) + "s";
            container.appendChild(g);
          }
        }

        function fillGiantGlyphs(container) {
          [
            { text: "\u8f7b", tone: "gravity", x: "74%", y: "10%", size: "220px", dur: "42s", rot: "8deg" },
            { text: "\u68a6", tone: "gravity", x: "10%", y: "54%", size: "260px", dur: "50s", rot: "-10deg" },
            { text: "\u88c2", tone: "rift", x: "80%", y: "58%", size: "190px", dur: "38s", rot: "12deg" }
          ].forEach(function (item, index) {
            var glyph = document.createElement("span");
            glyph.className = "giant-glyph tone-" + item.tone;
            glyph.textContent = item.text;
            glyph.style.left = item.x;
            glyph.style.top = item.y;
            glyph.style.setProperty("--size", item.size);
            glyph.style.setProperty("--dur", item.dur);
            glyph.style.setProperty("--rot", item.rot);
            glyph.style.animationDelay = (-index * 7) + "s";
            container.appendChild(glyph);
          });
        }

        function fillRuleConstellations(container) {
          var zoneWords = [
            {
              tone: "forest",
              items: [
                { text: "\u6728", effect: "wind", x: 12, y: 24, size: 34 },
                { text: "\u751f", effect: "glow", x: 20, y: 36, size: 26 },
                { text: "\u98ce", effect: "wind", x: 30, y: 22, size: 30 },
                { text: "\u68ee", effect: "glow", x: 24, y: 52, size: 30 },
                { text: "\u5149", effect: "glow", x: 36, y: 34, size: 24 }
              ]
            },
            {
              tone: "gravity",
              items: [
                { text: "\u8f7b", effect: "rise", x: 66, y: 18, size: 34 },
                { text: "\u6d6e", effect: "rise", x: 74, y: 34, size: 28 },
                { text: "\u4e0a", effect: "rotate", x: 80, y: 22, size: 26 },
                { text: "\u7a7a", effect: "rotate", x: 58, y: 32, size: 24 },
                { text: "\u8f6c", effect: "rotate", x: 70, y: 48, size: 22 }
              ]
            },
            {
              tone: "rift",
              items: [
                { text: "\u88c2", effect: "crack", x: 30, y: 66, size: 34 },
                { text: "\u706b", effect: "fire", x: 44, y: 58, size: 28 },
                { text: "\u5d29", effect: "crack", x: 56, y: 68, size: 24 },
                { text: "\u843d", effect: "fall", x: 62, y: 54, size: 26 },
                { text: "\u65ad", effect: "split", x: 48, y: 76, size: 22 }
              ]
            }
          ];
          zoneWords.forEach(function (zone, zoneIndex) {
            zone.items.forEach(function (item, itemIndex) {
              var g = document.createElement("span");
              g.className = "rule-glyph constellation tone-" + zone.tone + " effect-" + item.effect + " " + [ "depth-mid", "depth-near", "depth-ghost" ][itemIndex % 3];
              g.textContent = item.text;
              g.style.left = item.x + "%";
              g.style.top = item.y + "%";
              g.style.setProperty("--size", item.size + "px");
              g.style.setProperty("--dur", 10 + itemIndex * 2.2 + zoneIndex * 1.4 + "s");
              g.style.setProperty("--dx", (-14 + itemIndex * 8) + "px");
              g.style.setProperty("--dy", (-12 + zoneIndex * 8 + itemIndex * 4) + "px");
              g.style.setProperty("--rot", (-10 + itemIndex * 8) + "deg");
              g.style.setProperty("--opacity", String(0.18 + (itemIndex % 3) * 0.05));
              g.style.animationDelay = (-itemIndex * 1.6) + "s";
              container.appendChild(g);
            });
          });
        }

        function fillFragments(container) {
          var chars = ["\u706b", "\u8f7b", "\u5206", "\u51b0", "\u68a6", "\u5149", "\u5f71", "\u98ce", "\u88c2", "\u6d6e", "\u843d", "\u751f"];
          for (var i = 0; i < 12; i += 1) {
            var point = pickAmbientPoint();
            var g = document.createElement("span");
            g.className = "fragment-glyph";
            g.textContent = chars[i % chars.length];
            g.style.left = point.x + "%";
            g.style.top = point.y + "%";
            g.style.setProperty("--size", 18 + Math.random() * 20 + "px");
            g.style.setProperty("--dur", 9 + Math.random() * 10 + "s");
            g.style.setProperty("--glow", ["rgba(255,158,109,0.16)", "rgba(93,169,233,0.18)", "rgba(139,107,232,0.2)", "rgba(95,191,119,0.18)"][i % 4]);
            g.style.setProperty("--rot", (-16 + Math.random() * 32) + "deg");
            g.style.setProperty("--dx", (-22 + Math.random() * 44) + "px");
            g.style.setProperty("--dy", (-28 + Math.random() * 56) + "px");
            g.style.opacity = String(0.12 + Math.random() * 0.18);
            g.style.animationDelay = (-Math.random() * 8) + "s";
            container.appendChild(g);
          }
        }

        function fillMidspace(container) {
          for (var i = 0; i < 10; i += 1) {
            var ringPoint = pickAmbientPoint();
            var ring = document.createElement("span");
            ring.className = "mid-ring";
            ring.style.left = ringPoint.x + "%";
            ring.style.top = ringPoint.y + "%";
            ring.style.setProperty("--size", 26 + Math.random() * 68 + "px");
            ring.style.setProperty("--dur", 14 + Math.random() * 12 + "s");
            ring.style.animationDelay = (-Math.random() * 12) + "s";
            container.appendChild(ring);
          }

          for (var j = 0; j < 12; j += 1) {
            var shardPoint = pickAmbientPoint();
            var shard = document.createElement("span");
            shard.className = "mid-shard";
            shard.style.left = shardPoint.x + "%";
            shard.style.top = shardPoint.y + "%";
            shard.style.setProperty("--size", 8 + Math.random() * 18 + "px");
            shard.style.setProperty("--dur", 12 + Math.random() * 14 + "s");
            shard.style.setProperty("--rot", (-22 + Math.random() * 44) + "deg");
            shard.style.animationDelay = (-Math.random() * 10) + "s";
            container.appendChild(shard);
          }

          for (var k = 0; k < 6; k += 1) {
            var tracePoint = pickAmbientPoint();
            var trace = document.createElement("span");
            trace.className = "mid-trace";
            trace.style.left = tracePoint.x + "%";
            trace.style.top = tracePoint.y + "%";
            trace.style.setProperty("--w", 50 + Math.random() * 120 + "px");
            trace.style.setProperty("--dur", 16 + Math.random() * 12 + "s");
            trace.style.setProperty("--rot", (-30 + Math.random() * 60) + "deg");
            trace.style.animationDelay = (-Math.random() * 14) + "s";
            container.appendChild(trace);
          }
        }

        function fillForegroundDrift(container) {
          var chars = ["\u706b", "\u98ce", "\u88c2", "\u6d6e", "\u8f7b", "\u5149"];
          for (var i = 0; i < 5; i += 1) {
            var glyph = document.createElement("span");
            glyph.className = "drift-glyph";
            glyph.textContent = chars[i % chars.length];
            glyph.style.left = (4 + Math.random() * 92) + "%";
            glyph.style.top = (6 + Math.random() * 86) + "%";
            glyph.style.setProperty("--size", 20 + Math.random() * 28 + "px");
            glyph.style.setProperty("--dur", 18 + Math.random() * 14 + "s");
            glyph.style.setProperty("--dx", (-24 + Math.random() * 48) + "px");
            glyph.style.setProperty("--dy", (-40 + Math.random() * 60) + "px");
            glyph.style.animationDelay = (-Math.random() * 12) + "s";
            container.appendChild(glyph);
          }

          for (var j = 0; j < 12; j += 1) {
            var mote = document.createElement("span");
            mote.className = j % 3 === 0 ? "drift-paper" : "drift-mote";
            mote.style.left = (2 + Math.random() * 96) + "%";
            mote.style.top = (4 + Math.random() * 90) + "%";
            mote.style.setProperty("--size", 5 + Math.random() * 16 + "px");
            mote.style.setProperty("--dur", 14 + Math.random() * 16 + "s");
            mote.style.setProperty("--dx", (-18 + Math.random() * 36) + "px");
            mote.style.setProperty("--dy", (-36 + Math.random() * 58) + "px");
            mote.style.setProperty("--rot", (-28 + Math.random() * 56) + "deg");
            mote.style.animationDelay = (-Math.random() * 14) + "s";
            container.appendChild(mote);
          }
        }

        function pickAmbientPoint() {
          var x = 0;
          var y = 0;
          var tries = 0;
          do {
            x = 4 + Math.random() * 92;
            y = 8 + Math.random() * 80;
            tries += 1;
          } while (tries < 10 && x > 34 && x < 66 && y > 20 && y < 74);
          return { x: x, y: y };
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
