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
  var freezeChip = document.getElementById("freezeChip");
  var flashChip = document.getElementById("flashChip");
  var pierceChip = document.getElementById("pierceChip");

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
  var activeShadowTiles = new Map();
  var activeRevealTiles = new Map();
  var fireBursts = [];
  var toastTimer = 0;
  var LEADERBOARD_KEY = "yanling-stage2-honor-board";
  var PLAYER_NAME_KEY = "yanling-stage2-player-name";
  var HOME_FOCUS_STAGE_KEY = "yanling-home-focus-stage";
  var enteredFromHome = window.sessionStorage.getItem("yanling-stage-entry") === "home-stage-2";

  var state = {
    lastTime: 0,
    beam: null,
    started: false,
    victory: false,
    scoreSubmitted: false,
    shadowTriggered: 0,
    revealTriggered: 0,
    iceLessonLearned: true,
    alertHintUntil: 0,
    runStartedAt: 0,
    elapsed: 0,
    playerName: "",
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
      fromZ: 0,
      toZ: 0,
      sliding: false,
      falling: false,
      fallT: 0,
      fallReason: "gap"
    }
  };

  function createWorld() {
    var LAYER_TOP = 132;
    var LAYER_MID = 76;
    var LAYER_LOW = 20;
    var floors = new Map();
    var gaps = new Map();
    var lowWalls = new Map();
    var tallWalls = new Map();
    var iceTiles = new Map();
    var waterTiles = new Map();

    addTiles(floors, [
      [2, 22, "moss", LAYER_TOP],
      [3, 21, "glass", LAYER_TOP],
      [4, 20, "glass", LAYER_TOP],
      [5, 19, "glass", LAYER_TOP],
      [6, 18, "glass", LAYER_TOP],
      [7, 17, "glass", LAYER_TOP],
      [9, 15, "glass", LAYER_TOP],
      [10, 14, "glass", LAYER_TOP],
      [11, 13, "glass", LAYER_TOP],
      [12, 12, "glass", LAYER_TOP],
      [13, 11, "glass", LAYER_TOP],
      [14, 10, "glass", LAYER_TOP],
      [15, 9, "glass", LAYER_TOP],
      [4, 22, "glass", LAYER_TOP],
      [5, 21, "glass", LAYER_TOP],
      [6, 20, "glass", LAYER_TOP],
      [7, 19, "glass", LAYER_TOP],
      [8, 18, "glass", LAYER_TOP],
      [9, 17, "glass", LAYER_TOP],
      [10, 16, "glass", LAYER_TOP],
      [11, 15, "glass", LAYER_TOP],
      [12, 14, "glass", LAYER_TOP],
      [20, 9, "moss", LAYER_MID],
      [21, 8, "glass", LAYER_MID],
      [22, 7, "glass", LAYER_MID],
      [24, 5, "glass", LAYER_MID],
      [25, 4, "glass", LAYER_MID],
      [26, 3, "glass", LAYER_MID],
      [22, 9, "glass", LAYER_MID],
      [23, 8, "glass", LAYER_MID],
      [24, 7, "glass", LAYER_MID],
      [25, 6, "glass", LAYER_MID],
      [26, 5, "glass", LAYER_MID],
      [24, 16, "moss", LAYER_LOW],
      [25, 15, "glass", LAYER_LOW],
      [26, 14, "glass", LAYER_LOW],
      [27, 13, "glass", LAYER_LOW],
      [28, 12, "glass", LAYER_LOW],
      [30, 10, "glass", LAYER_LOW],
      [31, 9, "glass", LAYER_LOW],
      [24, 18, "glass", LAYER_LOW],
      [25, 17, "glass", LAYER_LOW],
      [26, 16, "glass", LAYER_LOW],
      [27, 15, "glass", LAYER_LOW],
      [28, 14, "glass", LAYER_LOW],
      [34, 6, "altar", LAYER_LOW]
    ]);

    addGap(gaps, 8, 16, true, LAYER_TOP);
    addGap(gaps, 23, 6, true, LAYER_MID);
    addGap(gaps, 29, 11, true, LAYER_LOW);

    addLowWall(lowWalls, 6, 18, "lw-top", LAYER_TOP);
    addLowWall(lowWalls, 25, 4, "lw-mid", LAYER_MID);
    addLowWall(lowWalls, 30, 10, "lw-low", LAYER_LOW);

    addIceTile(iceTiles, 10, 14, "ice-top-main", LAYER_TOP);
    addIceTile(iceTiles, 11, 13, "ice-top-main", LAYER_TOP);
    addIceTile(iceTiles, 10, 16, "ice-top-side", LAYER_TOP);
    addIceTile(iceTiles, 11, 15, "ice-top-side", LAYER_TOP);
    addIceTile(iceTiles, 24, 7, "ice-mid-side", LAYER_MID);
    addIceTile(iceTiles, 25, 6, "ice-mid-side", LAYER_MID);
    addIceTile(iceTiles, 25, 15, "ice-low-main", LAYER_LOW);
    addIceTile(iceTiles, 26, 14, "ice-low-main", LAYER_LOW);

    addWaterTile(waterTiles, 7, 19, "water-top-side", LAYER_TOP);
    addWaterTile(waterTiles, 8, 18, "water-top-side", LAYER_TOP);
    addWaterTile(waterTiles, 13, 11, "water-top-main", LAYER_TOP);
    addWaterTile(waterTiles, 14, 10, "water-top-main", LAYER_TOP);
    addWaterTile(waterTiles, 22, 9, "water-mid-side", LAYER_MID);
    addWaterTile(waterTiles, 23, 8, "water-mid-side", LAYER_MID);
    addWaterTile(waterTiles, 27, 13, "water-low-main", LAYER_LOW);
    addWaterTile(waterTiles, 28, 12, "water-low-main", LAYER_LOW);
    addWaterTile(waterTiles, 27, 15, "water-low-side", LAYER_LOW);
    addWaterTile(waterTiles, 28, 14, "water-low-side", LAYER_LOW);

    addTallWall(tallWalls, 16, 10, "tw-drop-top", {
      shadowTiles: [
        { x: 16, y: 8, elevation: LAYER_TOP },
        { x: 17, y: 7, elevation: LAYER_TOP },
        { x: 18, y: 6, elevation: LAYER_TOP, descentTo: { x: 20, y: 9, elevation: LAYER_MID, label: "第二层" } }
      ],
      duration: 4
    }, null, LAYER_TOP);
    addTallWall(tallWalls, 27, 4, "tw-drop-mid", {
      shadowTiles: [
        { x: 27, y: 2, elevation: LAYER_MID },
        { x: 28, y: 1, elevation: LAYER_MID, descentTo: { x: 24, y: 16, elevation: LAYER_LOW, label: "第三层" } }
      ],
      duration: 4
    }, null, LAYER_MID);
    addTallWall(tallWalls, 32, 10, "tw-reveal-low", null, {
      revealTiles: [
        { x: 32, y: 8, elevation: LAYER_LOW },
        { x: 33, y: 7, elevation: LAYER_LOW }
      ],
      duration: 4
    }, LAYER_LOW);

    return {
      width: 36,
      height: 26,
      floors: floors,
      gaps: gaps,
      lowWalls: lowWalls,
      tallWalls: tallWalls,
      iceTiles: iceTiles,
      waterTiles: waterTiles,
      iceGroupCount: 4,
      waterGroupCount: 5,
      shadowCount: 2,
      revealCount: 1,
      layers: {
        top: LAYER_TOP,
        middle: LAYER_MID,
        low: LAYER_LOW
      },
      start: { x: 2, y: 22 },
      goal: { x: 34, y: 6 }
    };
  }

  function addTiles(store, entries) {
    entries.forEach(function (entry) {
      store.set(tileKey(entry[0], entry[1]), {
        x: entry[0],
        y: entry[1],
        type: entry[2],
        elevation: typeof entry[3] === "number" ? entry[3] : (entry[2] === "altar" ? 10 : 0)
      });
    });
  }

  function addGap(store, x, y, recoverable, elevation) {
    store.set(tileKey(x, y), {
      x: x,
      y: y,
      recoverable: recoverable,
      restored: false,
      restoreUntil: 0,
      elevation: elevation || 0
    });
  }

  function addLowWall(store, x, y, id, elevation) {
    store.set(tileKey(x, y), {
      id: id,
      x: x,
      y: y,
      broken: false,
      elevation: elevation || 0
    });
  }

  function addTallWall(store, x, y, id, shadow, reveal, elevation) {
    store.set(tileKey(x, y), {
      id: id,
      x: x,
      y: y,
      shadow: shadow,
      shadowUntil: 0,
      shadowUsed: false,
      reveal: reveal || null,
      revealUntil: 0,
      revealUsed: false,
      elevation: elevation || 0
    });
  }

  function addIceTile(store, x, y, group, elevation) {
    store.set(tileKey(x, y), {
      x: x,
      y: y,
      group: group,
      melted: false,
      elevation: elevation || 0
    });
  }

  function addWaterTile(store, x, y, group, elevation) {
    store.set(tileKey(x, y), {
      x: x,
      y: y,
      group: group,
      frozen: false,
      elevation: elevation || 0
    });
  }

  function createGlyphs() {
    return [
      { text: "影", x: 0.14, y: 0.2, tone: "rgba(177, 208, 255, 0.22)", size: 88, speed: 0.24 },
      { text: "透", x: 0.82, y: 0.22, tone: "rgba(187, 245, 198, 0.18)", size: 74, speed: 0.18 },
      { text: "冰", x: 0.72, y: 0.74, tone: "rgba(152, 228, 255, 0.16)", size: 86, speed: 0.22 },
      { text: "明", x: 0.18, y: 0.78, tone: "rgba(244, 232, 178, 0.16)", size: 68, speed: 0.2 }
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
    window.sessionStorage.setItem(HOME_FOCUS_STAGE_KEY, "2");
    window.location.href = "./index.html";
  }

  function beginStage() {
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
      setToast("你已从首页进入 Stage 2。输入名字后的计时已经开始，这张三层回廊里会连续遇到深蓝水面、浅蓝冰面、下照影路和透壁通路。");
      window.sessionStorage.removeItem("yanling-stage-entry");
      enteredFromHome = false;
    } else {
      setToast("试炼开始。方向键/WASD 按屏幕方向移动；按 1【碎】、2【忆】、3【火】、4【冰】、F【影】、E【透】。");
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
    originY = targetY - (focus.x + focus.y) * TILE_H * 0.5 + 26 + (focus.z || 0);
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
      objectiveText.textContent = "先输入名字并点击开始，进入第二关的失重回廊。";
      progressList.innerHTML = [
        "<li>矮墙已击碎：0 / " + world.lowWalls.size + "</li>",
        "<li>透明地面已恢复：0 / " + countRecoverableGaps() + "</li>",
        "<li>冰面已烧掉：0 / " + world.iceGroupCount + "</li>",
        "<li>水面已冻结：0 / " + world.waterGroupCount + "</li>",
        "<li>阴影路径已触发：0 / 1</li>",
        "<li>透壁路径已显现：0 / 1</li>"
      ].join("");
      return;
    }

    var broken = countBrokenWalls();
    var restored = countRestoredGaps();
    var melted = countMeltedIceGroups();
    var frozen = countFrozenWaterGroups();
    var shadowSolved = countActivatedShadowWalls();
    var revealSolved = countActivatedRevealWalls();

    if (!world.lowWalls.get(tileKey(6, 18)).broken) {
      objectiveText.textContent = "光段A。先在顶层入口击碎矮墙，打开第一条上层主路。";
    } else if (!world.gaps.get(tileKey(8, 16)).restored) {
      objectiveText.textContent = "影段B。前方是影之缺口，靠近后按 2【忆】补路，4 秒内通过。";
    } else if (!world.iceTiles.get(tileKey(10, 14)).melted) {
      objectiveText.textContent = "光段B。前方浅蓝冰面会把你甩出去，先用 3【火】烧掉主路冰面。";
    } else if (!world.waterTiles.get(tileKey(13, 11)).frozen) {
      objectiveText.textContent = "顶层回廊的水面增多了。先冻住深蓝水面，再前往第一处下照机关。";
    } else if (shadowSolved < 1) {
      objectiveText.textContent = "顶层尽头高墙会把光往下切开。靠近后按 F【影】，显出下跳路线进入第二层。";
    } else if (!world.gaps.get(tileKey(23, 6)).restored) {
      objectiveText.textContent = "第二层进入影段B。先用【忆】恢复缺口，再往前推进。";
    } else if (!world.lowWalls.get(tileKey(25, 4)).broken) {
      objectiveText.textContent = "第二层光段C被矮墙截断。按 1【碎】破墙，继续找第二次落层机会。";
    } else if (shadowSolved < 2) {
      objectiveText.textContent = "第二层尽头还有一次下照落层。靠近高墙按 F【影】，跳入第三层。";
    } else if (!world.iceTiles.get(tileKey(25, 15)).melted) {
      objectiveText.textContent = "第三层开始就是高密度浅蓝冰面，先用 3【火】清出稳定主路。";
    } else if (!world.waterTiles.get(tileKey(27, 13)).frozen) {
      objectiveText.textContent = "第三层主路被深蓝水面截断。先用 4【冰】冻结后再向前推进。";
    } else if (!world.gaps.get(tileKey(29, 11)).restored) {
      objectiveText.textContent = "光段D。终点前还有最后一处缺口，需要再用一次【忆】。";
    } else if (!world.lowWalls.get(tileKey(30, 10)).broken) {
      objectiveText.textContent = "影段D 的矮墙挡住了最终平台前的主路，再用一次【碎】。";
    } else if (revealSolved < 1) {
      objectiveText.textContent = "最后一面高墙后藏着终点路。靠近后按 E【透】，照出 4 秒通路。";
    } else if (!state.victory) {
      objectiveText.textContent = "最终平台已经稳定，走上中央「明」字完成第二关。";
    } else {
      objectiveText.textContent = "Stage 2 完成。你已经掌握了光影、水面与临时通路的规则。";
    }

    progressList.innerHTML = [
      "<li>矮墙已击碎：" + broken + " / " + world.lowWalls.size + "</li>",
      "<li>透明地面已恢复：" + restored + " / " + countRecoverableGaps() + "</li>",
      "<li>冰面已烧掉：" + melted + " / " + world.iceGroupCount + "</li>",
      "<li>水面已冻结：" + frozen + " / " + world.waterGroupCount + "</li>",
      "<li>下照路线已触发：" + shadowSolved + " / " + world.shadowCount + "</li>",
      "<li>透壁路径已显现：" + revealSolved + " / " + world.revealCount + "</li>"
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

  function countMeltedIceGroups() {
    var groups = new Set();
    world.iceTiles.forEach(function (tile) {
      if (tile.melted) {
        groups.add(tile.group);
      }
    });
    return groups.size;
  }

  function countFrozenWaterGroups() {
    var groups = new Set();
    world.waterTiles.forEach(function (tile) {
      if (tile.frozen) {
        groups.add(tile.group);
      }
    });
    return groups.size;
  }

  function countActivatedShadowWalls() {
    var count = 0;
    world.tallWalls.forEach(function (wall) {
      if (wall.shadow && wall.shadowUsed) {
        count += 1;
      }
    });
    return count;
  }

  function countActivatedRevealWalls() {
    var count = 0;
    world.tallWalls.forEach(function (wall) {
      if (wall.reveal && wall.revealUsed) {
        count += 1;
      }
    });
    return count;
  }

  function getTileElevationAt(x, y) {
    var key = tileKey(x, y);
    var floor = world.floors.get(key);
    if (floor) {
      return floor.elevation || 0;
    }
    var gap = world.gaps.get(key);
    if (gap && gap.restored) {
      return gap.elevation || 0;
    }
    var iceTile = world.iceTiles.get(key);
    if (iceTile) {
      return iceTile.elevation || 0;
    }
    var waterTile = world.waterTiles.get(key);
    if (waterTile) {
      return waterTile.elevation || 0;
    }
    var shadowTile = activeShadowTiles.get(key);
    if (shadowTile) {
      return shadowTile.elevation || 0;
    }
    var revealTile = activeRevealTiles.get(key);
    if (revealTile) {
      return revealTile.elevation || 0;
    }
    return 0;
  }

  function maybeBeginLayerDrop() {
    var shadowTile = activeShadowTiles.get(tileKey(state.player.x, state.player.y));
    if (!shadowTile || !shadowTile.descentTo) {
      return false;
    }
    queueMove(
      shadowTile.descentTo.x,
      shadowTile.descentTo.y,
      "floor",
      shadowTile.descentTo.x - state.player.x,
      shadowTile.descentTo.y - state.player.y,
      0.34,
      shadowTile.descentTo.elevation
    );
    setToast("光束向下切开了层面，你跃入" + shadowTile.descentTo.label + "。");
    setHint("抓住下照显出的路线，继续往更深处前进。");
    return true;
  }

  function syncAbilityChip(chip) {
    [shatterChip, memoryChip, fireChip, freezeChip, flashChip, pierceChip].forEach(function (node) {
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
      gap.restoreUntil = state.lastTime + 4;
      setToast("【忆】生效：透明地面被记忆重新编织。");
      setHint("临时通路已经恢复，但它会在 4 秒后再次消失。");
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
      setToast("【火】生效：冰面被烧掉了，你可以稳定通过。");
      setHint("冰面已经消失，现在可以正常走过去。");
      updateObjective();
      return;
    }
    setToast("附近没有可被【火】烧融的冰面。");
  }

  function castFreeze() {
    if (!state.started || state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }
    syncAbilityChip(freezeChip);
    var waterTile = chooseNearbyTarget(world.waterTiles, 1, function (candidate) {
      return !candidate.frozen;
    });
    if (waterTile) {
      world.waterTiles.forEach(function (candidate) {
        if (candidate.group === waterTile.group) {
          candidate.frozen = true;
        }
      });
      setToast("【冰】生效：透明蓝水面被冻结，可以安全踏上。");
      setHint("水面已经冻结，立刻通过。");
      updateObjective();
      return;
    }
    setToast("附近没有可被【冰】冻结的水面。");
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
      wall.shadowUntil = state.lastTime + 4;
      if (!wall.shadowUsed) {
        wall.shadowUsed = true;
        state.shadowTriggered += 1;
      }
      triggered = true;
      setToast("【影】生效：高墙把光切成了向下延展的影路。");
      setHint("快顺着新出现的影路前进，它会在 4 秒后消失。");
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
      setToast("靠近有影机关的高墙后再按 F，阴影路径才会出现。");
    }
    updateObjective();
  }

  function castPierce() {
    if (!state.started || state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }
    syncAbilityChip(pierceChip);
    var triggered = false;
    var wall = chooseNearbyTarget(world.tallWalls, 1, function (candidate) {
      return Boolean(candidate.reveal);
    });

    if (wall && wall.reveal) {
      wall.revealUntil = state.lastTime + 4;
      if (!wall.revealUsed) {
        wall.revealUsed = true;
        state.revealTriggered += 1;
      }
      triggered = true;
      setToast("【透】生效：墙后的隐藏通路被照了出来。");
      setHint("透出的路只存在 4 秒，别停留。");
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
      setToast("靠近有透路机关的高墙后再按 E，隐藏通路才会出现。");
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
    var iceTile = world.iceTiles.get(key);
    if (iceTile) {
      return iceTile.melted ? "floor" : "ice";
    }
    var waterTile = world.waterTiles.get(key);
    if (waterTile) {
      return waterTile.frozen ? "frozenWater" : "water";
    }
    if (activeShadowTiles.has(key)) {
      return "shadow";
    }
    if (activeRevealTiles.has(key)) {
      return "reveal";
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
    var waterTile = world.waterTiles.get(key);

    if (lowWall && !lowWall.broken) {
      return "前面是矮墙，靠近后按 1 使用【碎】破坏它。";
    }
    if (gap && gap.recoverable && !gap.restored) {
      return "前面是透明缺口，靠近后按 2 使用【忆】恢复地面，但它只会短暂存在。";
    }
    if (tallWall && tallWall.shadow) {
      return "高墙挡住了路，靠近后按 F【影】向下照出 4 秒影路。";
    }
    if (tallWall && tallWall.reveal) {
      return "这面高墙后藏着路，靠近后按 E【透】照出 4 秒通路。";
    }
    if (tallWall) {
      return "高墙把路线切开了，去找另一条连通的小路。";
    }
    if (iceTile && !iceTile.melted) {
      return "前面是冰面，靠近后按 3 使用【火】烧掉它。";
    }
    if (waterTile && !waterTile.frozen) {
      return "前面是深蓝水面，必须先按 4 使用【冰】冻结。";
    }
    return "";
  }

  function queueMove(nextX, nextY, result, dx, dy, duration, targetElevation) {
    state.player.fromX = state.player.x;
    state.player.fromY = state.player.y;
    state.player.toX = nextX;
    state.player.toY = nextY;
    state.player.moveT = 0;
    state.player.moveDuration = duration || 0.22;
    state.player.moveDx = dx;
    state.player.moveDy = dy;
    state.player.arrivalType = result;
    state.player.fromZ = getTileElevationAt(state.player.x, state.player.y);
    state.player.toZ = typeof targetElevation === "number" ? targetElevation : getTileElevationAt(nextX, nextY);
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

    if (result === "water") {
      setHint(obstacleHintAt(nextX, nextY) || "透明蓝水面还没冻结，踩上去会直接坠落。");
    }

    queueMove(nextX, nextY, result, dx, dy, 0.22);
  }

  function refreshContextHint() {
    if (!state.started) {
      setHint("先输入名字并点击开始，试炼开始后才会显示下一步提示。");
      return;
    }

    if (state.victory) {
      setHint("终点已经点亮，返回首页或继续体验场景。");
      return;
    }

    if (state.player.falling) {
      if (state.player.fallReason === "void") {
        setHint("你跌出了地图边缘，正在回到最近的安全区域。");
      } else if (state.player.fallReason === "water") {
        setHint("你沉进了水里，正在回到最近的安全区域。");
      } else {
        setHint("你掉入了空洞，正在回到最近的安全区域。");
      }
      return;
    }

    if (isPlayerOnShadowTile()) {
      var activeShadow = activeShadowTiles.get(tileKey(state.player.x, state.player.y));
      if (activeShadow && activeShadow.descentTo) {
        setHint("脚下是向下延展的影路，继续前压就会跃入下一层。");
      } else {
        setHint("你正站在阴影路径上，抓紧时间通过。");
      }
      return;
    }

    if (isPlayerOnRevealTile()) {
      setHint("你正站在透出的临时通路上，它会很快消失。");
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
    var waterTile = chooseNearbyTarget(world.waterTiles, 1, function (candidate) {
      return !candidate.frozen;
    });
    var tallWall = chooseNearbyTarget(world.tallWalls, 1, function (candidate) {
      return Boolean(candidate.shadow);
    });
    var pierceWall = chooseNearbyTarget(world.tallWalls, 1, function (candidate) {
      return Boolean(candidate.reveal);
    });
    var solidTallWall = chooseNearbyTarget(world.tallWalls, 1, function (candidate) {
      return !candidate.shadow && !candidate.reveal;
    });

    if (lowWall) {
      setHint("靠近矮墙后，按 1 使用【碎】破坏它。");
      return;
    }
    if (gap) {
      setHint("靠近透明缺口后，按 2 使用【忆】恢复地面，注意它 4 秒后会消失。");
      return;
    }
    if (iceTile) {
      setHint("靠近冰面后，按 3 使用【火】烧掉它，就能正常行走。");
      return;
    }
    if (waterTile) {
      setHint("前方是深蓝水面。靠近后按 4 使用【冰】冻结它。");
      return;
    }
    if (tallWall) {
      setHint("靠近高墙后，按 F【影】向下照出 4 秒路线，有些影路还能直接落层。");
      return;
    }
    if (pierceWall) {
      setHint("靠近高墙后，按 E【透】照出 4 秒临时通路。");
      return;
    }
    if (solidTallWall) {
      setHint("附近高墙把空间切开了，沿着连通的小路继续寻找出口。");
      return;
    }
    if (countActivatedShadowWalls() < world.shadowCount) {
      setHint("继续前进，找到下一面高墙并用 F【影】切开向下的路线。");
      return;
    }
    if (countActivatedRevealWalls() < world.revealCount) {
      setHint("阴影桥之后还有一道隐藏通路，别忘了用 E【透】。");
      return;
    }
    setHint("继续前进，组合不同规则穿过障碍。");
  }

  function isPlayerOnShadowTile() {
    return activeShadowTiles.has(tileKey(state.player.x, state.player.y));
  }

  function isPlayerOnRevealTile() {
    return activeRevealTiles.has(tileKey(state.player.x, state.player.y));
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

  function triggerWaterFall() {
    if (state.player.falling) {
      return;
    }
    state.player.falling = true;
    state.player.fallT = 0;
    state.player.fallReason = "water";
    setToast("透明蓝水面还没冻结，你直接沉了下去。");
    setHint("先冻结水面再通过。", "alert");
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
    state.player.fromZ = getTileElevationAt(world.start.x, world.start.y);
    state.player.toZ = getTileElevationAt(world.start.x, world.start.y);
    state.player.sliding = false;
    state.player.fallReason = "gap";
    state.player.moveDuration = 0.22;
    world.iceTiles.forEach(function (tile) {
      tile.melted = false;
    });
    world.waterTiles.forEach(function (tile) {
      tile.frozen = false;
    });
    world.gaps.forEach(function (gap) {
      if (gap.recoverable) {
        gap.restored = false;
        gap.restoreUntil = 0;
      }
    });
    world.tallWalls.forEach(function (wall) {
      wall.shadowUntil = 0;
      wall.revealUntil = 0;
      wall.shadowUsed = false;
      wall.revealUsed = false;
    });
    state.shadowTriggered = 0;
    state.revealTriggered = 0;
    activeShadowTiles.clear();
    activeRevealTiles.clear();
    setHint("你已回到重置点，请留意红色警示后再重新尝试。", "alert");
  }

  function updateShadowTiles(now) {
    activeShadowTiles.clear();
    world.tallWalls.forEach(function (wall) {
      if (wall.shadow && wall.shadowUntil > now) {
        wall.shadow.shadowTiles.forEach(function (tile) {
          activeShadowTiles.set(tileKey(tile.x, tile.y), {
            x: tile.x,
            y: tile.y,
            elevation: typeof tile.elevation === "number" ? tile.elevation : (wall.elevation || 0),
            descentTo: tile.descentTo || null
          });
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

  function updateRevealTiles(now) {
    activeRevealTiles.clear();
    world.tallWalls.forEach(function (wall) {
      if (wall.reveal && wall.revealUntil > now) {
        wall.reveal.revealTiles.forEach(function (tile) {
          activeRevealTiles.set(tileKey(tile.x, tile.y), {
            x: tile.x,
            y: tile.y,
            elevation: typeof tile.elevation === "number" ? tile.elevation : (wall.elevation || 0)
          });
        });
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
        } else if (state.player.arrivalType === "water") {
          triggerWaterFall();
        } else {
          if (!activeShadowTiles.has(tileKey(state.player.x, state.player.y)) && state.player.arrivalType === "shadow") {
            triggerFall();
            return;
          }
          if (!activeRevealTiles.has(tileKey(state.player.x, state.player.y)) && state.player.arrivalType === "reveal") {
            triggerFall();
            return;
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

          if (state.player.arrivalType === "shadow" && maybeBeginLayerDrop()) {
            return;
          }

          if (state.player.x === world.goal.x && state.player.y === world.goal.y && !state.victory) {
            state.victory = true;
            state.elapsed = state.lastTime - state.runStartedAt;
            setToast("Stage 2 完成。你成功穿过了失重回廊。");
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
      } else if (currentTile === "water") {
        triggerWaterFall();
      } else if (currentTile === "reveal" && !activeRevealTiles.has(tileKey(state.player.x, state.player.y))) {
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
      return {
        x: state.player.x,
        y: state.player.y,
        z: getTileElevationAt(state.player.x, state.player.y)
      };
    }
    var t = easeInOut(state.player.moveT);
    return {
      x: state.player.fromX + (state.player.toX - state.player.fromX) * t,
      y: state.player.fromY + (state.player.toY - state.player.fromY) * t,
      z: state.player.fromZ + (state.player.toZ - state.player.fromZ) * t
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
    drawFloatingGlyphs(width, height, time);
    drawMotes(width, height, time);
    drawWorldBase();
    drawFloorLayer();
    drawShadowTiles(time);
    drawRevealTiles(time);
    drawObjects();
    drawWorldPrompt();
    drawFireBursts();
    drawBeam(time);
  }

  function drawBackground(width, height, time) {
    var gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#0d1529");
    gradient.addColorStop(1, "#07111c");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "rgba(95, 191, 119, 0.08)";
    ctx.beginPath();
    ctx.ellipse(width * 0.3, height * 0.18, 220, 90, time * 0.03, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(139, 107, 232, 0.08)";
    ctx.beginPath();
    ctx.ellipse(width * 0.74, height * 0.22, 200, 80, -time * 0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(118, 192, 255, 0.06)";
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.72, 280, 120, time * 0.015, 0, Math.PI * 2);
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
        tiles.push({ x: gap.x, y: gap.y, type: "gap", elevation: gap.elevation || 0 });
      } else {
        tiles.push({ x: gap.x, y: gap.y, type: "memory", elevation: gap.elevation || 0 });
      }
    });
    world.iceTiles.forEach(function (iceTile) {
      tiles.push({
        x: iceTile.x,
        y: iceTile.y,
        type: iceTile.melted ? "melted" : "ice",
        elevation: iceTile.elevation || 0
      });
    });
    world.waterTiles.forEach(function (waterTile) {
      tiles.push({
        x: waterTile.x,
        y: waterTile.y,
        type: waterTile.frozen ? "frozenWater" : "water",
        elevation: waterTile.elevation || 0
      });
    });
    tiles.sort(function (a, b) {
      return ((a.x + a.y) * 1000 + (a.elevation || 0)) - ((b.x + b.y) * 1000 + (b.elevation || 0));
    });
    tiles.forEach(function (cell) {
      if (cell.type === "gap") {
        drawGap(cell.x, cell.y, cell.elevation || 0);
      } else {
        drawTilePrism(cell.x, cell.y, cell.type, FLOOR_DEPTH, cell.elevation || 0, 1);
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
          elevation: gap.elevation || 0
        });
      }
    });

    world.iceTiles.forEach(function (iceTile, key) {
      surfaces.set(key, {
        x: iceTile.x,
        y: iceTile.y,
        type: iceTile.melted ? "melted" : "ice",
        elevation: iceTile.elevation || 0
      });
    });

    world.waterTiles.forEach(function (waterTile, key) {
      surfaces.set(key, {
        x: waterTile.x,
        y: waterTile.y,
        type: waterTile.frozen ? "frozenWater" : "water",
        elevation: waterTile.elevation || 0
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
    activeShadowTiles.forEach(function (tile) {
      var pulse = 0.76 + Math.sin(time * 6 + tile.x + tile.y) * 0.12;
      drawTilePrism(tile.x, tile.y, "shadow", 10, tile.elevation || 0, pulse);
    });
  }

  function drawRevealTiles(time) {
    activeRevealTiles.forEach(function (tile) {
      var pulse = 0.82 + Math.sin(time * 6 + tile.x + tile.y) * 0.1;
      drawTilePrism(tile.x, tile.y, "reveal", 10, tile.elevation || 0, pulse);
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
        top: "rgba(204, 243, 255, 0.94)",
        side: "rgba(116, 172, 196, 0.86)",
        stroke: "rgba(248, 254, 255, 0.3)",
        glow: "rgba(242, 252, 255, 0.24)"
      };
    }
    if (typeA === "water" || typeB === "water" || typeA === "frozenWater" || typeB === "frozenWater" || typeA === "reveal" || typeB === "reveal") {
      return {
        top: typeA === "reveal" || typeB === "reveal" ? "rgba(168, 241, 255, 0.86)" : "rgba(32, 112, 198, 0.62)",
        side: typeA === "reveal" || typeB === "reveal" ? "rgba(62, 119, 146, 0.76)" : "rgba(14, 49, 103, 0.8)",
        stroke: "rgba(229, 250, 255, 0.2)",
        glow: "rgba(98, 177, 255, 0.16)"
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

    var lowWall = chooseNearbyTarget(world.lowWalls, 1, function (candidate) {
      return !candidate.broken;
    });
    if (lowWall) {
      return { x: lowWall.x, y: lowWall.y, elevation: lowWall.elevation || 0, text: "1  碎破墙" };
    }

    var gap = chooseNearbyTarget(world.gaps, 1, function (candidate) {
      return candidate.recoverable && !candidate.restored;
    });
    if (gap) {
      return { x: gap.x, y: gap.y, elevation: gap.elevation || 0, text: "2  忆补路" };
    }

    var iceTile = chooseNearbyTarget(world.iceTiles, 1, function (candidate) {
      return !candidate.melted;
    });
    if (iceTile) {
      return { x: iceTile.x, y: iceTile.y, elevation: iceTile.elevation || 0, text: "3  火融冰" };
    }

    var waterTile = chooseNearbyTarget(world.waterTiles, 1, function (candidate) {
      return !candidate.frozen;
    });
    if (waterTile) {
      return { x: waterTile.x, y: waterTile.y, elevation: waterTile.elevation || 0, text: "4  冰封水面" };
    }

    var tallWall = chooseNearbyTarget(world.tallWalls, 1, function (candidate) {
      return Boolean(candidate.shadow);
    });
    if (tallWall) {
      return { x: tallWall.x, y: tallWall.y, elevation: tallWall.elevation || 0, text: "F  影成桥" };
    }

    var pierceWall = chooseNearbyTarget(world.tallWalls, 1, function (candidate) {
      return Boolean(candidate.reveal);
    });
    if (pierceWall) {
      return { x: pierceWall.x, y: pierceWall.y, elevation: pierceWall.elevation || 0, text: "E  透照路" };
    }

    return null;
  }

  function drawWorldPrompt() {
    var prompt = getWorldPrompt();
    if (!prompt) {
      return;
    }

    var point = isoPoint(prompt.x, prompt.y, (prompt.elevation || 0) + 96);
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
    world.lowWalls.forEach(function (wall) {
      if (!wall.broken) {
        renderables.push({ type: "lowWall", sort: (wall.x + wall.y) * 1000 + (wall.elevation || 0) + 68, data: wall });
      }
    });
    world.tallWalls.forEach(function (wall) {
      renderables.push({ type: "tallWall", sort: (wall.x + wall.y) * 1000 + (wall.elevation || 0) + 88, data: wall });
    });
    renderables.push({ type: "goal", sort: (world.goal.x + world.goal.y) * 1000 + getTileElevationAt(world.goal.x, world.goal.y) + 52, data: world.goal });
    renderables.push({ type: "player", sort: (getPlayerInterpolatedPosition().x + getPlayerInterpolatedPosition().y) * 1000 + (getPlayerInterpolatedPosition().z || 0) + 76, data: null });
    renderables.sort(function (a, b) {
      return a.sort - b.sort;
    });

    renderables.forEach(function (item) {
      if (item.type === "lowWall") {
        drawWall(item.data.x, item.data.y, LOW_WALL_H, 0.82, "low", item.data.elevation || 0);
      } else if (item.type === "tallWall") {
        drawTallWall(item.data);
      } else if (item.type === "goal") {
        drawGoal(world.goal.x, world.goal.y);
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

    if (type === "moss" || type === "memory" || type === "altar" || type === "ice" || type === "melted" || type === "water" || type === "frozenWater" || type === "reveal") {
      if (type === "altar") {
        ctx.fillStyle = "rgba(244, 232, 178, 0.28)";
      } else if (type === "ice") {
        ctx.fillStyle = "rgba(239, 252, 255, 0.34)";
      } else if (type === "water") {
        ctx.fillStyle = "rgba(214, 245, 255, 0.18)";
      } else if (type === "frozenWater") {
        ctx.fillStyle = "rgba(235, 250, 255, 0.28)";
      } else if (type === "reveal") {
        ctx.fillStyle = "rgba(214, 248, 255, 0.22)";
      } else if (type === "melted") {
        ctx.fillStyle = "rgba(255, 183, 122, 0.2)";
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
    if (type === "reveal") {
      ctx.strokeStyle = "rgba(214, 251, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      polygon([top, right, bottom, left], true);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  function getTilePalette(type) {
    if (type === "wood") {
      return {
        top: "#90714a",
        left: "#5b432a",
        right: "#6b5033",
        stroke: "rgba(255, 241, 211, 0.12)"
      };
    }
    if (type === "memory") {
      return {
        top: "#f6a7d8",
        left: "#9b4f7b",
        right: "#b96692",
        stroke: "rgba(255, 230, 244, 0.34)"
      };
    }
    if (type === "ice") {
      return {
        top: "#d4f4ff",
        left: "#78b7cf",
        right: "#95d0e3",
        stroke: "rgba(247, 254, 255, 0.4)"
      };
    }
    if (type === "water") {
      return {
        top: "rgba(28, 105, 188, 0.64)",
        left: "rgba(10, 41, 96, 0.82)",
        right: "rgba(18, 66, 128, 0.8)",
        stroke: "rgba(210, 235, 255, 0.24)"
      };
    }
    if (type === "frozenWater") {
      return {
        top: "rgba(206, 243, 255, 0.94)",
        left: "rgba(110, 169, 196, 0.88)",
        right: "rgba(135, 194, 219, 0.9)",
        stroke: "rgba(248, 254, 255, 0.4)"
      };
    }
    if (type === "melted") {
      return {
        top: "#9d7f5a",
        left: "#5f4930",
        right: "#73593c",
        stroke: "rgba(255, 212, 168, 0.18)"
      };
    }
    if (type === "shadow") {
      return {
        top: "rgba(103, 124, 173, 0.58)",
        left: "rgba(40, 52, 84, 0.5)",
        right: "rgba(56, 70, 108, 0.52)",
        stroke: "rgba(207, 228, 255, 0.18)"
      };
    }
    if (type === "reveal") {
      return {
        top: "rgba(150, 239, 255, 0.82)",
        left: "rgba(63, 126, 148, 0.74)",
        right: "rgba(80, 156, 181, 0.76)",
        stroke: "rgba(226, 251, 255, 0.3)"
      };
    }
    if (type === "altar") {
      return {
        top: "#d1efb9",
        left: "#557843",
        right: "#678f51",
        stroke: "rgba(255, 255, 255, 0.22)"
      };
    }
    return {
      top: "#6db681",
      left: "#345742",
      right: "#417054",
      stroke: "rgba(223, 255, 229, 0.12)"
    };
  }

  function drawGap(x, y, elevation) {
    var point = isoPoint(x, y, (elevation || 0) - 4);
    var top = { x: point.x, y: point.y - TILE_H * 0.48 };
    var right = { x: point.x + TILE_W * 0.48, y: point.y };
    var bottom = { x: point.x, y: point.y + TILE_H * 0.48 };
    var left = { x: point.x - TILE_W * 0.48, y: point.y };
    ctx.save();
    ctx.fillStyle = "rgba(5, 8, 16, 0.92)";
    polygon([top, right, bottom, left]);
    ctx.fill();
    ctx.strokeStyle = "rgba(116, 193, 163, 0.14)";
    ctx.lineWidth = 1;
    polygon([top, right, bottom, left], true);
    ctx.stroke();
    ctx.fillStyle = "rgba(163, 123, 255, 0.14)";
    ctx.beginPath();
    ctx.ellipse(point.x, point.y + 4, TILE_W * 0.18, TILE_H * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawWall(x, y, height, scale, kind, elevation) {
    var point = isoPoint(x, y, (elevation || 0) + height);
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
    drawWall(wall.x, wall.y, TALL_WALL_H, 0.92, "tall", wall.elevation || 0);
    if (wall.shadow && wall.shadowUntil > state.lastTime) {
      var point = isoPoint(wall.x, wall.y, (wall.elevation || 0) + TALL_WALL_H + 10);
      ctx.fillStyle = "rgba(255, 245, 198, 0.16)";
      ctx.beginPath();
      ctx.arc(point.x, point.y - 8, 12, 0, Math.PI * 2);
      ctx.fill();
    }
    if (wall.reveal && wall.revealUntil > state.lastTime) {
      var revealPoint = isoPoint(wall.x, wall.y, (wall.elevation || 0) + TALL_WALL_H + 18);
      ctx.fillStyle = "rgba(178, 244, 255, 0.18)";
      ctx.beginPath();
      ctx.arc(revealPoint.x, revealPoint.y - 10, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawGoal(x, y) {
    var point = isoPoint(x, y, getTileElevationAt(x, y) + 28);
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(244, 232, 178, 0.38)";
    ctx.fillStyle = "#f4e8b2";
    ctx.font = "700 34px Noto Serif SC, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("明", point.x, point.y);
    ctx.restore();
  }

  function drawPlayer() {
    var pos = getPlayerInterpolatedPosition();
    var point = isoPoint(pos.x, pos.y, (pos.z || 0) + 26);
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

    var start = isoPoint(state.beam.fromX, state.beam.fromY, getTileElevationAt(state.beam.fromX, state.beam.fromY) + 24);
    var end = isoPoint(state.beam.toX, state.beam.toY, getTileElevationAt(Math.round(state.beam.toX), Math.round(state.beam.toY)) + 30);
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
      updateRevealTiles(now);
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
    return countFrozenWaterGroups() > 0 && (
      countActivatedShadowWalls() < world.shadowCount ||
      countActivatedRevealWalls() < world.revealCount
    );
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
      if (event.key === "Enter" && startModal.classList.contains("is-visible")) {
        beginStage();
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
    if (event.key === "4") {
      castFreeze();
      event.preventDefault();
      return;
    }
    if (event.key === "f" || event.key === "F") {
      castFlashlight();
      event.preventDefault();
      return;
    }
    if (event.key === "e" || event.key === "E") {
      castPierce();
      event.preventDefault();
      return;
    }
  }

  shatterChip.addEventListener("click", castShatter);
  memoryChip.addEventListener("click", castMemory);
  fireChip.addEventListener("click", castFire);
  freezeChip.addEventListener("click", castFreeze);
  flashChip.addEventListener("click", castFlashlight);
  pierceChip.addEventListener("click", castPierce);
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
  startNameInput.focus();
  refreshHonorBoard();
  updateTimerDisplay();
  refreshContextHint();
  updateObjective();
  window.requestAnimationFrame(loop);
})();
