import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const sampleData = [
  {
    parcelName: "Parcel A",
    area: "15,234.56 sq ft",
    perimeter: "1,234.50 ft",
    closureError: 0.01,
    precision: 291872.202,
    directionError: "N 89°59'59\" E",
    segments: [
      {
        lineNo: 1,
        type: "line",
        bearing: "N 45°00'00\" E",
        distance: "250.00 ft",
        delta: "-",
        radius: "-",
        arcLength: "-"
      },
      {
        lineNo: 2,
        type: "curve",
        bearing: "S 45°00'00\" E",
        distance: "300.00 ft",
        delta: "22°30'00\"",
        radius: "100.00 ft",
        arcLength: "39.27 ft",
        chord: "98.00 ft"
      },
    ]
  },
  {
    parcelName: "Parcel B",
    area: "10,000.00 sq ft",
    perimeter: "1,000.00 ft",
    closureError: 0.02,
    precision: 15483.202,
    directionError: "S 45°00'00\" W",
    segments: [
      {
        lineNo: 1,
        type: "line",
        bearing: "N 30°00'00\" W",
        distance: "200.00 ft",
        delta: "-",
        radius: "-",
        arcLength: "-"
      },
      {
        lineNo: 2,
        type: "curve",
        bearing: "S 60°00'00\" E",
        distance: "300.00 ft",
        delta: "22°30'00\"",
        radius: "100.00 ft",
        arcLength: "39.27 ft",
        chord: "95.00 ft"
      },
    ]
  }
];

export default function ParcelMapcheckViewer() {
  const [highlightedCells, setHighlightedCells] = useState({});
  const [collapsed, setCollapsed] = useState({});

  const handleCellClick = (parcelIndex, rowIndex, cellKey) => {
    const cellId = `${parcelIndex}-${rowIndex}-${cellKey}`;
    setHighlightedCells((prev) => ({
      ...prev,
      [cellId]: !prev[cellId]
    }));
  };

  const getCellStyle = (parcelIndex, rowIndex, cellKey) => {
    const cellId = `${parcelIndex}-${rowIndex}-${cellKey}`;
    return highlightedCells[cellId] ? { backgroundColor: "orange" } : {};
  };

  const toggleCollapse = (index) => {
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const isParcelHighlighted = (parcelIndex) => {
    return Object.keys(highlightedCells).some(key => key.startsWith(`${parcelIndex}-`) && highlightedCells[key]);
  };

  const renderSegmentRow = (seg, parcelIndex, rowIndex) => {
    if (seg.type === "line") {
      return (
        <tr key={rowIndex}>
          <td style={getCellStyle(parcelIndex, rowIndex, 'lineNo')} onClick={() => handleCellClick(parcelIndex, rowIndex, 'lineNo')}>{seg.lineNo}</td>
          <td style={getCellStyle(parcelIndex, rowIndex, 'bearing')} onClick={() => handleCellClick(parcelIndex, rowIndex, 'bearing')}>{seg.bearing}</td>
          <td style={getCellStyle(parcelIndex, rowIndex, 'distance')} onClick={() => handleCellClick(parcelIndex, rowIndex, 'distance')}>{seg.distance}</td>
          <td colSpan={4}></td>
        </tr>
      );
    } else if (seg.type === "curve") {
      return (
        <tr key={rowIndex}>
          <td style={getCellStyle(parcelIndex, rowIndex, 'lineNo')} onClick={() => handleCellClick(parcelIndex, rowIndex, 'lineNo')}>{seg.lineNo}</td>
          <td colSpan={1}></td>
          <td colSpan={1}></td>
          <td style={getCellStyle(parcelIndex, rowIndex, 'delta')} onClick={() => handleCellClick(parcelIndex, rowIndex, 'delta')}>{seg.delta}</td>
          <td style={getCellStyle(parcelIndex, rowIndex, 'radius')} onClick={() => handleCellClick(parcelIndex, rowIndex, 'radius')}>{seg.radius}</td>
          <td style={getCellStyle(parcelIndex, rowIndex, 'arcLength')} onClick={() => handleCellClick(parcelIndex, rowIndex, 'arcLength')}>{seg.arcLength}</td>
          <td style={getCellStyle(parcelIndex, rowIndex, 'chord')} onClick={() => handleCellClick(parcelIndex, rowIndex, 'chord')}>{seg.chord || '-'}</td>
        </tr>
      );
    }
    return null;
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Civil 3D Parcel Mapcheck Viewer</h2>
      {sampleData.map((parcel, parcelIndex) => (
        <div key={parcelIndex} className="mb-3">
          <div className="card">
            <div
              className="card-header"
              onClick={() => toggleCollapse(parcelIndex)}
              style={{
                cursor: 'pointer',
                backgroundColor: isParcelHighlighted(parcelIndex) ? 'orange' : ''
              }}
            >
              <h5 className="mb-0">{parcel.parcelName}</h5>
            </div>
            {!collapsed[parcelIndex] && (
              <div className="card-body">
                <p className="card-text">
                  <div class="row">
                    <div class="col-md-6">
                      Misclosure: <strong>{parcel.closureError.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong> feet
                    </div>
                    <div class="col-md-6">
                      Precision: 1 in <strong>{parcel.precision.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong> feet
                    </div>
                    <div className="col-md-4">
                      Area: {parcel.area} <br />
                    </div>
                    <div className="col-md-4">
                      Perimeter: {parcel.perimeter} <br />
                    </div>
                    <div className="col-md-4">
                      Direction Error: {parcel.directionError}
                    </div>
                  </div>
                </p>
                <table className="table table-striped mt-4">
                  <thead>
                    <tr>
                      <th>Line No</th>
                      <th>Bearing</th>
                      <th>Distance</th>
                      <th>Delta</th>
                      <th>Radius</th>
                      <th>Arc Length</th>
                      <th>Chord</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parcel.segments.map((seg, rowIndex) => renderSegmentRow(seg, parcelIndex, rowIndex))}
                  </tbody>
                </table>
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id={`note-${parcelIndex}`} placeholder="no note"></input>
                  <label for={`note-${parcelIndex}`}>Parcel notes</label>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
