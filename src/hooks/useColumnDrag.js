import { useRef } from "react";

export default function useColumnDrag(visibleColumns, setVisibleColumns) {
  const draggedColumn = useRef(null);

  const handleDragStart = (accessor) => {
    draggedColumn.current = accessor;
  };

  const handleDrop = (targetAccessor) => {
    if (!draggedColumn.current) return;

    const newOrder = [...visibleColumns];
    const fromIndex = newOrder.indexOf(draggedColumn.current);
    const toIndex = newOrder.indexOf(targetAccessor);

    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedColumn.current);

    setVisibleColumns(newOrder);
    draggedColumn.current = null;
  };

  return { handleDragStart, handleDrop };
}
