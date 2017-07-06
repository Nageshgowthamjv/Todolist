class TODO {

	constructor(todo) {
		this._id = todo._id || Math.random().toString(16).slice(-4);
		this._date = todo._date;
		this._todo = todo._todo;
		this._done = todo._done || false;
	}

	set id(id) {
		this._id = id;
	}
	get id() {
		return this._id;
	}

	set date(date) {
		this._date = date;
	}
	get date() {
		return this._date;
	}

	set todo(todo) {
		this._todo = todo;
	}
	get todo() {
		return this._todo;
	}

	set done(done) {
		this._done = done;
	}
	get done() {
		return this._done;
	}

}

class TODOList {

	constructor(todoItems) {
		this._todos = todoItems || [];
		this._lastState = [];
	}

	get todos() {
		return this._todos;
	}
	set todos(todos) {
		this._todos = todos;
	}

	addTODO(todo) {
		this.backupTODO();

		var active = [];
		for (var i = 0; i < this._todos.length; i++) {
			active.push(this._todos[i]);
		}
		active.push(todo);

		this.todos = active;
		this.save();
	}

	setDeleted(todoId) {
		this.backupTODO();
		var active = [];
		for (var i = 0; i < this._todos.length; i++) {
			if (!todoId.includes(this._todos[i].id)) {
				active.push(this._todos[i]);
			}
		}
		this._todos = active;
		this.save();
	}
	setDone(done) {
		this.backupTODO();
		var active = [];
		for (var i = 0; i < this._todos.length; i++) {
			var doneTodo = this._todos[i];
			if (done.includes(this._todos[i].id)) {
				doneTodo = new TODO(Object.assign({}, this._todos[i]));
				doneTodo.done = true;
			}
			active.push(doneTodo);
		}
		this._todos = active;
		this.save();
	}

	backupTODO() {
		this._lastState = this._todos;
	}

	restoreTODO() {
		if (this._lastState.length > 0) {
			this._todos = this._lastState;
			this._lastState = [];
			this.save();
		}
	}

	save() {
		localStorage.setItem('todos', JSON.stringify(this._todos));
	}
}

var items = JSON.parse(localStorage.getItem('todos')) || [];
var todoItems = items.map(x => new TODO(x));

var todos = new TODOList(todoItems);

todos.todos.forEach(function(todo) {
	showTODO(todo);
});

function showTODO(todo) {

	var checkbox = document.createElement("input");
	checkbox.type = 'checkbox';

	var todoInfo = document.createElement("div");
	todoInfo.className = 'todoInfo';
	todoInfo.appendChild(checkbox);
	todoInfo.appendChild(document.createTextNode(todo.todo));

	var deleteSpan = document.createElement("span");
	deleteSpan.className = "delete";
	deleteSpan.appendChild(document.createTextNode("Delete"));
	deleteSpan.onclick = function() {
		var todoli = this.parentElement.parentElement;
		todos.setDeleted([todoli.id]);
		todoli.remove();
		document.getElementById('undo').className = '';
	};

	var todoAction = document.createElement("div");
	todoAction.className = 'todoAction';
	todoAction.appendChild(deleteSpan);

	var li = document.createElement("li");
	li.setAttribute('id', todo.id);
	li.appendChild(todoInfo);
	li.appendChild(todoAction);
	if (todo.done) {
		li.className = 'done';
	}

	document.getElementById('todos').appendChild(li);

}

document.getElementById('add').addEventListener('click', function() {
	document.getElementById('error').innerText = '';
	document.getElementById('undo').className = '';
	var todotext = document.getElementById('todo').value;
	if (todotext) {
		if (todos.todos.length > 9) {
			document.getElementById('error').innerText = ' Can able to add maximum 10 items';
		} else if (todotext.replace(/ /g, '').length > 120) {
			document.getElementById('error').innerText = 'Maximum lenght cannot exceed 120 characters ( excluding space )';
		} else {
			var todo = new TODO({
				_date: '11',
				_todo: todotext
			});
			document.getElementById('todo').value = '';
			todos.addTODO(todo);
			showTODO(todo);
		}
	} else {
		document.getElementById('error').innerText = 'Item cannot be empty';
	}
}, false);

document.getElementById('search').addEventListener('click', function() {
	document.getElementById('undo').className = 'hide';
	var todotext = document.getElementById('todo').value;
	if (todotext) {
		document.getElementById('todos').innerHTML = '';
		document.getElementById('todo').value = ''
		todos.todos.forEach(function(todo) {
			if (todo.todo.includes(todotext)) {
				showTODO(todo);
			}
		});
	} else {
		document.getElementById('error').innerText = 'Item cannot be empty';
	}
}, false);

document.getElementById('reset').addEventListener('click', function() {
	document.getElementById('undo').className = 'hide';
	document.getElementById('todo').value = '';
	document.getElementById('todos').innerHTML = '';
	todos.todos.forEach(function(todo) {
		showTODO(todo);
	});
}, false);

document.getElementById('delete').addEventListener('click', function() {
	document.getElementById('undo').className = '';
	var deleteMarked = [];
	document.getElementById('todos').querySelectorAll('input').forEach(function(input) {
		if (input.checked) {
			var todoli = input.parentElement.parentElement;
			deleteMarked.push(todoli.id);
			todoli.remove();
		}
	});
	if (deleteMarked.length > 0) {
		todos.setDeleted(deleteMarked);
		document.getElementById('undo').className = '';
	}

}, false);

document.getElementById('done').addEventListener('click', function() {

	document.getElementById('undo').className = '';
	var done = [];
	document.getElementById('todos').querySelectorAll('input').forEach(function(input) {
		if (input.checked) {
			var todoli = input.parentElement.parentElement;
			done.push(todoli.id);
			todoli.className = 'done';
		}
	});
	if (done.length > 0) {
		todos.setDone(done);
		document.getElementById('undo').className = '';
	}

}, false);

document.getElementById('undo').addEventListener('click', function() {
	document.getElementById('undo').className = 'hide';
	document.getElementById('todo').value = '';
	document.getElementById('todos').innerHTML = '';
	todos.restoreTODO();
	todos.todos.forEach(function(todo) {
		showTODO(todo);
	});
}, false);