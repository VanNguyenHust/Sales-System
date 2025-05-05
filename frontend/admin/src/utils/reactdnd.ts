import { HTML5Backend } from "react-dnd-html5-backend";
import { createDragDropManager } from "dnd-core";

export const dndManager = createDragDropManager(HTML5Backend);
