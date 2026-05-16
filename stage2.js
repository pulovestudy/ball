(function () {
  var canvas = document.getElementById("stageCanvas");
  var ctx = canvas.getContext("2d");
  var objectiveText = document.getElementById("objectiveText");
  var hintText = document.getElementById("hintText");
  var toast = document.getElementById("toast");
  var progressList = document.getElementById("progressList");
  var playerNameInput = document.getElementById("playerName");
  var startModal = document.getElementById("startModal");
  var startNameInput = document.getElementById("startNameInput");
  var startError = document.getElementById("startError");
  var startGameButton = document.getElementById("startGameButton");
  var introMeta = document.getElementById("introMeta");
  var introGlyph = document.getElementById("introGlyph");
  var introLinePrimary = document.getElementById("introLinePrimary");
  var introLineSecondary = document.getElementById("introLineSecondary");
  var introPrompt = document.getElementById("introPrompt");
  var introWorldline = document.getElementById("introWorldline");
  var introStage = document.getElementById("introStage");
  var introStepCounter = document.getElementById("introStepCounter");
  var introActionButton = document.getElementById("introActionButton");
  var introContinueButton = document.getElementById("introContinueButton");
  var introFinishButton = document.getElementById("introFinishButton");
  var introSkipButton = document.getElementById("introSkipButton");
  var introFloatingActions = document.getElementById("introFloatingActions");
  var startEntryIntro = document.getElementById("startEntryIntro");
  var startEntryPanel = document.getElementById("startEntryPanel");
  var timerText = document.getElementById("timerText");
  var honorList = document.getElementById("honorList");
  var resetHonorButton = document.getElementById("resetHonorButton");
  var victoryModal = document.getElementById("victoryModal");
  var finalTimeText = document.getElementById("finalTimeText");
  var rankText = document.getElementById("rankText");
  var modalHonorList = document.getElementById("modalHonorList");
  var nextStageButton = document.getElementById("nextStageButton");
  var homeButton = document.getElementById("homeButton");
  var shatterChip = document.getElementById("shatterChip");
  var memoryChip = document.getElementById("memoryChip");
  var fireChip = document.getElementById("fireChip");
  var lightChip = document.getElementById("lightChip");
  var flashChip = document.getElementById("flashChip");

  var DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  var TILE_W = 96;
  var TILE_H = 48;
  var FLOOR_DEPTH = 20;
  var LOW_WALL_H = 22;
  var TALL_WALL_H = 62;
  var originX = 0;
  var originY = 0;

  var world = createWorld();
  var floatingGlyphs = createGlyphs();
  var floatingMotes = createMotes();
  var activeShadowTiles = new Set();
  var fireBursts = [];
  var toastTimer = 0;
  var LEADERBOARD_KEY = "yanling-stage2-honor-board";
  var PLAYER_NAME_KEY = "yanling-stage2-player-name";
  var HOME_FOCUS_STAGE_KEY = "yanling-home-focus-stage";
  var enteredFromHome = window.sessionStorage.getItem("yanling-stage-entry") === "home-stage-2";
  var INTRO_STEPS = [
    {
      scene: "street",
      button: "action",
      buttonLabel: "踏进夜路",
      meta: "",
      glyph: "夜",
      primary: "深夜的居民区刚下过雨，路面潮湿，远处只剩模糊的灯。",
      secondary: "迟夜总是走得很慢。夜色会吃掉方向感，连熟悉的巷口也像陌生的地方。",
      prompt: "",
      worldline: ""
    },
    {
      scene: "blur",
      button: "continue",
      buttonLabel: "继续向前",
      meta: "",
      glyph: "暗",
      primary: "晚上总是很难看清路。有时候，甚至不知道前面还有没有路。",
      secondary: "霓虹会化成散开的光斑，边界变得模糊，脚下每一步都要先试着确认。",
      prompt: "再往前一点，去感受那种既熟悉又不安的失焦感。",
      worldline: "夜盲症不是单纯的黑，而是空间在眼前慢慢失去轮廓。 "
    },
    {
      scene: "narrow",
      button: "continue",
      buttonLabel: "再靠近一点",
      meta: "",
      glyph: "路",
      primary: "很多时候，他只能先看清脚边很近的一小块地方。",
      secondary: "远处不是完全消失，而是需要靠近、停顿、再靠近，才能慢慢把路认出来。",
      prompt: "",
      worldline: ""
    },
    {
      scene: "lamp",
      button: "continue",
      buttonLabel: "看向那盏灯",
      meta: "",
      glyph: "光",
      primary: "不是路灯，也不是太阳。只是某户人家阳台上，专门还为你留着一盏暖黄的小灯。",
      secondary: "它不强，也不刺眼，却让迟夜第一次觉得，夜里原来也能有一条愿意被看见的路。",
      prompt: "",
      worldline: ""
    },
    {
      scene: "corridor",
      button: "finish",
      buttonLabel: "来到入口",
      meta: "",
      glyph: "影",
      primary: "沿着这点暖光继续向前，现实的夜路开始和文字构成的回廊慢慢重叠。",
      secondary: "从这里开始，情景导入结束，真正的第二关才会展开。",
      prompt: "",
      worldline: ""
    },
    {
      scene: "corridor",
      button: "entry",
      meta: "",
      glyph: "影",
      primary: "原来照亮回家路的，从来不是太阳。",
      secondary: "而是那些，愿意为你留着的灯。",
      prompt: "现在输入名字，再正式进入失重回廊。",
      worldline: "从这一刻起，引导结束，关卡开始。"
    }
  ];

  var state = {
    lastTime: 0,
    beam: null,
    started: false,
    victory: false,
    scoreSubmitted: false,
    shadowTriggered: 0,
    iceLessonLearned: false,
    alertHintUntil: 0,
    runStartedAt: 0,
    elapsed: 0,
    playerName: "",
    lightUnlocked: false,
    lightUsed: false,
    lightRevealUntil: 0,
    lightningBlindUntil: 0,
    puddleTriggered: false,
    lightningTriggered: false,
    intro: {
      step: 0
    },
    player: {
      x: world.start.x,
      y: world.start.y,
      fromX: world.start.x,
      fromY: world.start.y,
      toX: world.start.x,
      toY: world.start.y,
      moveT: 1,
      moveDuration: 0.22,
      arrivalType: "floor",
      facing: "right",
      moveDx: 1,
      moveDy: -1,
      sliding: false,
      falling: false,
      fallT: 0,
      fallReason: "gap"
    }
  };

  function createWorld() {
    var floors = new Map();
    var gaps = new Map();
    var lowWalls = new Map();
    var tallWalls = new Map();
    var iceTiles = new Map();
    var puddles = new Map();
    var lamps = new Map();
    var lightningZones = new Map();

    addTiles(floors, [
      [1, 17, "wood"],
      [2, 16, "wood"],
      [2, 14, "moss"],
      [3, 17, "wood"],
      [3, 15, "wood"],
      [3, 13, "wood"],
      [4, 16, "wood"],
      [4, 14, "moss"],
      [4, 12, "wood"],
      [5, 15, "wood"],
      [5, 13, "wood"],
      [5, 11, "moss"],
      [6, 12, "wood"],
      [6, 10, "wood"],
      [7, 11, "wood"],
      [7, 9, "wood"],
      [8, 10, "wood"],
      [8, 8, "moss"],
      [9, 9, "wood"],
      [9, 7, "moss"],
      [10, 8, "wood"],
      [10, 6, "wood"],
      [11, 7, "wood"],
      [11, 5, "wood"],
      [12, 4, "wood"],
      [13, 3, "wood"],
      [14, 4, "moss"],
      [15, 5, "wood"],
      [16, 4, "wood"],
      [19, 3, "wood"],
      [20, 2, "wood"],
      [21, 3, "altar"]
    ]);

    addGap(gaps, 9, 7, true);
    addGap(gaps, 14, 4, true);

    addLowWall(lowWalls, 6, 10, "lw1");
    addLowWall(lowWalls, 10, 8, "lw2");
    addLowWall(lowWalls, 15, 5, "lw3");

    addIceTile(iceTiles, 11, 5, "ice1");
    addIceTile(iceTiles, 12, 4, "ice1");
    addIceTile(iceTiles, 13, 3, "ice1");
    addIceTile(iceTiles, 20, 2, "ice2");

    addPuddle(puddles, 4, 14, "puddle1");
    addLamp(lamps, 7, 11, "lamp1");
    addLightningZone(lightningZones, 12, 4, "lightning1");

    addTallWall(tallWalls, 8, 10, "tw0", null);
    addTallWall(tallWalls, 12, 8, "tw1", null);
    addTallWall(tallWalls, 17, 5, "tw2", {
      shadowTiles: [{ x: 17, y: 3 }, { x: 18, y: 4 }, { x: 19, y: 3 }],
      duration: 4
    });

    return {
      width: 26,
      height: 20,
      floors: floors,
      gaps: gaps,
      lowWalls: lowWalls,
      tallWalls: tallWalls,
      iceTiles: iceTiles,
      puddles: puddles,
      lamps: lamps,
      lightningZones: lightningZones,
      iceGroupCount: 2,
      start: { x: 2, y: 16 },
      goal: { x: 21, y: 3 }
    };
  }

  function addTiles(store, entries) {
    entries.forEach(function (entry) {
      store.set(tileKey(entry[0], entry[1]), {
        x: entry[0],
        y: entry[1],
        type: entry[2],
        elevation: entry[2] === "altar" ? 10 : 0
      });
    });
  }

  function addGap(store, x, y, recoverable) {
    store.set(tileKey(x, y), {
      x: x,
      y: y,
      recoverable: recoverable,
      restored: false,
      restoreUntil: 0
    });
  }

  function addLowWall(store, x, y, id) {
    store.set(tileKey(x, y), {
      id: id,
      x: x,
      y: y,
      broken: false
    });
  }

  function addTallWall(store, x, y, id, shadow) {
    store.set(tileKey(x, y), {
      id: id,
      x: x,
      y: y,
      shadow: shadow,
      shadowUntil: 0
    });
  }

  function addIceTile(store, x, y, group) {
    store.set(tileKey(x, y), {
      x: x,
      y: y,
      group: group,
      melted: false
    });
  }

  function addPuddle(store, x, y, id) {
    store.set(tileKey(x, y), {
      id: id,
      x: x,
      y: y,
      triggered: false
    });
  }

  function addLamp(store, x, y, id) {
    store.set(tileKey(x, y), {
      id: id,
      x: x,
      y: y,
      found: false
    });
  }

  function addLightningZone(store, x, y, id) {
    store.set(tileKey(x, y), {
      id: id,
      x: x,
      y: y,
      triggered: false
    });
  }

  function createGlyphs() {
    return [
      { text: "轻", x: 0.14, y: 0.2, tone: "rgba(177, 208, 255, 0.22)", size: 88, speed: 0.24 },
      { text: "风", x: 0.82, y: 0.22, tone: "rgba(187, 245, 198, 0.18)", size: 74, speed: 0.18 },
      { text: "裂", x: 0.72, y: 0.74, tone: "rgba(255, 188, 146, 0.14)", size: 86, speed: 0.22 },
      { text: "生", x: 0.18, y: 0.78, tone: "rgba(207, 247, 211, 0.2)", size: 68, speed: 0.2 }
    ];
  }

  function createMotes() {
    var motes = [];
    for (var i = 0; i < 24; i += 1) {
      motes.push({
        x: Math.random(),
        y: Math.random(),
        r: 1 + Math.random() * 3,
        speed: 0.05 + Math.random() * 0.12,
        alpha: 0.16 + Math.random() * 0.28
      });
    }
    return motes;
  }

  function getPlayerName() {
    var raw = (playerNameInput.value || "").trim();
    return raw || "游客";
  }

  function syncPlayerName(name) {
    state.playerName = name;
    playerNameInput.value = name;
    startNameInput.value = name;
    window.localStorage.setItem(PLAYER_NAME_KEY, name);
  }

  function formatTime(seconds) {
    var safe = Math.max(0, seconds || 0);
    var minutes = Math.floor(safe / 60);
    var remain = safe - minutes * 60;
    var secs = Math.floor(remain);
    var centis = Math.floor((remain - secs) * 100);
    return String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0") + "." + String(centis).padStart(2, "0");
  }

  function updateTimerDisplay() {
    timerText.textContent = formatTime(state.elapsed);
  }

  function syncIntroCopy(copy) {
    if (!copy) {
      return;
    }
    if (introGlyph && copy.glyph) {
      introGlyph.textContent = copy.glyph;
    }
    if (introLinePrimary && copy.primary) {
      introLinePrimary.textContent = copy.primary;
    }
    if (introLineSecondary && copy.secondary) {
      introLineSecondary.textContent = copy.secondary;
    }
    if (introPrompt) {
      introPrompt.textContent = Object.prototype.hasOwnProperty.call(copy, "prompt") ? copy.prompt : "";
      introPrompt.classList.toggle("is-hidden", !copy.prompt);
    }
    if (introWorldline) {
      introWorldline.textContent = Object.prototype.hasOwnProperty.call(copy, "worldline") ? copy.worldline : "";
      introWorldline.classList.toggle("is-hidden", !copy.worldline);
    }
  }

  function setNodeHidden(node, hidden) {
    if (!node) {
      return;
    }
    node.hidden = hidden;
    node.classList.toggle("is-hidden", hidden);
  }

  function renderIntroStep() {
    var step = INTRO_STEPS[state.intro.step];
    if (!step) {
      return;
    }

    syncIntroCopy(step);
    if (introStage) {
      introStage.setAttribute("data-scene", step.scene);
    }

    setNodeHidden(introFloatingActions, step.button === "entry");
    setNodeHidden(introActionButton, step.button !== "action");
    setNodeHidden(introContinueButton, step.button !== "continue");
    setNodeHidden(introFinishButton, step.button !== "finish");
    setNodeHidden(introSkipButton, step.button === "entry");
    setNodeHidden(startEntryIntro, step.button !== "entry");
    setNodeHidden(startEntryPanel, step.button !== "entry");

    if (step.button === "action") {
      introActionButton.textContent = step.buttonLabel;
    } else if (step.button === "continue") {
      introContinueButton.textContent = step.buttonLabel;
    } else if (step.button === "finish") {
      introFinishButton.textContent = step.buttonLabel;
    }

    if (step.button === "entry") {
      startNameInput.focus();
    }
  }

  function advanceIntroStep() {
    if (state.intro.step < INTRO_STEPS.length - 1) {
      state.intro.step += 1;
      renderIntroStep();
    }
  }

  function skipIntro() {
    state.intro.step = INTRO_STEPS.length - 1;
    renderIntroStep();
  }

  function loadLeaderboard() {
    try {
      var raw = window.localStorage.getItem(LEADERBOARD_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveLeaderboard(entries) {
    window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  }

  function renderHonorList(node, entries, limit) {
    if (!entries.length) {
      node.innerHTML = "<li>暂无记录</li>";
      return;
    }

    node.innerHTML = entries.slice(0, limit).map(function (entry, index) {
      return "<li>#" + String(index + 1) + "  " + escapeHtml(entry.name) + "  ·  " + formatTime(entry.time) + "</li>";
    }).join("");
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function refreshHonorBoard() {
    renderHonorList(honorList, loadLeaderboard(), 6);
  }

  function resetLeaderboard() {
    if (!window.confirm("确定要清空 Stage 2 荣誉榜吗？")) {
      return;
    }
    window.localStorage.removeItem(LEADERBOARD_KEY);
    refreshHonorBoard();
    renderHonorList(modalHonorList, [], 8);
    setToast("荣誉榜已重置。");
  }

  function submitScore() {
    if (state.scoreSubmitted) {
      return;
    }

    state.scoreSubmitted = true;
    var entries = loadLeaderboard();
    var name = state.playerName || getPlayerName();
    window.localStorage.setItem(PLAYER_NAME_KEY, name);

    entries.push({
      name: name,
      time: Number(state.elapsed.toFixed(2)),
      createdAt: Date.now()
    });

    entries.sort(function (a, b) {
      if (a.time !== b.time) {
        return a.time - b.time;
      }
      return a.createdAt - b.createdAt;
    });
    entries = entries.slice(0, 12);
    saveLeaderboard(entries);
    refreshHonorBoard();

    var rank = entries.findIndex(function (entry) {
      return entry.name === name && entry.time === Number(state.elapsed.toFixed(2));
    }) + 1;

    finalTimeText.textContent = "本次用时：" + formatTime(state.elapsed);
    rankText.textContent = "当前排名：第 " + String(rank || entries.length) + " 名";
    renderHonorList(modalHonorList, entries, 8);
    victoryModal.classList.add("is-visible");
    victoryModal.setAttribute("aria-hidden", "false");
  }

  function closeVictoryModal() {
    victoryModal.classList.remove("is-visible");
    victoryModal.setAttribute("aria-hidden", "true");
  }

  function goHome() {
    window.location.href = "./index.html";
  }

  function goNextStage() {
    window.location.reload();
  }

  function beginStage() {
    if (state.intro.step !== INTRO_STEPS.length - 1) {
      advanceIntroStep();
      return;
    }
    var name = (startNameInput.value || "").trim();
    if (!name) {
      startError.textContent = "请先输入玩家名，再开始游戏。";
      startNameInput.focus();
      return;
    }

    startError.textContent = "";
    syncPlayerName(name);
    state.started = true;
    state.runStartedAt = 0;
    state.elapsed = 0;
    startModal.classList.remove("is-visible");
    startModal.setAttribute("aria-hidden", "true");
    playerNameInput.readOnly = true;
    canvas.focus();

    if (enteredFromHome) {
      setToast("你已从首页进入 Stage 2。先适应脚边两格视野，再留意积水、微灯、闪电与新增的 G【光】。");
      window.sessionStorage.removeItem("yanling-stage-entry");
      enteredFromHome = false;
    } else {
      setToast("第二关开始。地图只会照亮小球周围两格，继续用 1【碎】、2【忆】、3【火】、G【光】、F 手电推进。");
    }

    refreshContextHint();
    updateObjective();
  }

  function spawnFireBurst(centerX, centerY) {
    for (var i = 0; i < 14; i += 1) {
      fireBursts.push({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 1.8,
        vy: -0.6 - Math.random() * 1.5,
        size: 6 + Math.random() * 8,
        ttl: 0.36 + Math.random() * 0.24
      });
    }
  }

  function updateFireBursts(dt) {
    fireBursts = fireBursts.filter(function (burst) {
      burst.ttl -= dt;
      burst.x += burst.vx;
      burst.y += burst.vy;
      burst.vy -= dt * 0.18;
      return burst.ttl > 0;
    });
  }

  function tileKey(x, y) {
    return String(x) + "," + String(y);
  }

  function resizeCanvas() {
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    originX = window.innerWidth * 0.5;
    originY = window.innerHeight * 0.56;
  }

  function isoPoint(x, y, z) {
    return {
      x: originX + (x - y) * TILE_W * 0.5,
      y: originY + (x + y) * TILE_H * 0.5 - z
    };
  }

  function updateCamera(width, height) {
    var focus = state.started ? getPlayerInterpolatedPosition() : { x: world.start.x, y: world.start.y };
    var targetX = width * 0.5;
    var targetY = height * 0.58;
    originX = targetX - (focus.x - focus.y) * TILE_W * 0.5;
    originY = targetY - (focus.x + focus.y) * TILE_H * 0.5 + 26;
  }

  function getTileVisibility(x, y) {
    if (!state.started) {
      return 1;
    }
    if (state.lightRevealUntil > state.lastTime) {
      return 1;
    }
    var focus = getPlayerInterpolatedPosition();
    var distance = Math.abs(x - focus.x) + Math.abs(y - focus.y);
    var lampVisibility = getLampVisibilityBoost(x, y, focus.x, focus.y);
    if (distance <= 2.05) {
      return Math.max(1, lampVisibility);
    }
    return lampVisibility;
  }

  function isTileHidden(alpha) {
    return alpha <= 0;
  }

  function getLampVisibilityBoost(x, y, playerX, playerY) {
    var best = 0;
    world.lamps.forEach(function (lamp) {
      var playerDistance = Math.abs(playerX - lamp.x) + Math.abs(playerY - lamp.y);
      if (playerDistance > 2.4) {
        return;
      }
      var tileDistance = Math.abs(x - lamp.x) + Math.abs(y - lamp.y);
      if (tileDistance <= 1.5) {
        best = Math.max(best, 1);
      } else if (tileDistance <= 2.4) {
        best = Math.max(best, 0.38);
      }
    });
    return best;
  }

  function setToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("visible");
    }, 2200);
  }

  function setHint(message, tone) {
    hintText.textContent = message;
    hintText.classList.toggle("is-alert", tone === "alert");
    if (tone === "alert") {
      state.alertHintUntil = state.lastTime + 1.35;
    }
  }

  function updateObjective() {
    if (!state.started) {
      objectiveText.textContent = "先输入名字并点击开始。第二关会沿袭第一关的地图与技能，但整张地图只会照亮你身边两格。";
      progressList.innerHTML = [
        "<li>积水失衡：未触发</li>",
        "<li>微弱灯光：未找到</li>",
        "<li>【光】技能：未解锁</li>",
        "<li>闪电失明：未触发</li>",
        "<li>阴影路径：未触发</li>"
      ].join("");
      return;
    }

    var broken = countBrokenWalls();
    var restored = countRestoredGaps();
    var melted = countMeltedIceGroups();
    var foundLamp = countFoundLamps();

    if (!state.puddleTriggered) {
      objectiveText.textContent = "先经过前方那滩积水。它会让你第一次失去重心，被惯性带出一步。";
    } else if (!state.lightUnlocked) {
      objectiveText.textContent = "前方有一盏微弱暖灯。靠近它，先获得一次局部安全感。";
    } else if (!state.lightUsed) {
      objectiveText.textContent = "【光】已经解锁。先按 G 短暂看清全图 2 秒，记住后面的路和障碍。";
    } else if (!world.lowWalls.get(tileKey(6, 10)).broken) {
      objectiveText.textContent = "先贴近第一面矮墙，在近距离视野里确认位置后按 1【碎】打开主路。";
    } else if (!world.gaps.get(tileKey(9, 7)).restored) {
      objectiveText.textContent = "第一处空洞就在黑里，靠近后按 2【忆】短暂补路，抓住 3 秒窗口穿过去。";
    } else if (!world.lowWalls.get(tileKey(10, 8)).broken) {
      objectiveText.textContent = "第二面矮墙藏在回廊拐点里，继续靠近后按 1【碎】破坏它。";
    } else if (!state.iceLessonLearned && melted < 1) {
      objectiveText.textContent = "前面是第一组冰面。先踩上去体会它会沿当前方向冲刺，再决定怎么处理。";
    } else if (melted < 1) {
      objectiveText.textContent = "看清冰面的轮廓后，靠近按 3【火】烧融它，稳定穿过这段暗路。";
    } else if (!state.lightningTriggered) {
      objectiveText.textContent = "继续前进。前面那段回廊会触发闪电，你会短暂失明 1 秒。";
    } else if (!world.gaps.get(tileKey(14, 4)).restored) {
      objectiveText.textContent = "第二处大空洞会截断回廊，再次使用 2【忆】补出临时落脚点。";
    } else if (!world.lowWalls.get(tileKey(15, 5)).broken) {
      objectiveText.textContent = "出口前还有最后一面矮墙，在看清边缘后按 1【碎】破开。";
    } else if (state.shadowTriggered < 1) {
      objectiveText.textContent = "高墙切断了最后的回廊。靠近后按 F，用手电照出 4 秒阴影路径。";
    } else if (melted < 2) {
      objectiveText.textContent = "终点前还有最后一组冰面。先用 3【火】烧掉它，再走上终点祭坛。";
    } else if (!state.victory) {
      objectiveText.textContent = "终点已经可达。沿着最后一段被看清的路，完成 Stage 2。";
    } else {
      objectiveText.textContent = "Stage 2 完成。你已经学会在有限视野里继续使用文字规则。";
    }

    progressList.innerHTML = [
      "<li>积水失衡：" + (state.puddleTriggered ? "已触发" : "未触发") + "</li>",
      "<li>微弱灯光：" + (foundLamp ? "已找到" : "未找到") + "</li>",
      "<li>【光】技能：" + (state.lightUnlocked ? "已解锁" : "未解锁") + "</li>",
      "<li>闪电失明：" + (state.lightningTriggered ? "已触发" : "未触发") + "</li>",
      "<li>阴影路径：" + state.shadowTriggered + " / 1</li>"
    ].join("");
  }

  function countBrokenWalls() {
    var count = 0;
    world.lowWalls.forEach(function (wall) {
      if (wall.broken) {
        count += 1;
      }
    });
    return count;
  }

  function countRestoredGaps() {
    var count = 0;
    world.gaps.forEach(function (gap) {
      if (gap.recoverable && gap.restored) {
        count += 1;
      }
    });
    return count;
  }

  function countRecoverableGaps() {
    var count = 0;
    world.gaps.forEach(function (gap) {
      if (gap.recoverable) {
        count += 1;
      }
    });
    return count;
  }

  function countFoundLamps() {
    var count = 0;
    world.lamps.forEach(function (lamp) {
      if (lamp.found) {
        count += 1;
      }
    });
    return count;
  }

  function countMeltedIceGroups() {
    var groups = new Set();
    world.iceTiles.forEach(function (tile) {
      if (tile.melted) {
        groups.add(tile.group);
      }
    });
    return groups.size;
  }

  function syncAbilityChip(chip) {
    [shatterChip, memoryChip, fireChip, lightChip, flashChip].forEach(function (node) {
      node.classList.remove("is-active");
      node.setAttribute("aria-pressed", "false");
    });
    if (chip) {
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");
      window.setTimeout(function () {
        chip.classList.remove("is-active");
        chip.setAttribute("aria-pressed", "false");
      }, 280);
    }
  }

  function getFacingVector() {
    return getDirVector(state.player.facing);
  }

  function currentFacingTile() {
    var dir = getFacingVector();
    return {
      x: state.player.x + dir.x,
      y: state.player.y + dir.y
    };
  }

  function isWithinInteractionRange(targetX, targetY, radius) {
    return Math.max(Math.abs(targetX - state.player.x), Math.abs(targetY - state.player.y)) <= radius;
  }

  function chooseNearbyTarget(store, radius, filter) {
    var best = null;
    var facing = getFacingVector();

    store.forEach(function (entity) {
      if (filter && !filter(entity)) {
        return;
      }

      var dx = entity.x - state.player.x;
      var dy = entity.y - state.player.y;
      var chebyshev = Math.max(Math.abs(dx), Math.abs(dy));

      if (chebyshev > radius) {
        return;
      }

      var score = chebyshev * 100 + Math.abs(dx) + Math.abs(dy);
      if (dx === facing.x && dy === facing.y) {
        score -= 20;
      }

      if (!best || score < best.score) {
        best = {
          score: score,
          entity: entity
        };
      }
    });

    return best ? best.entity : null;
  }

  function castShatter() {
    if (!state.started || state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }
    syncAbilityChip(shatterChip);
    var wall = chooseNearbyTarget(world.lowWalls, 1, function (candidate) {
      return !candidate.broken;
    });
    if (wall) {
      wall.broken = true;
      setToast("【碎】生效：矮墙崩解，新的路径出现。");
      setHint("矮墙已经破坏，继续前进。");
      updateObjective();
      return;
    }
    setToast("附近没有可被【碎】破坏的矮墙。");
  }

  function castMemory() {
    if (!state.started || state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }
    syncAbilityChip(memoryChip);
    var gap = chooseNearbyTarget(world.gaps, 1, function (candidate) {
      return candidate.recoverable && !candidate.restored;
    });
    if (gap) {
      gap.restored = true;
      gap.restoreUntil = state.lastTime + 3;
      setToast("【忆】生效：破碎地面被记忆重新编织。");
      setHint("空洞已经暂时恢复，但它会在 3 秒后再次消失。");
      updateObjective();
      return;
    }
    setToast("附近没有可被【忆】恢复的空洞。");
  }

  function castFire() {
    if (!state.started || state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }
    syncAbilityChip(fireChip);
    var iceTile = chooseNearbyTarget(world.iceTiles, 1, function (candidate) {
      return !candidate.melted;
    });
    if (iceTile) {
      world.iceTiles.forEach(function (candidate) {
        if (candidate.group === iceTile.group) {
          candidate.melted = true;
          spawnFireBurst(candidate.x, candidate.y);
        }
      });
      setToast("【火】生效：冰面被烧融，你可以正常踩过去了。");
      setHint("冰面已经融化，现在可以稳定通过。");
      updateObjective();
      return;
    }
    setToast("附近没有可被【火】烧融的冰面。");
  }

  function castLight() {
    if (!state.started || state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }
    syncAbilityChip(lightChip);
    if (!state.lightUnlocked) {
      setToast("【光】尚未解锁，先靠近那盏暖黄的小灯。");
      return;
    }
    state.lightUsed = true;
    state.lightRevealUntil = state.lastTime + 2;
    setToast("【光】生效：整张地图被微光照亮 2 秒，快记住道路与障碍。");
    setHint("全图已经短暂显现，抓紧时间记住路线。");
    updateObjective();
  }

  function castFlashlight() {
    if (!state.started || state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }
    syncAbilityChip(flashChip);
    var triggered = false;
    var wall = chooseNearbyTarget(world.tallWalls, 1, function (candidate) {
      return Boolean(candidate.shadow);
    });

    if (wall && wall.shadow) {
      wall.shadowUntil = state.lastTime + wall.shadow.duration;
      if (state.shadowTriggered < 1) {
        state.shadowTriggered = 1;
      }
      triggered = true;
      setToast("手电光束击中高墙，阴影路径被暂时具象化。");
      setHint("快通过阴影路径，它只会短暂存在。");
    }

    state.beam = {
      fromX: state.player.x,
      fromY: state.player.y,
      toX: wall ? wall.x : state.player.x + getFacingVector().x * 2.4,
      toY: wall ? wall.y : state.player.y + getFacingVector().y * 2.4,
      ttl: 0.26,
      hit: triggered
    };

    if (!triggered) {
      setToast("靠近高墙后再使用手电，阴影路径才会出现。");
    }
    updateObjective();
  }

  function walkResult(x, y) {
    var key = tileKey(x, y);
    if (world.tallWalls.has(key)) {
      return "block";
    }
    var lowWall = world.lowWalls.get(key);
    if (lowWall && !lowWall.broken) {
      return "block";
    }
    var gap = world.gaps.get(key);
    if (gap) {
      return gap.restored ? "floor" : "gap";
    }
    if (world.puddles.has(key)) {
      return "puddle";
    }
    var iceTile = world.iceTiles.get(key);
    if (iceTile) {
      return iceTile.melted ? "floor" : "ice";
    }
    if (activeShadowTiles.has(key)) {
      return "shadow";
    }
    if (world.floors.has(key)) {
      return "floor";
    }
    return "void";
  }

  function obstacleHintAt(x, y) {
    var key = tileKey(x, y);
    var lowWall = world.lowWalls.get(key);
    var gap = world.gaps.get(key);
    var tallWall = world.tallWalls.get(key);
    var iceTile = world.iceTiles.get(key);
    var puddle = world.puddles.get(key);

    if (puddle) {
      return "前面是积水，踩上去会失去重心，被惯性带出一步。";
    }
    if (lowWall && !lowWall.broken) {
      return "前面是矮墙，靠近后按 1 使用【碎】破坏它。";
    }
    if (gap && gap.recoverable && !gap.restored) {
      return "前面是空洞，靠近后按 2 使用【忆】恢复地面，但它只会短暂存在。";
    }
    if (tallWall && tallWall.shadow) {
      return "高墙挡住了路，绕到合适位置后按 F 用手电制造阴影路径。";
    }
    if (tallWall) {
      return "高墙把路线切开了，去找另一条连通的小路。";
    }
    if (iceTile && !iceTile.melted) {
      if (!state.iceLessonLearned) {
        return "前面是冰面，踩上去会沿当前方向一直冲出去。";
      }
      return "前面是冰面，靠近后按 3 使用【火】烧掉它。";
    }
    return "";
  }

  function queueMove(nextX, nextY, result, dx, dy, duration) {
    state.player.fromX = state.player.x;
    state.player.fromY = state.player.y;
    state.player.toX = nextX;
    state.player.toY = nextY;
    state.player.moveT = 0;
    state.player.moveDuration = duration || 0.22;
    state.player.moveDx = dx;
    state.player.moveDy = dy;
    state.player.arrivalType = result;
  }

  function continueIceSlide() {
    var nextX = state.player.x + state.player.moveDx;
    var nextY = state.player.y + state.player.moveDy;
    var result = walkResult(nextX, nextY);

    if (result === "block") {
      state.player.sliding = false;
      setHint("前方有遮挡，冰面冲刺被拦下来了。");
      return false;
    }

    queueMove(nextX, nextY, result, state.player.moveDx, state.player.moveDy, 0.16);
    return true;
  }

  function triggerSlip() {
    state.puddleTriggered = true;
    var nextX = state.player.x + state.player.moveDx;
    var nextY = state.player.y + state.player.moveDy;
    var result = walkResult(nextX, nextY);
    setToast("你踩进了积水，脚下一滑，身体被惯性猛地带出去。");
    setHint("积水会让你短暂失去重心，先记住落脚点。", "alert");
    if (result !== "block") {
      queueMove(nextX, nextY, result, state.player.moveDx, state.player.moveDy, 0.14);
    }
    updateObjective();
  }

  function checkLampUnlock() {
    var unlocked = false;
    world.lamps.forEach(function (lamp) {
      if (lamp.found) {
        return;
      }
      var distance = Math.abs(state.player.x - lamp.x) + Math.abs(state.player.y - lamp.y);
      if (distance <= 1.5) {
        lamp.found = true;
        state.lightUnlocked = true;
        unlocked = true;
      }
    });
    if (unlocked) {
      setToast("你靠近了那盏微弱暖灯。局部安全感回来了，同时解锁了 G【光】。");
      setHint("按 G 使用【光】，整张地图会显现 2 秒。");
      updateObjective();
    }
  }

  function checkLightningZone() {
    if (state.lightningTriggered) {
      return;
    }
    world.lightningZones.forEach(function (zone) {
      if (zone.triggered) {
        return;
      }
      if (state.player.x === zone.x && state.player.y === zone.y) {
        zone.triggered = true;
        state.lightningTriggered = true;
        state.lightningBlindUntil = state.lastTime + 1;
        setToast("一道闪电猛地劈亮夜空，刺目的白光让你瞬间失明。");
        setHint("强光反而会让你短暂失去视野，先稳住。", "alert");
        updateObjective();
      }
    });
  }

  function tryMove(dx, dy) {
    if (!state.started || state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }

    if (dx === -1 && dy === -1) {
      state.player.facing = "up";
    } else if (dx === 1 && dy === 1) {
      state.player.facing = "down";
    } else if (dx === -1 && dy === 1) {
      state.player.facing = "left";
    } else if (dx === 1 && dy === -1) {
      state.player.facing = "right";
    }

    var nextX = state.player.x + dx;
    var nextY = state.player.y + dy;
    var result = walkResult(nextX, nextY);

    if (result === "block") {
      setHint(obstacleHintAt(nextX, nextY) || "这条路被挡住了，试试别的方向。");
      return;
    }

    if (result === "gap") {
      var gapHint = obstacleHintAt(nextX, nextY);
      if (gapHint) {
        setHint(gapHint);
      }
    }

    queueMove(nextX, nextY, result, dx, dy, 0.22);
  }

  function refreshContextHint() {
    if (!state.started) {
      setHint("先输入名字并点击开始。第二关只会照亮你附近两格，真正进入后再看提示。");
      return;
    }

    if (state.victory) {
      setHint("失重回廊已经走完。你可以返回首页，或再试一次这张暗场地图。");
      return;
    }

    if (state.player.falling) {
      if (state.player.fallReason === "void") {
        setHint("你跌出了地图边缘，正在回到最近的安全区域。");
      } else {
        setHint("你掉入了空洞，正在回到最近的安全区域。");
      }
      return;
    }

    if (isPlayerOnShadowTile()) {
      setHint("你正站在阴影路径上，范围视野之外看不清边界，抓紧时间通过。");
      return;
    }

    var lowWall = chooseNearbyTarget(world.lowWalls, 1, function (candidate) {
      return !candidate.broken;
    });
    var gap = chooseNearbyTarget(world.gaps, 1, function (candidate) {
      return candidate.recoverable && !candidate.restored;
    });
    var iceTile = chooseNearbyTarget(world.iceTiles, 1, function (candidate) {
      return !candidate.melted;
    });
    var puddle = chooseNearbyTarget(world.puddles, 1);
    var lamp = chooseNearbyTarget(world.lamps, 1, function (candidate) {
      return !candidate.found;
    });
    var tallWall = chooseNearbyTarget(world.tallWalls, 1, function (candidate) {
      return Boolean(candidate.shadow);
    });
    var solidTallWall = chooseNearbyTarget(world.tallWalls, 1, function (candidate) {
      return !candidate.shadow;
    });

    if (puddle) {
      setHint("前面有积水，踩上去会失去重心，被惯性带出一步。");
      return;
    }
    if (lamp) {
      setHint("那盏暖黄小灯就在附近。靠近它，先获得一次局部安全感。");
      return;
    }
    if (state.lightUnlocked && !state.lightUsed) {
      setHint("G【光】已经解锁。按下后可看清全图 2 秒，先记住前面的障碍布局。");
      return;
    }
    if (lowWall) {
      setHint("矮墙已经进入近距离视野，按 1 使用【碎】破坏它。");
      return;
    }
    if (gap) {
      setHint("空洞就在脚边前方，按 2 使用【忆】恢复地面，注意它 3 秒后会消失。");
      return;
    }
    if (iceTile) {
      if (!state.iceLessonLearned) {
        setHint("前面是冰面，先踩上去试一次，你会沿当前方向被甩出去。");
      } else {
        setHint("冰面已经进入范围视野内，按 3 使用【火】烧掉它，就能正常行走。");
      }
      return;
    }
    if (tallWall) {
      setHint("高墙已经靠近，按 F 用手电照射，制造 4 秒临时阴影路径。");
      return;
    }
    if (solidTallWall) {
      setHint("附近高墙把空间切开了，顺着能看清的近处地块继续绕过去。");
      return;
    }
    if (state.shadowTriggered < 1) {
      setHint("继续沿回廊前进。地图很暗，先把近处两格看清，再往下一段高墙去。");
      return;
    }
    setHint("继续前进，在有限视野里组合不同规则穿过障碍。");
  }

  function isPlayerOnShadowTile() {
    return activeShadowTiles.has(tileKey(state.player.x, state.player.y));
  }

  function triggerFall() {
    if (state.player.falling) {
      return;
    }
    if (state.player.sliding) {
      state.iceLessonLearned = true;
    }
    state.player.falling = true;
    state.player.fallT = 0;
    state.player.fallReason = "gap";
    setToast("空洞吞没了你。记住：有些路必须先被文字恢复。");
    setHint("你掉入了空洞，正在回到重置点。", "alert");
  }

  function triggerVoidFall() {
    if (state.player.falling) {
      return;
    }
    if (state.player.sliding) {
      state.iceLessonLearned = true;
    }
    state.player.falling = true;
    state.player.fallT = 0;
    state.player.fallReason = "void";
    setToast("你踏空跌出了地图边缘。这里没有保护，离开地块就会坠落。");
    setHint("你跌出了地图边缘，正在回到重置点。", "alert");
  }

  function respawnPlayer() {
    state.player.falling = false;
    state.player.fallT = 0;
    state.player.x = world.start.x;
    state.player.y = world.start.y;
    state.player.fromX = world.start.x;
    state.player.fromY = world.start.y;
    state.player.toX = world.start.x;
    state.player.toY = world.start.y;
    state.player.moveT = 1;
    state.player.arrivalType = "floor";
    state.player.facing = "right";
    state.player.moveDx = 1;
    state.player.moveDy = -1;
    state.player.sliding = false;
    state.player.fallReason = "gap";
    state.player.moveDuration = 0.22;
    world.iceTiles.forEach(function (tile) {
      tile.melted = false;
    });
    setHint("你已回到重置点，请留意红色警示后再重新尝试。", "alert");
  }

  function updateShadowTiles(now) {
    activeShadowTiles.clear();
    world.tallWalls.forEach(function (wall) {
      if (wall.shadow && wall.shadowUntil > now) {
        wall.shadow.shadowTiles.forEach(function (tile) {
          activeShadowTiles.add(tileKey(tile.x, tile.y));
        });
      }
    });
  }

  function updateMemoryTiles(now) {
    world.gaps.forEach(function (gap) {
      if (gap.recoverable && gap.restored && gap.restoreUntil <= now) {
        gap.restored = false;
        gap.restoreUntil = 0;
      }
    });
  }

  function updatePlayer(dt) {
    if (state.player.falling) {
      state.player.fallT += dt;
      if (state.player.fallT >= 0.72) {
        respawnPlayer();
      }
      return;
    }

    if (state.player.moveT < 1) {
      state.player.moveT = Math.min(1, state.player.moveT + dt / state.player.moveDuration);
      if (state.player.moveT >= 1) {
        state.player.x = state.player.toX;
        state.player.y = state.player.toY;
        if (state.player.arrivalType === "gap") {
          triggerFall();
        } else if (state.player.arrivalType === "void") {
          triggerVoidFall();
        } else {
          if (!activeShadowTiles.has(tileKey(state.player.x, state.player.y)) && state.player.arrivalType === "shadow") {
            triggerFall();
            return;
          }

          if (state.player.arrivalType === "puddle") {
            var puddle = world.puddles.get(tileKey(state.player.x, state.player.y));
            if (puddle && !puddle.triggered) {
              puddle.triggered = true;
              triggerSlip();
              return;
            }
          }

          var iceTile = world.iceTiles.get(tileKey(state.player.x, state.player.y));
          if (iceTile && !iceTile.melted) {
            state.player.sliding = true;
            if (continueIceSlide()) {
              return;
            }
          } else {
            state.player.sliding = false;
          }

          checkLampUnlock();
          checkLightningZone();

          if (state.player.x === world.goal.x && state.player.y === world.goal.y && !state.victory) {
            state.victory = true;
            state.elapsed = state.lastTime - state.runStartedAt;
            setToast("Stage 2 完成。你已经学会在有限视野里继续用文字改写规则。");
            submitScore();
            updateObjective();
          }
        }
        refreshContextHint();
      }
    } else {
      var currentTile = walkResult(state.player.x, state.player.y);
      if (currentTile === "void") {
        triggerVoidFall();
      } else if (currentTile === "gap") {
        triggerFall();
      }
    }
  }

  function updateBeam(dt) {
    if (!state.beam) {
      return;
    }
    state.beam.ttl -= dt;
    if (state.beam.ttl <= 0) {
      state.beam = null;
    }
  }

  function getPlayerInterpolatedPosition() {
    if (state.player.moveT >= 1) {
      return { x: state.player.x, y: state.player.y };
    }
    var t = easeInOut(state.player.moveT);
    return {
      x: state.player.fromX + (state.player.toX - state.player.fromX) * t,
      y: state.player.fromY + (state.player.toY - state.player.fromY) * t
    };
  }

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function drawScene(time) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, width, height);
    updateCamera(width, height);

    drawBackground(width, height, time);
    drawWorldBase();
    drawFloorLayer();
    drawShadowTiles(time);
    drawObjects();
    drawWorldPrompt();
    drawFireBursts();
    drawBeam(time);
    drawLightningFlash();
  }

  function drawBackground(width, height, time) {
    var gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#060912");
    gradient.addColorStop(0.58, "#050811");
    gradient.addColorStop(1, "#02040a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "rgba(20, 28, 46, 0.6)";
    ctx.beginPath();
    ctx.ellipse(width * 0.35, height * 0.2, 260, 120, time * 0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(14, 20, 34, 0.56)";
    ctx.beginPath();
    ctx.ellipse(width * 0.74, height * 0.18, 240, 110, -time * 0.018, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(10, 14, 24, 0.54)";
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.78, 340, 160, time * 0.012, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawFloatingGlyphs(width, height, time) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    floatingGlyphs.forEach(function (glyph, index) {
      var sway = Math.sin(time * glyph.speed + index) * 14;
      ctx.font = "700 " + String(glyph.size) + "px Noto Serif SC, serif";
      ctx.fillStyle = glyph.tone;
      ctx.shadowBlur = 28;
      ctx.shadowColor = glyph.tone;
      ctx.fillText(glyph.text, width * glyph.x + sway, height * glyph.y + Math.cos(time * glyph.speed) * 8);
    });
    ctx.restore();
  }

  function drawMotes(width, height, time) {
    ctx.save();
    floatingMotes.forEach(function (mote, index) {
      var x = (mote.x * width + Math.sin(time * mote.speed + index) * 24);
      var y = (mote.y * height + Math.cos(time * mote.speed * 1.4 + index) * 20);
      ctx.fillStyle = "rgba(231, 247, 255, " + String(mote.alpha) + ")";
      ctx.beginPath();
      ctx.arc(x, y, mote.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawWorldBase() {
    ctx.save();
    ctx.globalAlpha = 0.26;
    [
      { x: 3.6, y: 12.1, rx: 240, ry: 92 },
      { x: 9.8, y: 7.2, rx: 250, ry: 96 },
      { x: 16.8, y: 4.3, rx: 210, ry: 84 }
    ].forEach(function (shadow) {
      var point = isoPoint(shadow.x, shadow.y, -8);
      ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
      ctx.beginPath();
      ctx.ellipse(point.x, point.y + 84, shadow.rx, shadow.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawFloorLayer() {
    var tiles = [];
    world.floors.forEach(function (cell) {
      tiles.push(cell);
    });
    world.gaps.forEach(function (gap) {
      if (!gap.restored) {
        tiles.push({ x: gap.x, y: gap.y, type: "gap", elevation: 0 });
      } else {
        tiles.push({ x: gap.x, y: gap.y, type: "memory", elevation: 0 });
      }
    });
    world.iceTiles.forEach(function (iceTile) {
      tiles.push({
        x: iceTile.x,
        y: iceTile.y,
        type: iceTile.melted ? "melted" : "ice",
        elevation: 0
      });
    });
    world.puddles.forEach(function (puddle) {
      tiles.push({
        x: puddle.x,
        y: puddle.y,
        type: "puddle",
        elevation: 0
      });
    });
    tiles.sort(function (a, b) {
      return (a.x + a.y) - (b.x + b.y);
    });
    tiles.forEach(function (cell) {
      var visibility = getTileVisibility(cell.x, cell.y);
      if (isTileHidden(visibility)) {
        return;
      }
      if (cell.type === "gap") {
        ctx.save();
        ctx.globalAlpha = visibility;
        drawGap(cell.x, cell.y);
        ctx.restore();
      } else {
        drawTilePrism(cell.x, cell.y, cell.type, FLOOR_DEPTH, cell.elevation || 0, visibility);
      }
    });
  }

  function getVisibleSurfaceMap() {
    var surfaces = new Map();

    world.floors.forEach(function (cell, key) {
      surfaces.set(key, {
        x: cell.x,
        y: cell.y,
        type: cell.type,
        elevation: cell.elevation || 0
      });
    });

    world.gaps.forEach(function (gap, key) {
      if (gap.restored) {
        surfaces.set(key, {
          x: gap.x,
          y: gap.y,
          type: "memory",
          elevation: 0
        });
      }
    });

    world.iceTiles.forEach(function (iceTile, key) {
      surfaces.set(key, {
        x: iceTile.x,
        y: iceTile.y,
        type: iceTile.melted ? "melted" : "ice",
        elevation: 0
      });
    });

    world.puddles.forEach(function (puddle, key) {
      surfaces.set(key, {
        x: puddle.x,
        y: puddle.y,
        type: "puddle",
        elevation: 0
      });
    });

    return surfaces;
  }

  function drawPathFillers() {
    var surfaces = getVisibleSurfaceMap();
    var directions = [
      { x: 1, y: -1 },
      { x: 1, y: 1 }
    ];

    surfaces.forEach(function (cell) {
      directions.forEach(function (dir) {
        var neighbor = surfaces.get(tileKey(cell.x + dir.x, cell.y + dir.y));
        if (!neighbor) {
          return;
        }
        drawPathConnector(cell, neighbor);
      });
    });

    surfaces.forEach(function (cell) {
      drawPathPad(cell);
    });
  }

  function drawPathConnector(a, b) {
    var pointA = isoPoint(a.x, a.y, Math.min(a.elevation || 0, b.elevation || 0));
    var pointB = isoPoint(b.x, b.y, Math.min(a.elevation || 0, b.elevation || 0));
    var palette = getConnectorPalette(a.type, b.type);
    var dx = pointB.x - pointA.x;
    var dy = pointB.y - pointA.y;
    var length = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / length;
    var uy = dy / length;
    var bridgeWidth = TILE_H * 1.02;
    var cap = bridgeWidth * 0.48;
    var startX = pointA.x - ux * cap;
    var startY = pointA.y - uy * cap;
    var endX = pointB.x + ux * cap;
    var endY = pointB.y + uy * cap;

    ctx.save();
    ctx.globalAlpha = 0.92;

    ctx.strokeStyle = palette.side;
    ctx.lineWidth = bridgeWidth + 8;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(startX, startY + FLOOR_DEPTH * 0.36);
    ctx.lineTo(endX, endY + FLOOR_DEPTH * 0.36);
    ctx.stroke();

    ctx.strokeStyle = palette.top;
    ctx.lineWidth = bridgeWidth;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.strokeStyle = palette.stroke;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(startX, startY - bridgeWidth * 0.5);
    ctx.lineTo(endX, endY - bridgeWidth * 0.5);
    ctx.moveTo(startX, startY + bridgeWidth * 0.5);
    ctx.lineTo(endX, endY + bridgeWidth * 0.5);
    ctx.stroke();

    ctx.fillStyle = palette.glow;
    ctx.beginPath();
    ctx.ellipse((startX + endX) * 0.5, (startY + endY) * 0.5 - 2, TILE_W * 0.12, TILE_H * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPathPad(cell) {
    if (cell.type === "altar") {
      return;
    }

    var point = isoPoint(cell.x, cell.y, cell.elevation || 0);
    var palette = getConnectorPalette(cell.type, cell.type);
    var size = TILE_H * 0.96;

    ctx.save();
    ctx.globalAlpha = 0.96;

    ctx.fillStyle = palette.side;
    ctx.fillRect(point.x - size * 0.5 - 4, point.y - size * 0.5 - 4, size + 8, size + 8);

    ctx.fillStyle = palette.top;
    ctx.fillRect(point.x - size * 0.5, point.y - size * 0.5, size, size);

    ctx.strokeStyle = palette.stroke;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(point.x - size * 0.5, point.y - size * 0.5, size, size);

    ctx.fillStyle = palette.glow;
    ctx.beginPath();
    ctx.fillRect(point.x - size * 0.16, point.y - size * 0.16, size * 0.32, size * 0.32);
    ctx.restore();
  }

  function drawShadowTiles(time) {
    activeShadowTiles.forEach(function (key) {
      var parts = key.split(",");
      var x = Number(parts[0]);
      var y = Number(parts[1]);
      var visibility = getTileVisibility(x, y);
      if (isTileHidden(visibility)) {
        return;
      }
      var pulse = 0.76 + Math.sin(time * 6 + x + y) * 0.12;
      drawTilePrism(x, y, "shadow", 10, 0, pulse * visibility);
    });
  }

  function getConnectorPalette(typeA, typeB) {
    if (typeA === "shadow" || typeB === "shadow") {
      return {
        top: "rgba(112, 131, 181, 0.72)",
        side: "rgba(46, 60, 95, 0.72)",
        stroke: "rgba(213, 225, 255, 0.18)",
        glow: "rgba(197, 216, 255, 0.12)"
      };
    }
    if (typeA === "ice" || typeB === "ice") {
      return {
        top: "rgba(158, 226, 255, 0.9)",
        side: "rgba(76, 124, 148, 0.84)",
        stroke: "rgba(244, 252, 255, 0.22)",
        glow: "rgba(240, 251, 255, 0.22)"
      };
    }
    if (typeA === "puddle" || typeB === "puddle") {
      return {
        top: "rgba(95, 145, 188, 0.84)",
        side: "rgba(36, 66, 95, 0.78)",
        stroke: "rgba(214, 236, 255, 0.16)",
        glow: "rgba(184, 220, 255, 0.08)"
      };
    }
    if (typeA === "melted" || typeB === "melted" || typeA === "wood" || typeB === "wood") {
      return {
        top: "rgba(141, 109, 71, 0.88)",
        side: "rgba(83, 61, 39, 0.82)",
        stroke: "rgba(255, 235, 198, 0.14)",
        glow: "rgba(255, 221, 173, 0.1)"
      };
    }
    return {
      top: "rgba(103, 176, 122, 0.84)",
      side: "rgba(54, 90, 66, 0.78)",
      stroke: "rgba(223, 255, 229, 0.14)",
      glow: "rgba(207, 247, 211, 0.1)"
    };
  }

  function getWorldPrompt() {
    if (state.player.falling || state.victory) {
      return null;
    }

    var lamp = chooseNearbyTarget(world.lamps, 1, function (candidate) {
      return !candidate.found;
    });
    if (lamp) {
      return { x: lamp.x, y: lamp.y, text: "靠近暖灯" };
    }

    if (state.lightUnlocked && !state.lightUsed) {
      return { x: state.player.x, y: state.player.y, text: "G  光照全图" };
    }

    var lowWall = chooseNearbyTarget(world.lowWalls, 1, function (candidate) {
      return !candidate.broken;
    });
    if (lowWall) {
      return { x: lowWall.x, y: lowWall.y, text: "1  碎破墙" };
    }

    var gap = chooseNearbyTarget(world.gaps, 1, function (candidate) {
      return candidate.recoverable && !candidate.restored;
    });
    if (gap) {
      return { x: gap.x, y: gap.y, text: "2  忆补路" };
    }

    var iceTile = chooseNearbyTarget(world.iceTiles, 1, function (candidate) {
      return !candidate.melted;
    });
    if (iceTile) {
      return {
        x: iceTile.x,
        y: iceTile.y,
        text: state.iceLessonLearned ? "3  火融冰" : "冰面会冲刺"
      };
    }

    var tallWall = chooseNearbyTarget(world.tallWalls, 1, function (candidate) {
      return Boolean(candidate.shadow);
    });
    if (tallWall) {
      return { x: tallWall.x, y: tallWall.y, text: "F  手电成桥" };
    }

    return null;
  }

  function drawWorldPrompt() {
    var prompt = getWorldPrompt();
    if (!prompt) {
      return;
    }

    var point = isoPoint(prompt.x, prompt.y, 96);
    ctx.save();
    ctx.font = "700 13px Inter, Segoe UI, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var width = Math.max(96, ctx.measureText(prompt.text).width + 24);
    var height = 30;
    var left = point.x - width * 0.5;
    var top = point.y - height * 0.5;

    ctx.fillStyle = "rgba(14, 19, 32, 0.9)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1;
    ctx.fillRect(left, top, width, height);
    ctx.strokeRect(left, top, width, height);

    ctx.fillStyle = "rgba(244, 247, 255, 0.96)";
    ctx.fillText(prompt.text, point.x, point.y + 1);
    ctx.restore();
  }

  function drawFireBursts() {
    fireBursts.forEach(function (burst) {
      var point = isoPoint(burst.x + burst.vx * 0.35, burst.y + burst.vy * -0.15, 38 + (1 - burst.ttl) * 18);
      var alpha = Math.max(0, Math.min(1, burst.ttl / 0.6));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(255, 175, 71, 0.85)";
      ctx.beginPath();
      ctx.arc(point.x, point.y, burst.size * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 236, 169, 0.76)";
      ctx.beginPath();
      ctx.arc(point.x, point.y - 2, burst.size * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawObjects() {
    var renderables = [];
    world.lamps.forEach(function (lamp) {
      renderables.push({ type: "lamp", sort: lamp.x + lamp.y + 0.62, data: lamp });
    });
    world.lowWalls.forEach(function (wall) {
      if (!wall.broken) {
        renderables.push({ type: "lowWall", sort: wall.x + wall.y + 0.68, data: wall });
      }
    });
    world.tallWalls.forEach(function (wall) {
      renderables.push({ type: "tallWall", sort: wall.x + wall.y + 0.88, data: wall });
    });
    renderables.push({ type: "goal", sort: world.goal.x + world.goal.y + 0.52, data: world.goal });
    renderables.push({ type: "player", sort: getPlayerInterpolatedPosition().x + getPlayerInterpolatedPosition().y + 0.76, data: null });
    renderables.sort(function (a, b) {
      return a.sort - b.sort;
    });

    renderables.forEach(function (item) {
      if (item.type === "lamp") {
        var lampVisibility = getTileVisibility(item.data.x, item.data.y);
        if (!isTileHidden(lampVisibility)) {
          ctx.save();
          ctx.globalAlpha = lampVisibility;
          drawLamp(item.data);
          ctx.restore();
        }
      } else if (item.type === "lowWall") {
        var lowVisibility = getTileVisibility(item.data.x, item.data.y);
        if (!isTileHidden(lowVisibility)) {
          ctx.save();
          ctx.globalAlpha = lowVisibility;
          drawWall(item.data.x, item.data.y, LOW_WALL_H, 0.82, "low");
          ctx.restore();
        }
      } else if (item.type === "tallWall") {
        var tallVisibility = getTileVisibility(item.data.x, item.data.y);
        if (!isTileHidden(tallVisibility)) {
          ctx.save();
          ctx.globalAlpha = tallVisibility;
          drawTallWall(item.data);
          ctx.restore();
        }
      } else if (item.type === "goal") {
        var goalVisibility = getTileVisibility(world.goal.x, world.goal.y);
        if (!isTileHidden(goalVisibility)) {
          ctx.save();
          ctx.globalAlpha = goalVisibility;
          drawGoal(world.goal.x, world.goal.y);
          ctx.restore();
        }
      } else if (item.type === "player") {
        drawPlayer();
      }
    });
  }

  function drawTilePrism(x, y, type, depth, elevation, alpha) {
    var point = isoPoint(x, y, elevation || 0);
    var top = { x: point.x, y: point.y - TILE_H * 0.5 };
    var right = { x: point.x + TILE_W * 0.5, y: point.y };
    var bottom = { x: point.x, y: point.y + TILE_H * 0.5 };
    var left = { x: point.x - TILE_W * 0.5, y: point.y };
    var rightDown = { x: right.x, y: right.y + depth };
    var leftDown = { x: left.x, y: left.y + depth };
    var bottomDown = { x: bottom.x, y: bottom.y + depth };
    var palette = getTilePalette(type);

    ctx.save();
    ctx.globalAlpha = alpha || 1;

    ctx.fillStyle = palette.left;
    polygon([left, bottom, bottomDown, leftDown]);
    ctx.fill();

    ctx.fillStyle = palette.right;
    polygon([right, bottom, bottomDown, rightDown]);
    ctx.fill();

    ctx.fillStyle = palette.top;
    polygon([top, right, bottom, left]);
    ctx.fill();

    ctx.strokeStyle = palette.stroke;
    ctx.lineWidth = 1.2;
    polygon([top, right, bottom, left], true);
    ctx.stroke();

    if (type === "moss" || type === "memory" || type === "altar" || type === "ice" || type === "melted" || type === "puddle") {
      if (type === "altar") {
        ctx.fillStyle = "rgba(244, 232, 178, 0.28)";
      } else if (type === "ice") {
        ctx.fillStyle = "rgba(239, 252, 255, 0.34)";
      } else if (type === "melted") {
        ctx.fillStyle = "rgba(255, 183, 122, 0.2)";
      } else if (type === "puddle") {
        ctx.fillStyle = "rgba(214, 235, 255, 0.18)";
      } else if (type === "memory") {
        ctx.fillStyle = "rgba(255, 226, 241, 0.34)";
      } else {
        ctx.fillStyle = "rgba(214, 255, 221, 0.18)";
      }
      ctx.beginPath();
      ctx.ellipse(point.x, point.y - 5, TILE_W * 0.16, TILE_H * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (type === "shadow") {
      ctx.strokeStyle = "rgba(208, 221, 255, 0.36)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 6]);
      polygon([top, right, bottom, left], true);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  function getTilePalette(type) {
    if (type === "wood") {
      return {
        top: "#53637a",
        left: "#273244",
        right: "#344257",
        stroke: "rgba(233, 240, 255, 0.14)"
      };
    }
    if (type === "memory") {
      return {
        top: "#b9a7ff",
        left: "#55498b",
        right: "#6b5aa9",
        stroke: "rgba(233, 226, 255, 0.3)"
      };
    }
    if (type === "ice") {
      return {
        top: "#b7e6ff",
        left: "#4f7992",
        right: "#6794af",
        stroke: "rgba(241, 252, 255, 0.4)"
      };
    }
    if (type === "puddle") {
      return {
        top: "#5f86a6",
        left: "#274866",
        right: "#38617f",
        stroke: "rgba(228, 240, 255, 0.2)"
      };
    }
    if (type === "melted") {
      return {
        top: "#5e6978",
        left: "#2c3644",
        right: "#3b4757",
        stroke: "rgba(222, 229, 244, 0.14)"
      };
    }
    if (type === "shadow") {
      return {
        top: "rgba(118, 136, 184, 0.62)",
        left: "rgba(42, 52, 83, 0.54)",
        right: "rgba(61, 72, 109, 0.58)",
        stroke: "rgba(221, 232, 255, 0.2)"
      };
    }
    if (type === "altar") {
      return {
        top: "#d5cfb1",
        left: "#665f46",
        right: "#7a7154",
        stroke: "rgba(255, 248, 222, 0.22)"
      };
    }
    return {
      top: "#47576e",
      left: "#243040",
      right: "#313f52",
      stroke: "rgba(225, 236, 255, 0.12)"
    };
  }

  function drawGap(x, y) {
    var point = isoPoint(x, y, -4);
    var top = { x: point.x, y: point.y - TILE_H * 0.48 };
    var right = { x: point.x + TILE_W * 0.48, y: point.y };
    var bottom = { x: point.x, y: point.y + TILE_H * 0.48 };
    var left = { x: point.x - TILE_W * 0.48, y: point.y };
    ctx.save();
    ctx.fillStyle = "rgba(1, 3, 8, 0.96)";
    polygon([top, right, bottom, left]);
    ctx.fill();
    ctx.strokeStyle = "rgba(132, 157, 216, 0.16)";
    ctx.lineWidth = 1;
    polygon([top, right, bottom, left], true);
    ctx.stroke();
    ctx.fillStyle = "rgba(140, 164, 255, 0.12)";
    ctx.beginPath();
    ctx.ellipse(point.x, point.y + 4, TILE_W * 0.18, TILE_H * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawWall(x, y, height, scale, kind) {
    var point = isoPoint(x, y, height);
    var top = diamond(point.x, point.y, TILE_W * scale, TILE_H * scale);
    var base = diamond(point.x, point.y + height, TILE_W * scale, TILE_H * scale);
    var palette = kind === "low"
      ? { top: "#9a835f", left: "#5f4933", right: "#70553b", stroke: "rgba(255, 245, 221, 0.16)" }
      : { top: "#8591a6", left: "#3f495d", right: "#505d73", stroke: "rgba(227, 236, 255, 0.16)" };

    ctx.save();
    ctx.fillStyle = palette.left;
    polygon([top.left, top.bottom, base.bottom, base.left]);
    ctx.fill();
    ctx.fillStyle = palette.right;
    polygon([top.right, top.bottom, base.bottom, base.right]);
    ctx.fill();
    ctx.fillStyle = palette.top;
    polygon([top.top, top.right, top.bottom, top.left]);
    ctx.fill();
    ctx.strokeStyle = palette.stroke;
    ctx.lineWidth = 1.2;
    polygon([top.top, top.right, top.bottom, top.left], true);
    ctx.stroke();
    ctx.restore();
  }

  function drawTallWall(wall) {
    var alpha = 1;
    if (!state.player.falling && state.player.x <= wall.x && state.player.y <= wall.y) {
      alpha = 0.82;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    drawWall(wall.x, wall.y, TALL_WALL_H, 0.92, "tall");
    if (wall.shadow && wall.shadowUntil > state.lastTime) {
      var point = isoPoint(wall.x, wall.y, TALL_WALL_H + 10);
      ctx.fillStyle = "rgba(255, 245, 198, 0.16)";
      ctx.beginPath();
      ctx.arc(point.x, point.y - 8, 12, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawGoal(x, y) {
    var point = isoPoint(x, y, 28);
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(207, 247, 211, 0.4)";
    ctx.fillStyle = "#d7f7b8";
    ctx.beginPath();
    ctx.moveTo(point.x, point.y - 20);
    ctx.lineTo(point.x + 12, point.y + 8);
    ctx.lineTo(point.x, point.y + 18);
    ctx.lineTo(point.x - 12, point.y + 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawLamp(lamp) {
    var point = isoPoint(lamp.x, lamp.y, 44);
    ctx.save();
    ctx.shadowBlur = 26;
    ctx.shadowColor = "rgba(255, 209, 122, 0.5)";
    ctx.fillStyle = "rgba(255, 220, 158, 0.96)";
    ctx.beginPath();
    ctx.arc(point.x, point.y - 4, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 196, 118, 0.22)";
    ctx.beginPath();
    ctx.ellipse(point.x, point.y + 10, 28, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPlayer() {
    var pos = getPlayerInterpolatedPosition();
    var point = isoPoint(pos.x, pos.y, 26);
    var fallScale = state.player.falling ? Math.max(0.3, 1 - state.player.fallT * 1.2) : 1;
    var fallAlpha = state.player.falling ? Math.max(0.18, 1 - state.player.fallT * 1.4) : 1;

    ctx.save();
    ctx.globalAlpha = 0.34 * fallAlpha;
    ctx.fillStyle = "rgba(0, 0, 0, 0.36)";
    ctx.beginPath();
    ctx.ellipse(point.x, point.y + 28, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(point.x, point.y + Math.sin(state.lastTime * 9) * 1.8);
    ctx.scale(fallScale, fallScale);

    ctx.fillStyle = "rgba(123, 174, 255, 0.22)";
    ctx.beginPath();
    ctx.ellipse(-16, 8, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(214, 240, 255, 0.28)";
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();

    var orbGradient = ctx.createRadialGradient(-6, -8, 2, 0, 0, 24);
    orbGradient.addColorStop(0, "rgba(255,255,255,0.98)");
    orbGradient.addColorStop(0.38, "rgba(214,240,255,0.92)");
    orbGradient.addColorStop(0.7, "rgba(122,166,255,0.84)");
    orbGradient.addColorStop(1, "rgba(128,98,255,0.68)");
    ctx.fillStyle = orbGradient;
    ctx.globalAlpha = fallAlpha;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.arc(-6, -7, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawBeam(time) {
    if (!state.beam) {
      return;
    }

    var start = isoPoint(state.beam.fromX, state.beam.fromY, 24);
    var end = isoPoint(state.beam.toX, state.beam.toY, 30);
    var alpha = Math.max(0, state.beam.ttl / 0.26);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = state.beam.hit ? "rgba(244, 232, 178, 0.72)" : "rgba(255,255,255,0.34)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawLightningFlash() {
    if (state.lightningBlindUntil <= state.lastTime) {
      return;
    }
    var remaining = state.lightningBlindUntil - state.lastTime;
    var alpha = Math.max(0.16, Math.min(0.92, remaining / 1));
    ctx.save();
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = "rgba(255, 255, 255, " + String(alpha) + ")";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();
  }

  function getDirVector(facing) {
    if (facing === "up") {
      return { x: -1, y: -1 };
    }
    if (facing === "down") {
      return { x: 1, y: 1 };
    }
    if (facing === "left") {
      return { x: -1, y: 1 };
    }
    return { x: 1, y: -1 };
  }

  function diamond(x, y, width, height) {
    return {
      top: { x: x, y: y - height * 0.5 },
      right: { x: x + width * 0.5, y: y },
      bottom: { x: x, y: y + height * 0.5 },
      left: { x: x - width * 0.5, y: y }
    };
  }

  function polygon(points, onlyPath) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    if (!onlyPath) {
      return;
    }
  }

  function update(dt, now) {
    state.lastTime = now;
    if (state.started) {
      if (!state.runStartedAt) {
        state.runStartedAt = now;
      }
      if (!state.victory) {
        state.elapsed = now - state.runStartedAt;
      }
    }
    if (state.started) {
      updateMemoryTiles(now);
      updateShadowTiles(now);
      updatePlayer(dt);
      updateBeam(dt);
    }
    updateFireBursts(dt);
    updateTimerDisplay();

    if (state.started && !state.player.falling && !state.victory && state.lastTime >= state.alertHintUntil && activeShadowTiles.size === 0 && isShadowPuzzleBlocked()) {
      refreshContextHint();
    }

    updateObjective();
  }

  function isShadowPuzzleBlocked() {
    return countMeltedIceGroups() > 0 && state.shadowTriggered < 1;
  }

  function loop(nowMs) {
    if (!state.lastTime) {
      state.lastTime = nowMs / 1000;
    }
    var now = nowMs / 1000;
    var dt = Math.min(0.033, now - state.lastTime);
    update(dt, now);
    drawScene(now);
    window.requestAnimationFrame(loop);
  }

  function handleKeydown(event) {
    if (!state.started) {
      var isTypingName = document.activeElement === startNameInput;
      if (startModal.classList.contains("is-visible") && event.key === "Enter") {
        if (state.intro.step === INTRO_STEPS.length - 1) {
          beginStage();
        } else {
          advanceIntroStep();
        }
        event.preventDefault();
      } else if (startModal.classList.contains("is-visible") && event.key === " " && !isTypingName) {
        advanceIntroStep();
        event.preventDefault();
      }
      return;
    }
    if (event.repeat) {
      return;
    }
    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      tryMove(-1, -1);
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
      tryMove(1, 1);
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      tryMove(-1, 1);
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      tryMove(1, -1);
      event.preventDefault();
      return;
    }
    if (event.key === "1") {
      castShatter();
      event.preventDefault();
      return;
    }
    if (event.key === "2") {
      castMemory();
      event.preventDefault();
      return;
    }
    if (event.key === "3") {
      castFire();
      event.preventDefault();
      return;
    }
    if (event.key === "g" || event.key === "G") {
      castLight();
      event.preventDefault();
      return;
    }
    if (event.key === "f" || event.key === "F") {
      castFlashlight();
      event.preventDefault();
      return;
    }
  }

  shatterChip.addEventListener("click", castShatter);
  memoryChip.addEventListener("click", castMemory);
  fireChip.addEventListener("click", castFire);
  lightChip.addEventListener("click", castLight);
  flashChip.addEventListener("click", castFlashlight);
  introActionButton.addEventListener("click", advanceIntroStep);
  introContinueButton.addEventListener("click", advanceIntroStep);
  introFinishButton.addEventListener("click", advanceIntroStep);
  introSkipButton.addEventListener("click", skipIntro);
  startGameButton.addEventListener("click", beginStage);
  resetHonorButton.addEventListener("click", resetLeaderboard);
  nextStageButton.addEventListener("click", goNextStage);
  homeButton.addEventListener("click", goHome);
  canvas.addEventListener("pointerdown", function () {
    canvas.focus();
  });
  syncPlayerName(window.localStorage.getItem(PLAYER_NAME_KEY) || "");
  playerNameInput.readOnly = true;
  startNameInput.addEventListener("input", function () {
    if (startError.textContent) {
      startError.textContent = "";
    }
  });
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("keydown", handleKeydown);

  resizeCanvas();
  renderIntroStep();
  introActionButton.focus();
  refreshHonorBoard();
  updateTimerDisplay();
  refreshContextHint();
  updateObjective();
  window.requestAnimationFrame(loop);
})();
