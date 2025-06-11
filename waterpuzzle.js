document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("game-container");
  const playButton = document.getElementById("play-button");
  const levelSelect = document.getElementById("level-select");

  const colors = [
    "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown",
    "cyan", "magenta", "lime", "teal", "indigo", "violet", "gold", "silver",
    "maroon", "navy", "olive", "coral",
  ];
  const tubes = [];
  let selectedTube = null;
  let levelCount = 1;
  let completedLevels = 0;         // ✅ 累計完成關卡數
  let totalCompletedTubes = 0;     // ✅ 累計完成試管數（所有關卡總和）

  function chooseLevel(level) {
    levelCount = level;
    document.getElementById("level-count").textContent = levelCount;
  }

  levelSelect.addEventListener("change", (event) => {
    const selectedLevel = parseInt(event.target.value, 10);
    chooseLevel(selectedLevel);
  });

  function checkGameState() {
    const allSameColor = (tube) => {
      const waters = Array.from(tube.children);
      return (
        waters.length === 4 &&
        waters.every(
          (water) =>
            water.style.backgroundColor === waters[0].style.backgroundColor
        )
      );
    };

    let completedTubes = 0;
    tubes.forEach((tube) => {
      if (allSameColor(tube)) {
        completedTubes++;
      }
    });

    // ✅ 將本關完成的試管數加入總數
    totalCompletedTubes += completedTubes;
    document.getElementById("completed-tubes-count").textContent = totalCompletedTubes;

    if (
      tubes.every((tube) => tube.childElementCount === 0 || allSameColor(tube))
    ) {
      document.body.classList.add("flash");
      setTimeout(() => document.body.classList.remove("flash"), 1000);

      // ✅ 累加已完成關卡數並更新畫面
      completedLevels++;
      document.getElementById("completed-levels-count").textContent = completedLevels;

      if (levelCount === 10) {
        alert("🎉 恭喜！你已經完成所有挑戰！");
      } else {
        alert("✅ 本關完成！進入下一關！");
        levelCount++;
        document.getElementById("level-count").textContent = levelCount;
        chooseLevel(levelCount);
        createTubes();
        fillTubes();
      }
    }
  }

  function pourWater(fromTube, toTube) {
    let fromWater = fromTube.querySelector(".water:last-child");
    let toWater = toTube.querySelector(".water:last-child");

    if (!fromWater) return;

    const color = fromWater.style.backgroundColor;

    const pourBlock = () => {
      const next = fromTube.querySelector(".water:last-child");
      if (
        next &&
        next.style.backgroundColor === color &&
        toTube.childElementCount < 4
      ) {
        next.classList.add("pouring");
        toTube.appendChild(next);
        setTimeout(() => {
          next.classList.remove("pouring");
          pourBlock();
        }, 100);
      } else {
        checkGameState();
      }
    };

    if (!toWater || toWater.style.backgroundColor === color) {
      pourBlock();
    }
  }

  function selectTube(tube) {
    if (selectedTube) {
      if (selectedTube !== tube) {
        pourWater(selectedTube, tube);
      }
      selectedTube.classList.remove("selected");
      selectedTube = null;
    } else {
      selectedTube = tube;
      tube.classList.add("selected");
    }
  }

  function createTubes() {
    gameContainer.innerHTML = "";
    tubes.length = 0;

    for (let i = 0; i < levelCount + 1; i++) {
      const tube = document.createElement("div");
      tube.classList.add("tube");
      tube.addEventListener("click", () => selectTube(tube));
      gameContainer.appendChild(tube);
      tubes.push(tube);
    }

    for (let i = 0; i < 2; i++) {
      const emptyTube = document.createElement("div");
      emptyTube.classList.add("tube");
      emptyTube.addEventListener("click", () => selectTube(emptyTube));
      gameContainer.appendChild(emptyTube);
      tubes.push(emptyTube);
    }
  }

  function fillTubes() {
    const gameColors = colors.slice(0, Math.min(levelCount + 1, colors.length));
    const waterBlocks = [];

    gameColors.forEach((color) => {
      for (let i = 0; i < 4; i++) {
        waterBlocks.push(color);
      }
    });

    waterBlocks.sort(() => 0.5 - Math.random());

    let blockIndex = 0;
    tubes.slice(0, levelCount + 1).forEach((tube) => {
      for (let i = 0; i < 4; i++) {
        if (blockIndex < waterBlocks.length) {
          const water = document.createElement("div");
          water.classList.add("water");
          water.style.backgroundColor = waterBlocks[blockIndex];
          water.style.height = "20%";
          tube.appendChild(water);
          blockIndex++;
        }
      }
    });
  }

  playButton.addEventListener("click", () => {
    tubes.length = 0;
    createTubes();
    fillTubes();
  });
});
