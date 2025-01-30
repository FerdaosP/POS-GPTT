import React, { useState, useRef, useEffect } from 'react';

const PatternModal = ({ isOpen, onClose, onPatternSelect, gap = 2 }) => {
  const [selectedNodes, setSelectedNodes] = useState([]);
  const patternGridRef = useRef(null);
  const canvasRef = useRef(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setSelectedNodes([]);
      drawPattern();
      updateCanvasOffset();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      updateCanvasOffset();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedNodes.length > 1) {
      drawPattern();
    }
  }, [selectedNodes]);

  const updateCanvasOffset = () => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setCanvasOffset({ x: rect.left, y: rect.top });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawPattern = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    clearCanvas();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    if (selectedNodes.length > 1) {
      ctx.beginPath();
      for (let i = 1; i < selectedNodes.length; i++) {
        const fromNode = selectedNodes[i - 1];
        const toNode = selectedNodes[i];

        const fromElement = patternGridRef.current.children[fromNode];
        const toElement = patternGridRef.current.children[toNode];

        const fromX = fromElement.offsetLeft + fromElement.offsetWidth / 2 - canvasOffset.x;
        const fromY = fromElement.offsetTop + fromElement.offsetHeight / 2 - canvasOffset.y;
        const toX = toElement.offsetLeft + toElement.offsetWidth / 2 - canvasOffset.x;
        const toY = toElement.offsetTop + toElement.offsetHeight / 2 - canvasOffset.y;
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        drawArrow(ctx, fromX, fromY, toX, toY);
      }
      ctx.stroke();
    }
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const headLength = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  const handlePatternNodeClick = (nodeIndex) => {
    if (selectedNodes.includes(nodeIndex)) {
      setSelectedNodes(prev => prev.filter((node, i) => node !== nodeIndex && i <= selectedNodes.indexOf(nodeIndex)));
    } else {
      setSelectedNodes(prev => [...prev, nodeIndex]);
    }
    drawPattern();
  };

  const handleConfirmPattern = () => {
    const patternString = selectedNodes.map((node) => node + 1).join("");
    onPatternSelect(patternString);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Draw Pattern</h2>
        <div className="relative w-full h-full">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="absolute top-0 left-0"
          />
          <div
            ref={patternGridRef}
            className={`grid grid-cols-3 gap-${gap} w-[300px] h-[300px] relative`}
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                onClick={() => handlePatternNodeClick(index)}
                className={`border rounded-full w-16 h-16 flex items-center justify-center cursor-pointer relative ${
                  selectedNodes.includes(index) ? 'bg-blue-100 text-white' : 'bg-gray-100'
                }`}
              >
                {selectedNodes.includes(index) && (
                  <span className="text-white font-bold">
                    {selectedNodes.indexOf(index) + 1}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between space-x-2 mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleConfirmPattern}
            disabled={selectedNodes.length < 1}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternModal;