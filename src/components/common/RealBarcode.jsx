import React, { useMemo } from 'react';
import { encodeCode128B } from '../../utils/barcodeEncoder';

export const RealBarcode = ({
  value,
  height = 46,
  barColor = '#06254E',
  background = '#FFFFFF',
  showText = true,
  className = ''
}) => {
  const encoded = useMemo(() => encodeCode128B(value), [value]);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <svg
        role="img"
        aria-label={`Barcode ${encoded.sanitized}`}
        viewBox={`0 0 ${encoded.totalWidth} ${height}`}
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: `${height}px`,
          display: 'block',
          backgroundColor: background,
          shapeRendering: 'crispEdges',
          borderRadius: '4px'
        }}
      >
        <rect x="0" y="0" width={encoded.totalWidth} height={height} fill={background} />
        {encoded.bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={0}
            width={bar.w}
            height={height}
            fill={barColor}
          />
        ))}
      </svg>

      {showText && (
        <div
          dir="ltr"
          style={{
            marginTop: '5px',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '2px',
            color: barColor,
            userSelect: 'all'
          }}
        >
          {encoded.sanitized}
        </div>
      )}
    </div>
  );
};

export default RealBarcode;
