import Point from '../../interfaces/Point';

function generateCurvedPath(points: Point[]) {
  if (points.length < 2) {
    return '';
  }

  const pathData = `M${points[0].x},${points[0].y}` +
    points.slice(1).map((point, index, array) => {
      if (index === array.length - 1) {
        return '';
      }

      const nextPoint = array[index + 1];
      const controlPoint1 = {
        x: point.x + (nextPoint.x - point.x) * 0.3,
        y: point.y,
      };
      const controlPoint2 = {
        x: nextPoint.x - (nextPoint.x - point.x) * 0.3,
        y: nextPoint.y,
      };

      return ` C ${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${nextPoint.x},${nextPoint.y}`;
    }).join('');

  return pathData;
}

type Props = {
    points: Point[]
}

function CurvedLine({ points }: Props) {

    let remap = points.map(point => {
        if (point.x === 0) {
            return { x:  0, y: point.y + 10 }
        } else if (point.x === 99) {
            return { x: window.screen.width, y: point.y + 10 }
        } else {
            return { x: ( window.screen.width * point.x / 100) , y: point.y + 10 }
        }
    })
    const svgPath = generateCurvedPath(remap);
    return (
        <svg width="100%" height="320" className='flex flex-col justify-center items-center'>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="10%" stop-color="#1e3a8a" />
                <stop offset="50%" stop-color="#3b82f6" />
                <stop offset="70%" stop-color="#1e3a8a" />
              </linearGradient>
            </defs>
            <path d={svgPath} fill="none" stroke="url(#gradient)" strokeWidth="5" />
        </svg>
    );
}

export default CurvedLine;
