
    const STORAGE_KEY = "pet_state_v1";

    let state = {
      hunger: 30,   
      energy: 70,   
      health: 90,   
      asleep: false
    };

    function save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function load() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        state = { ...state, ...parsed };
      } catch {
      }
    }

    function clamp(n) {
      return Math.max(0, Math.min(100, n));
    }

    function $(id) {
      return document.getElementById(id);
    }

    function mood() {
      if (state.health <= 0) return "FAINTED";
      if (state.asleep) return "SLEEPING";
      if (state.hunger >= 80) return "HUNGRY";
      if (state.energy <= 20) return "SLEEPY";
      if (state.health <= 40) return "SICK";
      return "OKAY";
    }

    function render() {
      const pet = $("pet");
      const m = mood();

      $("hunger").textContent = state.hunger;
      $("energy").textContent = state.energy;
      $("health").textContent = state.health;
      $("mood").textContent = m;

      if (m === "OKAY") pet.style.background = "#a7f3d0";
      if (m === "HUNGRY") pet.style.background = "#fde68a";
      if (m === "SLEEPY") pet.style.background = "#bfdbfe";
      if (m === "SICK") pet.style.background = "#fecaca";
      if (m === "SLEEPING") pet.style.background = "#e5e7eb";
      if (m === "FAINTED") pet.style.background = "#d1d5db";

      pet.textContent = m;
      $("sleepBtn").disabled = state.asleep || state.health <= 0;
      $("wakeBtn").disabled = !state.asleep;
      $("playBtn").disabled = state.asleep || state.health <= 0;
      $("feedBtn").disabled = state.health <= 0;
      $("healBtn").disabled = state.health >= 100;

      save();
    }

    function log(msg) {
      $("log").textContent = msg;
    }

    function feed() {
      state.hunger = clamp(state.hunger - 20);
      state.energy = clamp(state.energy - 5);
      state.health = clamp(state.health + 2);
      log("Fed the pet.");
      render();
    }

    function play() {
      state.energy = clamp(state.energy - 15);
      state.hunger = clamp(state.hunger + 10);
      state.health = clamp(state.health + 3);
      log("Played with the pet.");
      render();
    }

    function sleep() {
      state.asleep = true;
      log("Pet fell asleep.");
      render();
    }

    function wake() {
      state.asleep = false;
      log("Pet woke up.");
      render();
    }

    function heal() {
      state.health = clamp(state.health + 20);
      state.energy = clamp(state.energy + 5);
      state.hunger = clamp(state.hunger + 5);
      if (state.health > 0) state.asleep = false;
      log("Healed the pet.");
      render();
    }

    function reset() {
      localStorage.removeItem(STORAGE_KEY);
      state = { hunger: 30, energy: 70, health: 90, asleep: false };
      log("Reset pet.");
      render();
    }

    function tick() {
      state.hunger = clamp(state.hunger + (state.asleep ? 3 : 2));

      if (state.asleep) {
        state.energy = clamp(state.energy + 8);
      } else {
        state.energy = clamp(state.energy - 3);
      }

      if (state.hunger >= 90) state.health = clamp(state.health - 2);
      if (state.energy <= 10) state.health = clamp(state.health - 1);

      if (state.health <= 0) {
        state.asleep = false;
        log("Pet fainted! Click Heal.");
      }

      render();
    }

    window.addEventListener("DOMContentLoaded", () => {
      load();

      $("feedBtn").addEventListener("click", feed);
      $("playBtn").addEventListener("click", play);
      $("sleepBtn").addEventListener("click", sleep);
      $("wakeBtn").addEventListener("click", wake);
      $("healBtn").addEventListener("click", heal);
      $("resetBtn").addEventListener("click", reset);

      log("Ready.");
      render();

      setInterval(tick, 2000);
    });