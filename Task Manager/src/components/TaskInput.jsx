function TaskInput({
  text,
  setText,
  addTask,
  search,
  setSearch,
  searchOpen,
  setSearchOpen
}) {
  return (
    <div className="input-wrapper">
      {/* NORMAL INPUT */}
      <div
        className={`input-section ${
          searchOpen ? "slide-left" : "slide-center"
        }`}
      >
        <input
          type="text"
          placeholder="Enter task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />

        <button onClick={addTask}>Add</button>

        <button
          className="search-btn"
          onClick={() => setSearchOpen(true)}
        >
          🔍
        </button>
      </div>

      {/* SEARCH INPUT */}
      <div
        className={`search-section ${
          searchOpen ? "slide-center" : "slide-right"
        }`}
      >
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="search-btn"
          onClick={() => {
            setSearchOpen(false);
            setSearch("");
          }}
        >
          ✖
        </button>
      </div>
    </div>
  );
}

export default TaskInput;