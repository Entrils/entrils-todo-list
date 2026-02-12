import { TransitionGroup, CSSTransition } from "react-transition-group";
import TodoItem from "../TodoItem/TodoItem.jsx";
import styles from "../../App.module.css";

function TodoListView({ todos, getNodeRef, onToggle, onDelete, onEdit }) {
  return (
    <TransitionGroup component="div" className={styles.todoList}>
      {todos.map((todo) => {
        const nodeRef = getNodeRef(todo.id);
        return (
          <CSSTransition
            key={todo.id}
            nodeRef={nodeRef}
            timeout={300}
            classNames={{
              enter: styles.fadeEnter,
              enterActive: styles.fadeEnterActive,
              exit: styles.fadeExit,
              exitActive: styles.fadeExitActive,
            }}
          >
            <TodoItem
              ref={nodeRef}
              todo={todo}
              toggleTodo={onToggle}
              deleteTodo={onDelete}
              editTodo={onEdit}
            />
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
}

export default TodoListView;
