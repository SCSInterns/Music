import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Ellipse, Textbox } from "fabric";

const DrawingCanvas = ({ onSubmit }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [shapeType, setShapeType] = useState("rectangle");
  const [color, setColor] = useState("#000000");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const newCanvas = new Canvas(canvasRef.current, {
      backgroundColor: "#f8f8f8",
      width: 600,
      height: 600,
    });
    setCanvas(newCanvas);

    return () => {
      newCanvas.dispose();
    };
  }, []);

  const saveState = () => {
    if (canvas) {
      setHistory((prevHistory) => [...prevHistory, canvas.toJSON()]);
    }
  };

  const deleteSelected = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  const addShape = () => {
    if (!canvas) return;
    saveState();

    let shape;
    if (shapeType === "rectangle") {
      shape = new Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 80,
        fill: color,
        selectable: true,
      });
    } else if (shapeType === "oval") {
      shape = new Ellipse({
        left: 150,
        top: 150,
        rx: 60,
        ry: 40,
        fill: color,
        selectable: true,
      });
    }

    canvas.add(shape);
    canvas.renderAll();
  };

  const addText = () => {
    if (!canvas) return;
    saveState();

    const text = new Textbox("Type here", {
      left: 200,
      top: 200,
      fontSize: 20,
      fill: color,
      editable: true,
      selectable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const exportToImage = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    fetch(dataURL)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "canvas_image.png", {
          type: "image/png",
        });

        onSubmit(file);

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "canvas_image.png";
        link.click();
      })
      .catch((error) => {
        console.error("Error converting canvas to file:", error);
      });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Controls */}
      <div className="my-4 flex space-x-4">
        <div>
          <label className="mr-2 font-semibold">Select Shape:</label>
          <select
            value={shapeType}
            onChange={(e) => setShapeType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="rectangle">Rectangle</option>
            <option value="oval">Oval</option>
          </select>
          <button
            onClick={addShape}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Shape
          </button>
        </div>

        <button
          onClick={addText}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Add Text
        </button>

        <button
          onClick={deleteSelected}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>

      {/* Color Picker */}
      <div className="my-4 flex items-center">
        <label className="mr-2 font-semibold">Select Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10"
        />
      </div>

      <div className="my-4">
        <p className="font-semibold">Create Your Venue Layout below :</p>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="border border-gray-300 shadow-lg" />

      <div className="my-6">
        <button
          onClick={exportToImage}
          className="px-4 py-2 bg-blue-700 text-white rounded"
        >
          Submit & Next
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
