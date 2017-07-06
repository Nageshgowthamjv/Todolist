let expect = chai.expect;

describe("TODO", function() {

  describe("Testing constructor", function() {
    let todo = new TODO({
      _todo: 'sample',
      _date: '11'
    });

    it("should have todo", function() {
      expect(todo.todo).to.equal('sample');
    });
    it("should have date", function() {
      expect(todo.date).to.equal('11');
    });
    it("should have id", function() {
      expect(todo.id).to.not.be.empty;
    });
    it("should have done to be false", function() {
      expect(todo.done).to.equal(false);
    });

  });

  describe("Testing Initial Values", function() {
    let todo = new TODO({
      _id: 'a23d',
      _todo: 'sample',
      _date: '11',
      _done: true
    });

    it("should have todo", function() {
      expect(todo.todo).to.equal('sample');
    });
    it("should have date", function() {
      expect(todo.date).to.equal('11');
    });
    it("should have id", function() {
      expect(todo.id).to.not.be.empty;
    });
    it("should have done to be false", function() {
      expect(todo.done).to.equal(true);
    });

  });

  describe("Testing Ids genetated are unique", function() {
    let todo1 = new TODO({
      _todo: 'sample1',
      _date: '11'
    });
    let todo2 = new TODO({
      _todo: 'sample2',
      _date: '13'
    });

    it("testing Id generated are unique", function() {
      expect(todo1.id).to.not.equal(todo2.id);
    });

  });

});


describe("TODO List", function() {

  describe("Testing empty constructor", function() {
    let todos = new TODOList();

    it("todos should be empty", function() {
      expect(todos.todos.length).to.equal(0);
    });

    it("last state should be empty", function() {
      expect(todos._lastState.length).to.equal(0);
    });
  });

  describe("Testing constructor", function() {

    let todos = new TODOList([new TODO({
      _todo: 'sample1',
      _date: '11'
    })]);

    it("check if todo is added", function() {
      expect(todos.todos.length).to.equal(1);
    });

    it("check if backup is taken", function() {
      expect(todos._lastState.length).to.equal(0);
    });

  });

  describe("Testing addTODO", function() {
    localStorage.setItem('todos', '[]');
    let todos = new TODOList();

    it("check if todo is added", function() {

      todos.addTODO(new TODO({
        _todo: 'sample1',
        _date: '11'
      }));
      expect(todos.todos.length).to.equal(1);
    });

    it("check if backup is taken", function() {
      expect(todos._lastState.length).to.equal(0);
    });

    it("check if backup is taken after adding", function() {
      todos.addTODO(new TODO({
        _todo: 'sample1',
        _date: '11'
      }));
      expect(todos._lastState.length).to.equal(1);
    });

  });

  describe("Testing setDeleted", function() {
    localStorage.setItem('todos', '[]');
    let todos = new TODOList();
    todos.addTODO(new TODO({
      _todo: 'sample1',
      _date: '11'
    }));

    it("check if todo is added", function() {
      todos.setDeleted([todos.todos[0].id]);

      expect(todos.todos.length).to.equal(0);
    });

    it("check if backup is taken", function() {
      expect(todos._lastState.length).to.equal(1);
    });

  });

  describe("Testing setDone", function() {
    localStorage.setItem('todos', '[]');
    let todos = new TODOList();
    todos.addTODO(new TODO({
      _todo: 'sample1',
      _date: '11'
    }));

    it("check if todo is added", function() {
      todos.setDone([todos.todos[0].id]);
      expect(todos.todos[0].done).to.equal(true);
    });

    it("check if backup is taken", function() {
      expect(todos._lastState.length).to.equal(1);
    });

  });



});