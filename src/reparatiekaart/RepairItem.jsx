import React, { useState, useRef, useEffect } from "react";
import { Edit, Trash2, Eye, Printer, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import SendInvoiceModal from "../invoicing/SendInvoiceModal";

const RepairItem = ({
    repair,
    onStatusUpdate,
    onDelete,
    onEdit,
    onViewAttachments,
    onViewHistory,
    repairStatusOptions,
    onPrint,
    selectedRepairs,
    onSelectRepair,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showCode, setShowCode] = useState(false); // State to control code visibility
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const patternGridRef = useRef(null);

    const handleShowCode = () => {
        setShowCode(!showCode);
        if (showCode) {
            drawPattern();
        }
    };

    useEffect(() => {
        if (showCode) {
            drawPattern();
            updateCanvasOffset();
        }
    }, [showCode, repair]);

    useEffect(() => {
        const handleResize = () => {
            updateCanvasOffset();
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const updateCanvasOffset = () => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        setCanvasOffset({ x: rect.left, y: rect.top });
    };

    const drawPattern = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        if (repair?.pattern && repair?.pattern.length > 1) {
            const selectedNodes = repair.pattern.split("").map(Number).map(num => num - 1);
            if (selectedNodes.length > 1) {
                ctx.beginPath();
                selectedNodes.forEach((node, index) => {
                    const nodeElement = patternGridRef.current.children[node];
                    const x = nodeElement.offsetLeft + nodeElement.offsetWidth / 2;
                    const y = nodeElement.offsetTop + nodeElement.offsetHeight / 2;

                    if (index === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                         const prevNode = selectedNodes[index - 1]
                         const prevNodeElement = patternGridRef.current.children[prevNode];
                            const prevX = prevNodeElement.offsetLeft + prevNodeElement.offsetWidth / 2;
                          const prevY = prevNodeElement.offsetTop + prevNodeElement.offsetHeight / 2;
                        drawArrow(ctx, prevX, prevY, x, y);
                    }
                });
                ctx.stroke();
            }
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
     const handleCheckboxChange = (e) => {
         onSelectRepair(repair.repairTicketNumber, e.target.checked);
    };

    return (
         <tr
            key={repair.repairTicketNumber}
            className={`hover:bg-gray-100 ${
                selectedRepairs?.includes(repair.repairTicketNumber) ? "bg-blue-100" : ""
            }`}
        >
             <td className="border px-4 py-2">
                <input
                  type="checkbox"
                    checked={selectedRepairs?.includes(repair.repairTicketNumber) || false}
                     onChange={handleCheckboxChange}
                   />
            </td>
            <td className="border px-4 py-2">{repair.repairTicketNumber}</td>
            <td className="border px-4 py-2">{repair.customerName}</td>
            <td className="border px-4 py-2">{repair.deviceType}</td>
            <td className="border px-4 py-2">
                <select
                    value={repair.repairStatus}
                     onChange={(e) =>
                        onStatusUpdate(repair.repairTicketNumber, e.target.value)
                    }
                    className="border p-1 rounded"
                >
                    {repairStatusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </td>
             <td className="border px-4 py-2">{new Date(repair.dateReceived).toLocaleDateString()}</td>
            <td className="border px-4 py-2 relative">
               <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center  hover:bg-gray-200 p-1 rounded"
                 >
                    Actions
                       {isExpanded ? <ChevronUp size={16}/> :  <ChevronDown size={16}/> }
                 </button>
                 {isExpanded && (
                    <div className=" mt-2 bg-gray-50 border border-gray-300 p-4 rounded z-10">
                        <div className="space-y-1">
                           <p>
                                <span className="font-semibold">Phone:</span> {repair.phoneNumber}
                            </p>
                            <p>
                                <span className="font-semibold">IMEI:</span> {repair.imei || "N/A"}
                            </p>
                              {repair.usePattern ? (
                                    <p>
                                      <span className="font-semibold">Pattern:</span> {repair.pattern || "Not Set"}
                                    </p>
                                  ) : (
                                    <p>
                                       <span className="font-semibold">Access Code:</span> {repair.accessCode || "Not Set"}
                                  </p>
                                  )}
                            <p>
                                <span className="font-semibold">SIM Code:</span> {repair.simCode || "N/A"}
                            </p>
                            <p>
                                <span className="font-semibold">Issue:</span> {repair.issueDescription}
                            </p>
                            <p>
                                <span className="font-semibold">Completion:</span>{" "}
                                {repair.completionDate
                                    ? new Date(repair.completionDate).toLocaleDateString()
                                    : "N/A"}
                            </p>
                            <p>
                                <span className="font-semibold">Notes:</span> {repair.notes || "N/A"}
                            </p>
                       </div>
                         <div className="mt-2">
                                  <button onClick={handleShowCode} className="text-blue-500 hover:text-blue-700 text-sm">
                                    {showCode ? 'Hide ' : 'Show '}
                                    {repair.usePattern ? 'Pattern' : 'Access Code'}
                                   </button>
                                {showCode && (
                                    <div className="relative mt-2" style={{paddingBottom: "10px"}}>
                                        {repair.usePattern ? (
                                              <div
                                                ref={patternGridRef}
                                                    className="grid grid-cols-3 gap-4 mb-4"
                                                      style={{
                                                          width: "100px",
                                                         height: "100px",
                                                     }}
                                             >
                                                  {Array.from({length: 9 }).map((_, index) => (
                                                        <div
                                                          key={index}
                                                           className={`border rounded-full w-8 h-8 flex items-center justify-center relative
                                                               ${ repair?.pattern.split("").map(Number).map(num => num -1 ).includes(index)
                                                                  ? "bg-blue-100 text-white"
                                                                  : "bg-gray-100"
                                                             }`}
                                                          >
                                                           { repair?.pattern.split("").map(Number).map(num => num -1 ).indexOf(index) !== -1 && (
                                                                    <span className="absolute text-xs">
                                                                      {repair?.pattern.split("").map(Number).map(num => num -1 ).indexOf(index) + 1}
                                                                   </span>
                                                              )}
                                                        </div>
                                                   ))}
                                              </div>

                                       ) :  ( repair.accessCode || "N/A")}
                                               <canvas
                                                    ref={canvasRef}
                                                    width={100}
                                                     height={100}
                                                     className="absolute top-0 left-0"
                                                  />
                                       </div>
                                  )}
                       </div>
                     </div>
                  )}
            </td>
             <td className="border px-4 py-2">
                <button
                    onClick={() => onEdit(repair)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Edit"
                    style={{ marginRight: '0.5rem' }}
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={() => onViewAttachments(repair)}
                    className="text-green-500 hover:text-green-700"
                    aria-label="View Attachments"
                    style={{ marginRight: '0.5rem' }}
                >
                    <Eye size={16} />
                </button>
                   <button
                    onClick={() => onViewHistory(repair.repairTicketNumber)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="View History"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', outline: 'none', marginRight: '0.5rem' }}
                >
                    <Eye size={16} />
                </button>
                 <button
                     onClick={() => onPrint(repair)}
                     className="text-purple-500 hover:text-purple-700"
                     aria-label="Print Repair Ticket"
                     style={{ marginRight: '0.5rem' }}
                 >
                     <Printer size={16} />
                 </button>
                <button
                    onClick={() => onDelete(repair.repairTicketNumber)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete"
                    style={{ marginRight: '0.5rem' }}
                >
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};

export default RepairItem;