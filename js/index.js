document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-task-form');
  const input = document.getElementById('new-task-description');
  const dateInput = document.getElementById('task-date');
  const personInput = document.getElementById('task-person');
  const timeInput = document.getElementById('task-time');
  const tasksList = document.getElementById('tasks-list');
  const searchInput = document.getElementById('search-input');
  const filterSelect = document.getElementById('filter-select');

  let tasks = []; // in-memory task store

  function uid() {
    return Math.random().toString(36).slice(2, 9);
  }

  function addTaskObject({desc, date, person, time}){
    const task = {
      id: uid(),
      desc: desc.trim(),
      date: date || null,
      person: person || '',
      time: time || '',
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(task);
    renderTasks();
  }

  function deleteTask(id){
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
  }

  function toggleComplete(id){
    const t = tasks.find(x => x.id === id);
    if(t) t.completed = !t.completed;
    renderTasks();
  }

  function formatMeta(t){
    const parts = [];
    if(t.person) parts.push(`Person: ${t.person}`);
    if(t.date) parts.push(`Date: ${t.date}`);
    if(t.time) parts.push(`Time: ${t.time} mins`);
    return parts.join(' • ');
  }

  function renderTasks(){
    const query = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value; // all | pending | completed

    // clear ol
    tasksList.innerHTML = '';

    // filter and search
    const visible = tasks.filter(t => {
      if(filter === 'pending' && t.completed) return false;
      if(filter === 'completed' && !t.completed) return false;
      if(query){
        const hay = (t.desc + ' ' + t.person + ' ' + (t.date||'')).toLowerCase();
        return hay.includes(query);
      }
      return true;
    });

    if(visible.length === 0){
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'No tasks match your search/filter.';
      tasksList.appendChild(li);
      return;
    }

    visible.forEach(t => {
      const li = document.createElement('li');
      if(t.completed) li.classList.add('completed');

      const left = document.createElement('div');
      left.className = 'task-left';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!t.completed;
      cb.className = 'checkbox';
      cb.addEventListener('change', () => toggleComplete(t.id));

      const textWrap = document.createElement('div');
      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = t.desc;

      const meta = document.createElement('span');
      meta.className = 'task-meta';
      meta.textContent = formatMeta(t);

      textWrap.appendChild(span);
      if(meta.textContent) textWrap.appendChild(meta);

      left.appendChild(cb);
      left.appendChild(textWrap);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Remove';
      deleteBtn.addEventListener('click', () => deleteTask(t.id));

      li.appendChild(left);
      li.appendChild(deleteBtn);

      tasksList.appendChild(li);
    });
  }

  // initial render
  renderTasks();

  // handle form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = input.value || '';
    if(!desc.trim()) return; // don't add empty tasks

    addTaskObject({
      desc,
      date: dateInput.value,
      person: personInput.value,
      time: timeInput.value
    });

    form.reset();
    input.focus();
  });

  // search and filter hooks
  searchInput.addEventListener('input', () => renderTasks());
  filterSelect.addEventListener('change', () => renderTasks());

});