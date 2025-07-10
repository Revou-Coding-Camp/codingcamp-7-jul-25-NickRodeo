document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const taskInput = document.getElementById("list");
  const dateInput = document.getElementById("date");
  const deleteAllBtn = document.getElementById("delete-all");
  const tbody = document.querySelector("tbody");

  const filterStatus = document.getElementById("filter-status");
  const filterDate = document.getElementById("filter-date");
  const filterAbjad = document.getElementById("filter-abjad");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function applyFilters() {
    let filtered = [...tasks];

    //Filter Status
    if (filterStatus.value === "done")
      filtered = filtered.filter((task) => task.done);
    else if (filterStatus.value === "undone")
      filtered = filtered.filter((task) => !task.done);

    //Filter Abjad
    if (filterAbjad.value === "az")
      filtered.sort((a, b) => a.text.localeCompare(b.text));
    else if (filterAbjad.value === "za")
      filtered.sort((a, b) => b.text.localeCompare(a.text));

    //Filter Date
    if (filterDate.value === "asc")
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (filterDate.value === "desc")
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderTasks(filtered);
  }

  function renderTasks(filteredTasks = tasks) {
    tbody.innerHTML = "";

    if (filteredTasks.length <= 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-pink-200">No Tasks Found</td></tr>`;
      return;
    }

    filteredTasks.forEach((task) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td class="text-center p-2">${task.text}</td>
          <td class="text-center p-2">${task.date}</td>
          <td class="text-center p-2">${
            task.done ? "✅ Selesai" : "❌ Belum"
          }</td>
          <td class="text-center p-2 space-x-2 flex justify-center">
            <button class="cursor-pointer bg-green-500 hover:bg-green-700 text-pink-200 px-2 py-1 rounded toggle-btn" data-index="${tasks.indexOf(
              task
            )}">
              ${task.done ? "Undo" : "Done"}
            </button>
            <button class="cursor-pointer bg-red-500 hover:bg-red-700 text-pink-200 px-2 py-1 rounded delete-btn" data-index="${tasks.indexOf(
              task
            )}">
              Delete
            </button>
          </td>
        `;

      //Toggle Button
      row.querySelector(".toggle-btn").addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        tasks[index].done = !tasks[index].done;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        applyFilters();
      });

      //Delete Button
      row.querySelector(".delete-btn").addEventListener("click", (e) => {
        if (confirm("Yakin ingin menghapus tugas ini?")) {
          const index = parseInt(e.target.dataset.index);
          tasks.splice(index, 1);
          localStorage.setItem("tasks", JSON.stringify(tasks));
          applyFilters();
        }
      });

      tbody.appendChild(row);
    });
  }

  //Add Task
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (taskInput.value === "" || dateInput.value === "") {
      alert("Please fill in both task and due date.");
      form.reset();
      return;
    }

    const newTask = {
      text: taskInput.value,
      date: dateInput.value,
      done: false,
    };

    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    applyFilters();
    form.reset();
  });

  //Delete All
  deleteAllBtn.addEventListener("click", () => {
    if (confirm("Yakin ingin menghapus semua tugas?")) {
      tasks = [];
      localStorage.setItem("tasks", JSON.stringify(tasks));
      applyFilters();
    }
  });

  //Filter
  filterStatus.addEventListener("change", applyFilters);
  filterDate.addEventListener("change", applyFilters);
  filterAbjad.addEventListener("change", applyFilters);

  applyFilters();
});
