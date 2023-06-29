import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Cross from "./assets/icon-cross.svg";

export function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "pointer",
  };

  return (
    <div
      className="to-do-item"
      ref={setNodeRef}
      style={{
        ...style,
        ...props.style,
        display: "flex",
        justifyContent: "space-between",
      }}
      {...attributes}
      {...listeners}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          className="circle"
          onClick={props.onClickCompleted}
          style={props.isCompletedStyleButton}
        ></button>
        <p>{props.c}</p>
      </div>
      <div
        onClick={props.onClickCompleted}
        style={{ width: "100px", height: "26px" }}
      ></div>
      <button
        className="delete-btn"
        onClick={props.onClickDelete}
        style={props.styleBtns}
      >
        <img src={Cross} alt="" style={{ width: "15px" }} />
      </button>
    </div>
  );
}
