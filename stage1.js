(function () {
  var canvas = document.getElementById("stageCanvas");
  var ctx = canvas.getContext("2d");
  var objectiveText = document.getElementById("objectiveText");
  var hintText = document.getElementById("hintText");
  var toast = document.getElementById("toast");
  var progressList = document.getElementById("progressList");
  var shatterChip = document.getElementById("shatterChip");
  var memoryChip = document.getElementById("memoryChip");
  var flashChip = document.getElementById("flashChip");

  var DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  var TILE_W = 84;
  var TILE_H = 42;
  var FLOOR_DEPTH = 18;
  var LOW_WALL_H = 22;
  var TALL_WALL_H = 62;
  var originX = 0;
  var originY = 0;

  var world = createWorld();
  var floatingGlyphs = createGlyphs();
  var floatingMotes = createMotes();
  var activeShadowTiles = new Set();
  var toastTimer = 0;

  var state = {
    lastTime: 0,
    beam: null,
    victory: false,
    shadowTriggered: 0,
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
      facing: "E",
      falling: false,
      fallT: 0
    }
  };

  function createWorld() {
    var floors = new Map();
    var gaps = new Map();
    var lowWalls = new Map();
    var tallWalls = new Map();

    addTiles(floors, [
      [1, 6, "wood"], [2, 6, "wood"], [3, 6, "wood"], [4, 6, "wood"], [5, 6, "moss"], [6, 6, "moss"], [7, 6, "moss"],
      [1, 7, "wood"], [2, 7, "wood"], [3, 7, "wood"], [4, 7, "wood"], [5, 7, "moss"], [7, 7, "moss"],
      [1, 8, "wood"], [2, 8, "wood"], [3, 8, "wood"], [4, 8, "wood"], [5, 8, "moss"], [6, 8, "moss"], [7, 8, "moss"], [8, 8, "moss"],
      [4, 5, "wood"], [5, 5, "moss"], [7, 5, "moss"],
      [11, 5, "wood"], [12, 5, "wood"], [13, 5, "wood"],
      [11, 6, "wood"], [12, 6, "wood"], [14, 6, "altar"],
      [11, 7, "wood"], [12, 7, "wood"], [13, 7, "wood"], [14, 7, "moss"]
    ]);

    addGap(gaps, 6, 7, true);
    addGap(gaps, 13, 6, true);

    addLowWall(lowWalls, 4, 7, "lw1");
    addLowWall(lowWalls, 12, 6, "lw2");

    addTallWall(tallWalls, 6, 5, "tw0", null);
    addTallWall(tallWalls, 8, 6, "tw1", {
      requiredFacing: "E",
      activationCells: [{ x: 7, y: 6 }, { x: 7, y: 7 }],
      shadowTiles: [{ x: 8, y: 7 }, { x: 9, y: 7 }, { x: 10, y: 7 }],
      duration: 4.2
    });

    return {
      width: 16,
      height: 11,
      floors: floors,
      gaps: gaps,
      lowWalls: lowWalls,
      tallWalls: tallWalls,
      start: { x: 2, y: 7 },
      goal: { x: 14, y: 6 }
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
      restored: false
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

  function tileKey(x, y) {
    return String(x) + "," + String(y);
  }

  function resizeCanvas() {
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    originX = window.innerWidth * 0.48;
    originY = Math.max(170, window.innerHeight * 0.16);
  }

  function isoPoint(x, y, z) {
    return {
      x: originX + (x - y) * TILE_W * 0.5,
      y: originY + (x + y) * TILE_H * 0.5 - z
    };
  }

  function setToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("visible");
    }, 2200);
  }

  function setHint(message) {
    hintText.textContent = message;
  }

  function updateObjective() {
    var broken = countBrokenWalls();
    var restored = countRestoredGaps();

    if (!world.lowWalls.get(tileKey(4, 7)).broken) {
      objectiveText.textContent = "先面对矮墙，按 1 使用【碎】破坏低墙，打开前路。";
    } else if (!world.gaps.get(tileKey(6, 7)).restored) {
      objectiveText.textContent = "前方有空洞，面对空洞后按 2 使用【忆】，恢复地面。";
    } else if (state.shadowTriggered < 1) {
      objectiveText.textContent = "继续前进，用固定能力手电筒照射高墙，制造临时阴影路径。";
    } else if (!world.lowWalls.get(tileKey(12, 6)).broken) {
      objectiveText.textContent = "通过阴影路径后，再次使用【碎】处理第二面矮墙。";
    } else if (!world.gaps.get(tileKey(13, 6)).restored) {
      objectiveText.textContent = "最后使用【忆】恢复终点前的空洞。";
    } else if (!state.victory) {
      objectiveText.textContent = "终点祭坛已经可达，向前移动完成 Stage 1。";
    } else {
      objectiveText.textContent = "Stage 1 完成。你已经理解：不同汉字对应不同规则。";
    }

    progressList.innerHTML = [
      "<li>矮墙已破坏：" + broken + " / 2</li>",
      "<li>空洞已恢复：" + restored + " / 2</li>",
      "<li>阴影路径已触发：" + state.shadowTriggered + " / 1</li>"
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
      if (gap.restored) {
        count += 1;
      }
    });
    return count;
  }

  function syncAbilityChip(chip) {
    [shatterChip, memoryChip, flashChip].forEach(function (node) {
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
    if (state.player.facing === "N") {
      return { x: 0, y: -1 };
    }
    if (state.player.facing === "S") {
      return { x: 0, y: 1 };
    }
    if (state.player.facing === "W") {
      return { x: -1, y: 0 };
    }
    return { x: 1, y: 0 };
  }

  function currentFacingTile() {
    var dir = getFacingVector();
    return {
      x: state.player.x + dir.x,
      y: state.player.y + dir.y
    };
  }

  function castShatter() {
    if (state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }
    syncAbilityChip(shatterChip);
    var target = currentFacingTile();
    var wall = world.lowWalls.get(tileKey(target.x, target.y));
    if (wall && !wall.broken) {
      wall.broken = true;
      setToast("【碎】生效：矮墙崩解，新的路径出现。");
      setHint("矮墙已经破坏，继续前进。");
      updateObjective();
      return;
    }
    setToast("这里没有可被【碎】破坏的矮墙。");
  }

  function castMemory() {
    if (state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }
    syncAbilityChip(memoryChip);
    var target = currentFacingTile();
    var gap = world.gaps.get(tileKey(target.x, target.y));
    if (gap && gap.recoverable && !gap.restored) {
      gap.restored = true;
      setToast("【忆】生效：破碎地面被记忆重新编织。");
      setHint("空洞已经恢复，现在可以继续通过。");
      updateObjective();
      return;
    }
    setToast("【忆】需要对准可恢复的空洞。");
  }

  function castFlashlight() {
    if (state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }
    syncAbilityChip(flashChip);
    var triggered = false;
    var wallKey = tileKey(8, 6);
    var wall = world.tallWalls.get(wallKey);
    if (wall && wall.shadow && state.player.facing === wall.shadow.requiredFacing) {
      var allowed = wall.shadow.activationCells.some(function (cell) {
        return cell.x === state.player.x && cell.y === state.player.y;
      });
      if (allowed) {
        wall.shadowUntil = state.lastTime + wall.shadow.duration;
        if (state.shadowTriggered < 1) {
          state.shadowTriggered = 1;
        }
        triggered = true;
        setToast("手电光束击中高墙，阴影路径被暂时具象化。");
        setHint("快通过阴影路径，它只会短暂存在。");
      }
    }

    state.beam = {
      fromX: state.player.x,
      fromY: state.player.y,
      dir: state.player.facing,
      ttl: 0.26,
      hit: triggered
    };

    if (!triggered) {
      setToast("手电筒需要从正确角度照射高墙，才能生成阴影路径。");
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
    if (activeShadowTiles.has(key)) {
      return "shadow";
    }
    if (world.floors.has(key)) {
      return "floor";
    }
    return "void";
  }

  function tryMove(dx, dy) {
    if (state.victory || state.player.falling || state.player.moveT < 1) {
      return;
    }

    if (dx === 1) {
      state.player.facing = "E";
    } else if (dx === -1) {
      state.player.facing = "W";
    } else if (dy === -1) {
      state.player.facing = "N";
    } else if (dy === 1) {
      state.player.facing = "S";
    }

    var nextX = state.player.x + dx;
    var nextY = state.player.y + dy;
    var result = walkResult(nextX, nextY);

    if (result === "void" || result === "block") {
      refreshContextHint();
      return;
    }

    state.player.fromX = state.player.x;
    state.player.fromY = state.player.y;
    state.player.toX = nextX;
    state.player.toY = nextY;
    state.player.moveT = 0;
    state.player.arrivalType = result;
  }

  function refreshContextHint() {
    if (state.victory) {
      setHint("终点已经点亮，返回首页或继续体验场景。");
      return;
    }

    if (state.player.falling) {
      setHint("你掉入了空洞，正在回到最近的安全区域。");
      return;
    }

    if (isPlayerOnShadowTile()) {
      setHint("你正站在阴影路径上，抓紧时间通过。");
      return;
    }

    var facing = currentFacingTile();
    var key = tileKey(facing.x, facing.y);
    var lowWall = world.lowWalls.get(key);
    var gap = world.gaps.get(key);
    var tallWall = world.tallWalls.get(key);

    if (lowWall && !lowWall.broken) {
      setHint("面对矮墙时，按 1 使用【碎】破坏它。");
      return;
    }
    if (gap && !gap.restored) {
      setHint("面对空洞时，按 2 使用【忆】恢复地面。");
      return;
    }
    if (tallWall && tallWall.shadow) {
      setHint("面对高墙时，按 F 用手电照射，制造临时阴影路径。");
      return;
    }
    if (state.shadowTriggered < 1) {
      setHint("前往下一处高墙，学习手电筒与阴影路径机制。");
      return;
    }
    setHint("继续前进，组合不同规则穿过障碍。");
  }

  function isPlayerOnShadowTile() {
    return activeShadowTiles.has(tileKey(state.player.x, state.player.y));
  }

  function triggerFall() {
    if (state.player.falling) {
      return;
    }
    state.player.falling = true;
    state.player.fallT = 0;
    setToast("空洞吞没了你。记住：有些路必须先被文字恢复。");
    refreshContextHint();
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
    state.player.facing = "E";
    setHint("你回到了起点，继续利用规则改变空间。");
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
        } else {
          if (!activeShadowTiles.has(tileKey(state.player.x, state.player.y)) && state.player.arrivalType === "shadow") {
            triggerFall();
          }
          if (state.player.x === world.goal.x && state.player.y === world.goal.y && !state.victory) {
            state.victory = true;
            setToast("Stage 1 完成。你已经学会用文字改写这片森林的规则。");
            updateObjective();
          }
        }
        refreshContextHint();
      }
    } else if (walkResult(state.player.x, state.player.y) === "void") {
      triggerFall();
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

    drawBackground(width, height, time);
    drawFloatingGlyphs(width, height, time);
    drawMotes(width, height, time);
    drawWorldBase();
    drawFloorLayer();
    drawShadowTiles(time);
    drawObjects();
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
      { x: 4.5, y: 6.8, rx: 230, ry: 84 },
      { x: 12.2, y: 6.3, rx: 180, ry: 74 }
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
    tiles.sort(function (a, b) {
      return (a.x + a.y) - (b.x + b.y);
    });
    tiles.forEach(function (cell) {
      if (cell.type === "gap") {
        drawGap(cell.x, cell.y);
      } else {
        drawTilePrism(cell.x, cell.y, cell.type, FLOOR_DEPTH, cell.elevation || 0, 1);
      }
    });
  }

  function drawShadowTiles(time) {
    activeShadowTiles.forEach(function (key) {
      var parts = key.split(",");
      var x = Number(parts[0]);
      var y = Number(parts[1]);
      var pulse = 0.76 + Math.sin(time * 6 + x + y) * 0.12;
      drawTilePrism(x, y, "shadow", 10, 0, pulse);
    });
  }

  function drawObjects() {
    var renderables = [];
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
      if (item.type === "lowWall") {
        drawWall(item.data.x, item.data.y, LOW_WALL_H, 0.82, "low");
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

    if (type === "moss" || type === "memory" || type === "altar") {
      ctx.fillStyle = type === "altar" ? "rgba(244, 232, 178, 0.28)" : "rgba(214, 255, 221, 0.18)";
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
        top: "#90714a",
        left: "#5b432a",
        right: "#6b5033",
        stroke: "rgba(255, 241, 211, 0.12)"
      };
    }
    if (type === "memory") {
      return {
        top: "#8bd4ff",
        left: "#476e8f",
        right: "#5380a4",
        stroke: "rgba(232, 249, 255, 0.26)"
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

  function drawGap(x, y) {
    var point = isoPoint(x, y, -4);
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
    var dir = getDirVector(state.beam.dir);
    var end = isoPoint(state.beam.fromX + dir.x * 2.4, state.beam.fromY + dir.y * 2.4, 30);
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
    if (facing === "N") {
      return { x: 0, y: -1 };
    }
    if (facing === "S") {
      return { x: 0, y: 1 };
    }
    if (facing === "W") {
      return { x: -1, y: 0 };
    }
    return { x: 1, y: 0 };
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
    updateShadowTiles(now);
    updatePlayer(dt);
    updateBeam(dt);

    if (!state.player.falling && !state.victory && activeShadowTiles.size === 0 && isShadowPuzzleBlocked()) {
      refreshContextHint();
    }

    updateObjective();
  }

  function isShadowPuzzleBlocked() {
    return world.gaps.get(tileKey(13, 6)).restored === false || world.lowWalls.get(tileKey(12, 6)).broken === false;
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
    if (event.repeat) {
      return;
    }
    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      tryMove(0, -1);
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
      tryMove(0, 1);
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      tryMove(-1, 0);
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      tryMove(1, 0);
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
    if (event.key === "f" || event.key === "F") {
      castFlashlight();
      event.preventDefault();
    }
  }

  shatterChip.addEventListener("click", castShatter);
  memoryChip.addEventListener("click", castMemory);
  flashChip.addEventListener("click", castFlashlight);
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("keydown", handleKeydown);

  if (window.sessionStorage.getItem("yanling-stage-entry") === "home-stage-1") {
    setToast("你已从首页进入 Stage 1。先用【碎】与【忆】理解基础规则，再学会用手电制造阴影路径。");
    window.sessionStorage.removeItem("yanling-stage-entry");
  } else {
    setToast("Stage 1 已加载。WASD 移动，按 1 使用【碎】，按 2 使用【忆】，按 F 使用固定手电能力。");
  }

  resizeCanvas();
  refreshContextHint();
  updateObjective();
  window.requestAnimationFrame(loop);
})();
