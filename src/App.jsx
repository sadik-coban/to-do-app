import "./App.css";
import LightThemeButton from "./assets/icon-sun.svg";
import DarkThemeBackgroundMobile from "./assets/bg-mobile-dark.jpg";
import LightThemeBackgroundMobile from "./assets/bg-mobile-light.jpg";
import DarkThemeBackgroundDesktop from "./assets/bg-desktop-dark.jpg";
import LightThemeBackgroundDesktop from "./assets/bg-desktop-light.jpg";
import Tick from "./assets/icon-check.svg";
import React, { useState, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableItem } from "./SortableItem";
import DarkThemeButton from "./assets/icon-moon.svg";

function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );
  const [TODOLIST, SETTODOLIST] = useState([
    { id: 1, todo: "Complete online Javascript course", isCompleted: true },
    { id: 2, todo: "Jog around the park 3x", isCompleted: false },
    { id: 3, todo: "10 minutes meditation", isCompleted: false },
    { id: 4, todo: "Read for 1 hour", isCompleted: false },
    { id: 5, todo: "Pick up groceries", isCompleted: false },
    { id: 6, todo: "Complete Todo App on Frontend Mentor", isCompleted: false },
  ]);
  const [ITEMSLIST, SETITEMSLIST] = useState([1, 2, 3, 4, 5, 6]);
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6]);
  const [todos, setTodo] = useState([
    { id: 1, todo: "Complete online Javascript course", isCompleted: true },
    { id: 2, todo: "Jog around the park 3x", isCompleted: false },
    { id: 3, todo: "10 minutes meditation", isCompleted: false },
    { id: 4, todo: "Read for 1 hour", isCompleted: false },
    { id: 5, todo: "Pick up groceries", isCompleted: false },
    { id: 6, todo: "Complete Todo App on Frontend Mentor", isCompleted: false },
  ]);
  const [value, setValue] = useState("");
  const [styleBorder, setStyleBorder] = useState("12px");
  const [displaySwitch, setDisplay] = useState({});
  const [itemLeft, setItemLeft] = useState(0);
  const [isAllActiveColor, setIsAllActiveColor] = useState({
    color: "var(--text-secondary)",
  });
  const [isActiveActiveColor, setIsActiveActiveColor] = useState({
    color: "var(--text-primary)",
  });
  const [isCompletedActiveColor, setIsCompletedActiveColor] = useState({
    color: "var(--text-primary)",
  });

  const [desktop, setDesktop] = useState({
    matches: window.matchMedia("(min-width: 768px)").matches,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  useEffect(() => {
    const handler = (e) => setDesktop({ matches: e.matches });
    window.matchMedia("(min-width: 768px)").addEventListener("change", handler);
  }, []);
  useEffect(() => {
    ActiveCount();
  }, [todos]);
  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "light" ? "#fafafa" : "hsl(235, 21%, 11%)";
  }, [theme]);

  let renderedContent;
  if (todos.length === 0) {
    renderedContent = (
      <div
        className="to-do-item"
        style={{ borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
      >
        <p>No To Do Here Create One or Change Filter!</p>
      </div>
    );
  } else {
    renderedContent = items.map((id) => {
      let isCompletedStyle =
        todos[id - 1]["isCompleted"] === true
          ? { textDecoration: "line-through" }
          : { textDecoration: "none" };
      let isCompletedStyleButton =
        todos[id - 1]["isCompleted"] === true
          ? {
              backgroundImage: `url('${Tick}'), linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%))`,
            }
          : {};
      if (id == items[0]) {
        return (
          <SortableItem
            key={id}
            id={id}
            style={{
              borderTopLeftRadius: styleBorder,
              borderTopRightRadius: styleBorder,
              ...isCompletedStyle,
            }}
            isCompletedStyleButton={isCompletedStyleButton}
            c={todos[id - 1]["todo"]}
            onClickDelete={() => {
              DeleteTodo(id);
            }}
            styleBtns={displaySwitch}
            onClickCompleted={() => {
              completed(id);
            }}
          />
        );
      } else {
        return (
          <SortableItem
            key={id}
            id={id}
            style={isCompletedStyle}
            isCompletedStyleButton={isCompletedStyleButton}
            c={todos[id - 1]["todo"]}
            onClickDelete={() => {
              DeleteTodo(id);
            }}
            styleBtns={displaySwitch}
            onClickCompleted={() => {
              completed(id);
            }}
          />
        );
      }
    });
  }
  function onSubmit(e) {
    e.preventDefault();
    setValue("");
  }
  function switchTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }
  return (
    <div className="App" data-theme={theme}>
      {desktop.matches && (
        <img
          className="bg"
          src={
            theme === "light"
              ? LightThemeBackgroundDesktop
              : DarkThemeBackgroundDesktop
          }
        />
      )}

      {!desktop.matches && (
        <img
          className="bg"
          src={
            theme === "light"
              ? LightThemeBackgroundMobile
              : DarkThemeBackgroundMobile
          }
        />
      )}

      <div className="wrapper">
        <div className="intro">
          <h1 className="todo-header">T O D O</h1>
          <button className="toggle-theme-btn" onClick={switchTheme}>
            {theme === "light" ? (
              <img src={DarkThemeButton} />
            ) : (
              <img src={LightThemeButton} />
            )}
          </button>
        </div>
        <form onSubmit={onSubmit} style={{ margin: "auto" }}>
          <div className="create-to-do">
            <button className="circle" onClick={() => AddTodo(value)}></button>
            <input
              type="text"
              name=""
              id=""
              value={value}
              style={{ width: "100%" }}
              placeholder="Create a new to do..."
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </form>
        <div className="to-do-container">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragOver={onDrag}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {renderedContent}
            </SortableContext>
          </DndContext>
        </div>
        <div className="bot-part">
          <p>{itemLeft} items left</p>
          <button className="clear-btn">Clear Completed</button>
        </div>
        <div className="filter-part">
          <button
            className="clear-btn"
            style={{ cursor: "pointer", ...isAllActiveColor }}
            onClick={() => ShowAll()}
          >
            All
          </button>
          <button
            className="clear-btn"
            style={{ cursor: "pointer", ...isActiveActiveColor }}
            onClick={() => ShowActive()}
          >
            Active
          </button>
          <button
            className="clear-btn"
            style={{ cursor: "pointer", ...isCompletedActiveColor }}
            onClick={() => ShowCompleted()}
          >
            Completed
          </button>
        </div>
        <div className="footer">
          <p>Drag and drop to reorder list</p>
        </div>
      </div>
    </div>
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex); // [1 2 3] [3 2 1]
      });
    }
    setStyleBorder("12px");
  }

  function onDrag(event) {
    const { active, over } = event;
    if (over.id == items[0]) {
      setStyleBorder("12px");
    }
    if (active.id !== over.id) {
      setStyleBorder("0px");
    }
  }

  function AddTodo(todo) {
    setTodo((prev) => [
      ...prev,
      { id: todos.length, todo: todo, isCompleted: false },
    ]);
    setItems((prev) => [...prev, todos.length + 1]);

    SETTODOLIST((prev) => [
      ...prev,
      { id: todos.length, todo: todo, isCompleted: false },
    ]);
    SETITEMSLIST((prev) => [...prev, todos.length + 1]);
  }

  function DeleteTodo(id) {
    setTodo((prev) => [
      ...prev.slice(0, id - 1),
      ...prev.slice(id, todos.length),
    ]);
    let arr = [...Array(todos.length - 1).keys()].map((x) => ++x);
    console.log(arr);
    setItems((prev) => [
      ...prev.slice(0, id - 1),
      ...[...Array(todos.length).keys()].slice(id),
    ]);

    SETTODOLIST((prev) => [
      ...prev.slice(0, id - 1),
      ...prev.slice(id, todos.length),
    ]);
    SETITEMSLIST((prev) => [
      ...prev.slice(0, id - 1),
      ...[...Array(todos.length).keys()].slice(id),
    ]);
  }
  function completed(id) {
    let isTrue = {};
    if (todos[id - 1]["isCompleted"] === true) {
      isTrue = { isCompleted: false };
    } else {
      isTrue = { isCompleted: true };
    }
    setTodo((prev) => [
      ...prev.slice(0, id - 1),
      { ...prev[id - 1], ...isTrue },
      ...prev.slice(id, prev.length),
    ]);

    SETTODOLIST((prev) => [
      ...prev.slice(0, id - 1),
      { ...prev[id - 1], ...isTrue },
      ...prev.slice(id, prev.length),
    ]);
  }
  function ShowAll() {
    setIsAllActiveColor({ color: "var(--text-secondary)" });
    setIsActiveActiveColor({ color: "var(--text-primary)" });
    setIsCompletedActiveColor({ color: "var(--text-primary)" });

    setDisplay({});
    setTodo(TODOLIST);
    setItems(ITEMSLIST);
  }
  function ShowActive() {
    setIsAllActiveColor({ color: "var(--text-primary)" });
    setIsActiveActiveColor({ color: "var(--text-secondary)" });
    setIsCompletedActiveColor({ color: "var(--text-primary)" });
    setDisplay({ display: "none" });
    let todosArr = [];

    for (let i = 0; i < TODOLIST.length; i++) {
      if (TODOLIST[i]["isCompleted"] === false) {
        todosArr.push(TODOLIST[i]);
      }
    }
    let itemArr = [...Array(todosArr.length + 1).keys()].slice(1);

    setTodo(todosArr);
    setItems(itemArr);
  }
  function ActiveCount() {
    let todosArr = [];

    for (let i = 0; i < TODOLIST.length; i++) {
      if (TODOLIST[i]["isCompleted"] === false) {
        todosArr.push(TODOLIST[i]);
      }
    }
    setItemLeft(todosArr.length);
  }
  function ShowCompleted() {
    setIsAllActiveColor({ color: "var(--text-primary)" });
    setIsActiveActiveColor({ color: "var(--text-primary)" });
    setIsCompletedActiveColor({ color: "var(--text-secondary)" });
    setDisplay({ display: "none" });
    let todosArr = [];

    for (let i = 0; i < TODOLIST.length; i++) {
      if (TODOLIST[i]["isCompleted"] === true) {
        todosArr.push(TODOLIST[i]);
      }
    }
    let itemArr = [...Array(todosArr.length + 1).keys()].slice(1);

    setTodo(todosArr);
    setItems(itemArr);
  }
}

export default App;
